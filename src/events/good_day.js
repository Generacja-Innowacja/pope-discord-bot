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
                clearInterval(interval)
            }
        }, 2000)
    }
}