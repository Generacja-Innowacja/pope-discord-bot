import fs from "fs"
import "dotenv/config"

export const name = "messageCreate"
export const once = false
export function execute(message) {
    if (message.author.id == process.env.CLIENT_ID) return;

    const message_content = message.content.toLowerCase()

    if (message_content.search("jak pan jezus powiedzial") >= 0 || message_content.search("jak pan jezus powiedział") >= 0) {
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

        const responses = [
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
        fs.writeFileSync("src/logs/wrapped.json", JSON.stringify(wrapped, null, 4))

        const response = responses[Math.floor(Math.random() * responses.length)]
        message.reply(response)
    }

    if (message_content.search("szczęść boże") >= 0) {
        const responses = [
            "Szczęść Boże!",
            "Na wieki wieków!",
            "Bóg zapłać"
        ]

        const response = responses[Math.floor(Math.random() * responses.length)]
        message.reply(response)
    }

    if (message_content.search("niech będzie pochwalony jezus chrystus") >= 0 || message_content.search("niech bedzie pochwalony jezus chrystus") >= 0) {
        message.reply("Na wieki wieków, amen!")
    }
}
