import knex from "knex"

import * as app from "../app"

export interface FightResults {
  winner?: app.Fighter
  loser?: app.Fighter
  logs: FightLog[]
}

export interface FightContext {
  me: app.Fighter
  enemy: app.Fighter
  fight: app.Fight
}

export interface FightLog {
  fighter: app.Fighter
  action: app.Action
  at: number
}

export class Fight {
  private progress = 0
  private players: app.Player[]
  private fighters: app.Fighter[]
  private decks: app.Card[][] = []
  logs: FightLog[] = []

  constructor(public attacking: app.Player, public defensing: app.Player) {
    this.players = [this.attacking, this.defensing]
    this.fighters = this.players.map(app.getFighter)
  }

  fighter(id: app.Snowflake | null): app.Fighter {
    return this.fighters.find((fighter) => fighter.id === id) as app.Fighter
  }

  not(fighter: app.Fighter): app.Fighter {
    return this.fighters[Number(!this.fighters.indexOf(fighter))]
  }

  shuffle(fighter: app.Fighter) {
    this.decks[this.index(fighter)] = this.deck(fighter).sort()
  }

  draft(fighter: app.Fighter): app.Card {
    const card = this.deck(fighter).shift() as app.Card
    this.deck(fighter).push(card)
    return card
  }

  deck(fighter: app.Fighter): app.Card[] {
    return this.decks[this.index(fighter)]
  }

  index(fighter: app.Fighter): number {
    return this.fighters.indexOf(fighter)
  }

  applyDamageTo(
    enemy: app.Fighter,
    damages: number,
    element?: app.ElementName
  ): boolean {
    //todo: compare resistances and weaknesses before applying damages
    enemy.hp = Math.max(0, enemy.hp - damages)
    return true
  }

  async run(): Promise<app.FightResults> {
    this.decks = [
      await app.getDeck(this.players[0]),
      await app.getDeck(this.players[1]),
    ]

    // todo: process fight
    while (this.fighters.every((fighter) => fighter.hp > 0)) {
      this.fighters.forEach((fighter) => {
        fighter.progress += fighter.speed
        fighter.globalProgress += fighter.speed

        if (fighter.progress >= 1) {
          fighter.progress -= 1

          const card = this.draft(fighter)

          for (const action of card.actions) {
            const success = action.run({
              fight: this,
              enemy: this.not(fighter),
              me: fighter,
            })

            if (success) {
              this.logs.push({
                at: fighter.globalProgress,
                action,
                fighter,
              })
            }
          }
        }
      })
    }

    const winner = this.fighters.find((fighter) => fighter.hp > 0)
    const loser = winner ? this.not(winner) : undefined

    return {
      winner,
      loser,
      logs: this.logs,
    }
  }
}

export async function makeFight(
  attacking: app.Player,
  defensing: app.Player
): Promise<app.FightResults> {
  return new Fight(attacking, defensing).run()
}

/**
 * Find an enemy for fight (using elo)
 */
export async function matchmaking(
  player: app.Player
): Promise<app.Player | undefined> {
  const available: app.Player[] = await knex("app.Player")
    .whereRaw("id != ?", player.id)
    .select("elo")

  const playersByRank = app.groupBy(available, "elo")

  let time = 1
  let eloRank = player.elo
  let findHigher = true

  while (playersByRank.size > 0) {
    const rankPlayers = playersByRank.get(eloRank)

    if (rankPlayers) {
      return rankPlayers[Math.floor(Math.random() * rankPlayers.length - 1)]
    }

    playersByRank.delete(eloRank)

    eloRank += findHigher ? time : -time
    findHigher = !findHigher
    time++
  }
}
