import * as discord from "discord.js"
import knex from "knex"

import * as app from "../app"

export interface FightResults {
  winner?: app.Fighter
  loser?: app.Fighter
}

export class Fight {
  players: app.Player[]
  fighters: app.Fighter[]

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
    // todo: process fight
    while (this.fighters.every((fighter) => fighter.hp > 0)) {
      this.fighters.forEach((fighter) => {
        fighter.actionCharge += fighter.actionInterval

        if (fighter.actionCharge > 1) {
          fighter.actionCharge -= 1

          // action!
        }
      })
    }

    return {}
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
