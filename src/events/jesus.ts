import { Client, Message } from "discord.js"
import { WrappedEntry, default_wrapped_entry } from "src/utils/config"
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
            !message.channel.isSendable()) return // check for channel type

        const message_content = message.content.toLowerCase()

        if (message_content.includes("jak pan jezus powiedzial") || message_content.includes("jak pan jezus powiedział")) {
            // Load JSON
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

            // Array of possible responses
            const responses: string[] = [
                "Tak jak Pan Jezus powiedział!",
                "\"Czyńcie innym tak, jak chcielibyście, aby wam czyniono\". (Łukasza 6:31)",
                "\"Ja jestem droga i prawda, i żywot, nikt nie przychodzi do Ojca, tylko przeze mnie.\" (Jana 14:6)",
                "\"A Ja wam powiadam: Miłujcie waszych nieprzyjaciół i módlcie się za tych, którzy was prześladują\". (Mateusza 5:44)",
                "\"Ja i Ojciec jedno jesteśmy\". (Jana 10:30)",
                "\"Nie troszczcie się więc o dzień jutrzejszy, gdyż dzień jutrzejszy będzie miał własne troski\". (Mateusza 6:34)",
                "\"Jeśli cię kto uderzy w prawy policzek, nadstaw mu i drugi\". (Mateusza 5:39)",
                "\"A wielu pierwszych będzie ostatnimi, a ostatnich pierwszymi\". (Mateusza 19:30)",
                "\"Oddawajcie więc cesarzowi, co jest cesarskie, a Bogu, co jest Boże\". (Łukasza 20:25).",
                "\"Kto z was jest bez grzechu, niech pierwszy rzuci w nią kamieniem\". (Jana 8:7)."
            ]

            wrapped_entry.bible++
            fs.writeFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), JSON.stringify(wrapped_list, null, 4))

            const response = responses[Math.floor(Math.random() * responses.length)]
            message.reply(response)
        }

        if (message_content.includes("szczęść boże") || message_content.includes("szczesc boze")) {
            const responses: string[] = [
                "Szczęść Boże!",
                "Na wieki wieków!",
                "Bóg zapłać"
            ]

            const response = responses[Math.floor(Math.random() * responses.length)]
            message.reply(response)
        }

        if (message_content.includes("niech będzie pochwalony jezus chrystus") || message_content.includes("niech bedzie pochwalony jezus chrystus")) message.reply("Na wieki wieków, amen!")
    })
}