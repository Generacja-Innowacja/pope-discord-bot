import "dotenv/config"

export const name = "messageCreate"
export const once = false
export function execute(message) {
    if (message.author.id == process.env.CLIENT_ID) return;

    const message_content = message.content.toLowerCase()

    if (message_content.search("dzień dobry") >= 0 || message_content.search("dzien dobry") >= 0) {
        // Co chcesz przez to powiedzieć?
        // Czy życzysz mi dobrego dnia;
        // czy oznajmiasz, że dzień jest dobry,
        // niezależnie od tego, co ja o nim myślę;
        // czy sam się dobrze tego ranka czujesz,
        // czy może uważasz, że dzisiaj należy być dobrym?

        message.reply("Co chcesz przez to powiedzieć?")

        const lines = [
            "Czy życzysz mi dobrego dnia;",
            "czy oznajmiasz, że dzień jest dobry,",
            "niezależnie od tego, co ja o nim myślę;",
            "czy sam się dobrze tego ranka czujesz,",
            "czy może uważasz, że dzisiaj należy być dobrym?"
        ]

        let line = 0
        const interval = setInterval(() => {
            message.channel.send(lines[line])
            line++

            if (line > 4) {
                clearInterval(interval)
            }
        }, 2000)
    }
}