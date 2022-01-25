import * as discord from "discord.js"
import knex from "knex"
import fight from "../commands/fight"

export interface Stats {
  /**
   * Represent the health points
   */
  hp: number

  /**
   * Represent the action count per turn as fraction (1/2) or number (.5)
   */
  actionInterval: number
}

/**
 * @todo: all possible buffs
 */
export interface Buff {}

export interface Stuff {}

export type Fighter = Player &
  Stats & {
    actionCharge: number
  }

export interface FightResults {
  winner: Player
}

/**
 * Represent a player in database
 * @todo add table player in database
 */
export interface Player {
  /**
   * Player is a bot ?
   * @todo: not includes bots in ranked leaderboard
   */
  bot: boolean
  /**
   * Represent the Discord User id
   */
  id: discord.Snowflake
  /**
   * Represent the level of experience
   */
  level: number
  /**
   * Represent the elo rank
   * @todo ranked matchmaking use this property
   */
  elo: number
  /**
   * Represent the total count of victories
   */
  victories: number
  /**
   * Represent the total count of defeats
   */
  defeats: number
}

export async function makeFight(
  attacking: Player,
  defensing: Player
): Promise<FightResults> {
  const players = [attacking, defensing]

  const fighters = players.map(getFighter)

  // todo: process fight
  while (fighters.every((fighter) => fighter.hp > 0)) {
    fighters.forEach((fighter) => {
      fighter.actionCharge += fighter.actionInterval

      if (fighter.actionCharge > 1) {
        fighter.actionCharge -= 1

        // action!
      }
    })
  }

  return {
    winner: players[0],
  }
}

/**
 * Find an enemy for fight (using elo)
 */
export async function matchmaking(player: Player): Promise<Player | undefined> {
  const available: Player[] = await knex("player")
    .whereRaw("id != ?", player.id)
    .select("elo")

  const playersByRank = groupBy(available, "elo")

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

export function getPlayer(): Player
export function getPlayer(user: discord.User): Promise<Player | undefined>
export function getPlayer(
  user?: discord.User
): Player | Promise<Player | undefined> {
  if (!user) {
    // make bot player
    return {
      bot: true,
      id: discord.SnowflakeUtil.generate(),
      level: 1,
      elo: 0,
      defeats: 0,
      victories: 0,
    }
  } else {
    // get player from database
    return knex("player").where({ id: user.id }).first()
  }
}

export function getFighter(player: Player): Fighter {
  // generate stats from level
  // apply stuff bonus and malus
  // return fighter
  return {
    ...player,
    ...generateStats(player),
    actionCharge: 0,
  }
}

/**
 * Generate fight stats from player
 * @todo use easing curves!
 */
export function generateStats(player: Player): Stats {
  return {
    hp: player.level * 4,
    actionInterval: player.level / 2,
  }
}

/**
 * Save the player in the database
 */
export async function save(player: Player): Promise<void> {}

export function getBuffs(fighter: Fighter): Buff[] {
  return []
}

export async function getStuffs(fighter: Fighter): Promise<Stuff[]> {
  return await knex("stuff").where({ userId: fighter.id })
}

export async function generateBots(botCount: number, stepCount: number) {
  await knex("player").delete().where({ bot: false })

  const shopItems = await knex("shop")

  // create x bots

  const bots: Player[] = []

  for (let i = 0; i < botCount; i++) {
    bots.push(getPlayer())
  }

  // for each step {
  //   for each bot {
  //     ranked fight
  //     if bot can buy stuff in shop: do it
  //     if stuff is limited : keep the best stuff
  //   }
  // }

  for (let step = 0; step < stepCount; step++) {
    for (const bot of bots) {
      const enemy = await matchmaking(bot)
      const result = await makeFight(bot, enemy)

      if (result.winner === bot) {
      }
    }
  }

  await knex<Player>("player").insert(bots)
}

export function groupBy<T, K extends keyof T & string>(
  list: T[],
  prop: K
): Map<T[K], T[]> {
  const groups = new Map<T[K], T[]>()

  list.forEach((item) => {
    const value = item[prop]

    if (groups.has(value)) groups.get(value).push(item)
    else groups.set(value, [item])
  })

  return groups
}
