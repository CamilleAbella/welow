import * as app from "./app"

export async function generateBots(botCount: number, stepCount: number) {
  await app.knex("player").delete().where({ bot: false })

  const shopItems = await app.knex("shop")

  // create x bots

  const bots: app.Player[] = []

  for (let i = 0; i < botCount; i++) {
    bots.push(app.getPlayer())
  }

  // for each step {
  //   for each bot {
  //     ranked fight
  //     if bot can buy card in shop: do it
  //     if stuff is limited : keep the best stuff
  //   }
  // }

  for (let step = 0; step < stepCount; step++) {
    for (const bot of bots) {
      const enemy = await app.matchmaking(bot)

      if (!enemy) throw new Error("Failed to found a game!")

      const result = await app.makeFight(bot, enemy)

      if (result.winner === bot) {
      }
    }
  }

  await app.knex<app.Player>("player").insert(bots)
}
