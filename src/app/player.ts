import * as discord from "discord.js"
import knex from "knex"

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

/**
 * Save the player in the database
 */
export async function save(player: Player): Promise<void> {}

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
