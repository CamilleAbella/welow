import * as app from "../app"

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
 * Generate fight stats from player
 * @todo use easing curves!
 */
export function generateStats(player: app.Player): app.Stats {
  return {
    hp: player.level * 4,
    actionInterval: player.level / 2,
  }
}
