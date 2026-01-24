import { Client, GatewayIntentBits } from "discord.js"
import { Command } from "./utils/config"
import "dotenv/config"

// Import commands
import { Ping } from "./commands/ping"
import { Barka } from "./commands/barka"
import { Kremufki } from "./commands/kremufki"

export const Commands: Command[] = [
    Ping,
    Barka,
    Kremufki
]

// Import events
import clientReady from "./events/clientReady"
import interactionCreate from "./events/interactionCreate"

export const client: Client<boolean> = new Client({
    intents: Object.values(GatewayIntentBits).filter((intent): intent is number => typeof intent === "number")
})

clientReady(client)
interactionCreate(client)

// Login with the bot
client.login(process.env.TOKEN)