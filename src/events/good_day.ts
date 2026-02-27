import { Client, Message } from "discord.js"
import { WrappedEntry, default_wrapped_entry, log } from "src/utils/config"
import { error } from "src/utils/error_handler"
import fs from "fs"
import path from "path"

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        if (!client.user) return await error(message, "user", true) // shut typescript up
        if (client.user.id === message.author.id) return // ignore own messages
        if (!message.guild ||
            !message.channel ||
            !message.channel.isTextBased() ||
            !message.channel.isSendable() ||
	           message.channel.id !== process.env.CHANNEL_ID! ||
	           message.channel.id !== process.env.OFFTOP_ID!) return // check for channel

        const flags = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "flags.json"), "utf-8"))
        const message_content = message.content.toLowerCase()

        if (!flags.good_day_is_typing && (message_content.includes("dzień dobry") || message_content.includes("dzien dobry"))) {
            const wrapped_list: WrappedEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), "utf-8"))
            let wrapped_entry: WrappedEntry | undefined = wrapped_list.find((entry: WrappedEntry) => entry.id === message.author.id)

            // Default wrapped entry assignment
            if (!wrapped_entry) {
                wrapped_entry = { ...default_wrapped_entry }
                wrapped_entry.id = message.author.id
                wrapped_entry.username = message.author.username

                wrapped_list.push(wrapped_entry)
            }

            // In case someone has changed their username, update it
            wrapped_entry.username = message.author.username

            flags.good_day_is_typing = true
            fs.writeFileSync(path.join(process.cwd(), "src", "logs", "flags.json"), JSON.stringify(flags, null, 4))

            // Lines to be edited into the response
            const lines: string[] = [
                "Co chcesz przez to powiedzieć?",
                "Czy życzysz mi dobrego dnia;",
                "czy oznajmiasz, że dzień jest dobry,",
                "niezależnie od tego, co ja o nim myślę;",
                "czy sam się dobrze tego ranka czujesz,",
                "czy może uważasz, że dzisiaj należy być dobrym?"
            ]

            try {
                let line = 0
                let response = lines[line]
                let reply_message = await message.reply(response)
        
                const interval: NodeJS.Timeout = setInterval(() => {
                    line++
                    response += `\n${lines[line]}`
                    reply_message.edit(response)
        
                    if (line > 4) {
                        flags.good_day_is_typing = false
                        fs.writeFileSync(path.join(process.cwd(), "src", "logs", "flags.json"), JSON.stringify(flags, null, 4))
        
                        wrapped_entry.gandalf++
                        fs.writeFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), JSON.stringify(wrapped_list, null, 4))
        
                        clearInterval(interval)
                    }
                }, 2000)
            } catch(error: any) {
                log("ERROR", "No send messages permission")
            }
        }
    })
}
