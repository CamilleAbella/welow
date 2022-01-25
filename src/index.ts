import "dotenv/config"
import { Client, Intents } from "discord.js"

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.on("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!")
  }
})

client.login(process.env.TOKEN)
