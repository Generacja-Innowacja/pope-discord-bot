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
import jesus from "./events/jesus"
import good_day from "./events/good_day"

// Import jobs
import "./utils/streak-reset"
import "./utils/wrapped-reset"

export const client: Client<boolean> = new Client({
    //intents: Object.values(GatewayIntentBits).filter((intent): intent is number => typeof intent === "number")
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ]
})

// Run events
clientReady(client)
interactionCreate(client)
pope(client)
jesus(client)
good_day(client)

// Login with the bot
client.login(process.env.TOKEN)