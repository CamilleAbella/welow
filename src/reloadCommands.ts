import "dotenv/config"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"

if (!process.env.TOKEN || !process.env.CLIENT_ID)
  throw new Error("Missing data in dotenv")

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
]

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN)

try {
  console.log("Started refreshing application (/) commands.")

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      "507389389098188820"
    ),
    { body: commands }
  )

  console.log("Successfully reloaded application (/) commands.")
} catch (error) {
  console.error(error)
}
