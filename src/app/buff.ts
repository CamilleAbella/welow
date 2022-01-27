import * as app from "../app"

export type Buff = Partial<Omit<app.FighterStats, "buffs">>

export function getResolvedBuffs(
  fighter: app.Fighter
): Omit<app.FighterStats, "buffs"> {
  return {
    hp: fighter.buffs.reduce((acc, buff) => acc + (buff.hp ?? 0), 0),
    armor: fighter.buffs.reduce((acc, buff) => acc + (buff.armor ?? 0), 0),
    force: fighter.buffs.reduce((acc, buff) => acc + (buff.force ?? 0), 0),
    progress: fighter.buffs.reduce(
      (acc, buff) => acc + (buff.progress ?? 0),
      0
    ),
    prospective: fighter.buffs.reduce(
      (acc, buff) => acc + (buff.prospective ?? 0),
      0
    ),
    shield: fighter.buffs.reduce((acc, buff) => acc + (buff.shield ?? 0), 0),
    speed: fighter.buffs.reduce((acc, buff) => acc + (buff.speed ?? 0), 0),
  }
}

export function isEmpty(buff: Buff) {
  return Object.values(buff).length === 0
}
