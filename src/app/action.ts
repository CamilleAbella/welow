import * as app from "../app"

export type ActionName = keyof Actions
export type ElementName = "plant" | "water" | "fire"

export class Action<Name extends ActionName> {
  constructor(
    public name: Name,
    public run: (ctx: ActionContext, ...args: Actions[Name]) => boolean
  ) {}

  getArgs(pattern: ActionPattern<Name>): Actions[Name] {
    const args: any[] = pattern.trim().split(/\s+/)

    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      if (/^\d$/.test(arg)) args[i] = Number(arg)
    }

    return args as Actions[Name]
  }
}

export interface ActionContext {
  me: app.Fighter
  enemy: app.Fighter
  fight: app.Fight
}

export interface Actions {
  attack: [damages: number, element?: ElementName]
  heal: [heal: number]
  buff: [stat: keyof app.Stats, value: number]
}

export type ActionPattern<Name extends ActionName> =
  `${Name} ${Actions[Name][0]}${Actions[Name][1] extends undefined
    ? ""
    : ` ${Actions[Name][1]}${Actions[Name][2] extends undefined
        ? ""
        : ` ${Actions[Name][2]}`}`}`

//todo: setup esbuild for load this hard type:
// export type ActionPatterns = `${ActionPattern<ActionName>}${
//   | ""
//   | ` ${ActionPattern<ActionName>}${
//       | ""
//       | ` ${ActionPattern<ActionName>}`}`}`

export const actions = [
  new Action("attack", ({ fight, enemy }, damages, element) => {
    return fight.applyDamageTo(enemy, damages, element)
  }),
  new Action("heal", ({ me }, heal) => {
    const maxHp = app.generateStats(me).hp
    me.hp = Math.min(maxHp, me.hp + Number(heal))
    return true
  }),
  new Action("buff", () => false),
]
