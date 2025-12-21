import fs from "fs"
import "dotenv/config"

export const name = "messageCreate"
export const once = false
export async function execute(message) {
    if (message.author.id == process.env.CLIENT_ID) return;

    const flags = JSON.parse(fs.readFileSync("src/logs/flags.json"))
    const message_content = message.content.toLowerCase()

    if (!flags.good_day_is_typing && (message_content.search("dzień dobry") >= 0 || message_content.search("dzien dobry") >= 0)) {
        // Co chcesz przez to powiedzieć?
        // Czy życzysz mi dobrego dnia;
        // czy oznajmiasz, że dzień jest dobry,
        // niezależnie od tego, co ja o nim myślę;
        // czy sam się dobrze tego ranka czujesz,
        // czy może uważasz, że dzisiaj należy być dobrym?

        const wrapped = JSON.parse(fs.readFileSync("src/logs/wrapped.json"))
        let wrapped_entry = wrapped.find(e => e.id === message.author.id)

        if (!wrapped_entry) {
            entry = {
                id: message.author.id,
                username: message.author.username,
                popes: 0,
                most_popes_in_a_row: 0,
                gandalf: 0,
                bible: 0,
                barka: 0,
                one_min_late: 0
            }

            wrapped.push(wrapped_entry)
        }

        // In case someone changed their username
        wrapped_entry.username = message.author.username

        flags.good_day_is_typing = true
        fs.writeFileSync("src/logs/flags.json", JSON.stringify(flags, null, 4))

        const lines = [
            "Co chcesz przez to powiedzieć?",
            "Czy życzysz mi dobrego dnia;",
            "czy oznajmiasz, że dzień jest dobry,",
            "niezależnie od tego, co ja o nim myślę;",
            "czy sam się dobrze tego ranka czujesz,",
            "czy może uważasz, że dzisiaj należy być dobrym?"
        ]

        let line = 0
        let response = lines[line]
        let reply_message = await message.reply(response)

        const interval = setInterval(() => {
            line++
            response += `\n${lines[line]}`
            reply_message.edit(response)

            if (line > 4) {
                flags.good_day_is_typing = false
                fs.writeFileSync("src/logs/flags.json", JSON.stringify(flags, null, 4))

                wrapped_entry.gandalf++
                fs.writeFileSync("src/logs/wrapped.json", JSON.stringify(wrapped, null, 4))

                clearInterval(interval)
            }
        }, 2000)
    }
}