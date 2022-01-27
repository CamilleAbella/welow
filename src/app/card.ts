import * as app from "../app"

export interface Card {
  name: string
  actions: Action[]
}

/**
 * <pre>
 *   fire can burn ()
 *   ice can freeze
 *   electric can stunt
 *   radioactive can poisoning ()
 * </pre>
 */
export type ElementName =
  | "plant"
  | "water"
  | "fire"
  | "ice"
  | "electric"
  | "radioactive"

export class Action {
  constructor(
    public name: string,
    public run: (ctx: app.FightContext) => boolean
  ) {}
}

export function getCard(name: string) {
  return cards.find((card) => card.name === name)
}

export const cards: Card[] = [
  {
    name: "attack",
    actions: [
      new app.Action("attack", (ctx) => {
        if (ctx.enemy.shield) {
          ctx.enemy.shield--
          return false
        }

        const buffs = app.getResolvedBuffs(ctx.me)
        const enemyBuffs = app.getResolvedBuffs(ctx.enemy)

        const damages = ctx.me.force + buffs.force

        if (ctx.enemy.armor > 0) {
          ctx.enemy.armor -= damages
          if (ctx.enemy.armor < 0) {
            if (enemyBuffs.armor > 0) {
              for (const buff of ctx.enemy.buffs) {
                if (buff.armor !== undefined) {
                  buff.armor -= ctx.enemy.armor
                  if (buff.armor < 0) {
                    ctx.enemy.hp -= buff.armor
                    delete buff.armor
                  }
                  if (app.isEmpty(buff)) {
                    ctx.enemy.buffs = ctx.enemy.buffs.filter((b) => b !== buff)
                  }
                }
              }
            } else {
              ctx.enemy.hp -= ctx.enemy.armor
            }
            ctx.enemy.armor = 0
          }
        } else {
          ctx.enemy.hp -= damages
        }
        return true
      }),
    ],
  },
]
