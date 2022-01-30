import * as app from "../app"

export interface Fighter extends app.Player {
  /**
   * Represent the health points
   */
  hp: number

  /**
   * Represent the additional force on attack
   */
  force: number

  /**
   *
   */

  /**
   * Represent the speed of user
   */
  speed: number

  /**
   * Represent the armor HP (can not be healed)
   */
  armor: number

  /**
   * Represent the initiative (make the best choices)
   */
  progress: number

  /**
   *  Represent the advancement of fighter
   */
  globalProgress: number

  /**
   * Represent the prospective (percentage of added gains)
   */
  prospective: number

  /**
   * Count of blocked attacks
   */
  shield: number

  /**
   * Represent buffs
   */
  buffs: app.Buff[]
}

export type FighterStats = Omit<Fighter, keyof app.Player>

export function getFighter(player: app.Player): Fighter {
  // generate stats from level
  // apply stuff bonus and malus
  // return fighter
  const stats = app.getClassStats(player)
  return {
    ...player,
    force: 2 + player.level / 2 + (stats.force ?? 0),
    speed: 1 + player.level / 50 + (stats.speed ?? 0),
    progress: player.level / 50 + (stats.progress ?? 0),
    armor: stats.armor ?? 0,
    shield: stats.shield ?? 0,
    hp: 10 + player.level * 2 + (stats.hp ?? 0),
    prospective: player.level / 50 + (stats.prospective ?? 0),
    buffs: [...(stats.buffs ?? [])],
    globalProgress: 0,
  }
}
