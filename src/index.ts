import { Client, GatewayIntentBits } from "discord.js"
import { Command } from "./utils/config"
import "dotenv/config"

// Import commands
import { Ping } from "./commands/ping"
import { Barka } from "./commands/barka"
import { Kremufki } from "./commands/kremufki"
import { Leaderboard } from "./commands/leaderboard"
import { TimeLeftUntilNextPope } from "./commands/timeleftuntilnextpope"

export const Commands: Command[] = [
    Ping,
    Barka,
    Kremufki,
    Leaderboard,
    TimeLeftUntilNextPope
]

// Import events
import clientReady from "./events/clientReady"
import interactionCreate from "./events/interactionCreate"
import pope from "./events/pope"

export const client: Client<boolean> = new Client({
    intents: Object.values(GatewayIntentBits).filter((intent): intent is number => typeof intent === "number")
})

clientReady(client)
interactionCreate(client)
pope(client)

// Login with the bot
client.login(process.env.TOKEN)