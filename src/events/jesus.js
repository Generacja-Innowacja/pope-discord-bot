import "dotenv/config"

export const name = "messageCreate"
export const once = false
export function execute(message) {
    if (message.author.id == process.env.CLIENT_ID) return;

    const message_content = message.content.toLowerCase()

    if (message_content.search("jak pan jezus powiedzial") >= 0 || message_content.search("jak pan jezus powiedział") >= 0) {
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
}
