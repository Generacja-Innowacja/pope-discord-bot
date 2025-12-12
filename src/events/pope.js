import { AttachmentBuilder, MessageFlags } from "discord.js"
import fs from "fs"
import path from "path"
import "dotenv/config"

export const name = "messageCreate"
export const once = false
export function execute(message) {
    if (message.author.id == process.env.CLIENT_ID) return;

    let now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    now = now.toISOString().split("T")[0]

    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday = yesterday.toISOString().split("T")[0]

    const pope_list = JSON.parse(fs.readFileSync("src/logs/pope.json"))

    if (message.content.slice(0, 4) === "2137"
        || message.content.slice(0, 14) === "0b100001011001"
        || message.content.slice(0, 6) === "0o4131"
        || message.content.slice(0, 5) === "0x859"
        || message.content.slice(0, 21).toLowerCase() === "dwa jeden trzy siedem") {
        let entry = pope_list.find(e => e.id === message.author.id)

        if (!entry) {
            entry = {
                id: message.author.id,
                popes: 0,
                popes_in_a_row: 0,
                last_pope: now
            }

            pope_list.push(entry)
        }

        if (hours === 21 && minutes === 37) {
            if (message.channel.id != process.env.CHANNEL_ID) {
                return message.reply({
                    content: "Możesz pisać 2137 tylko na kanale 2137!",
                    flags: MessageFlags.Ephemeral
                })
            }

            const kremufki = []
            const imagesPath = path.join(process.cwd(), "src", "images", "kremufki")
            const imagesFiles = fs.readdirSync(imagesPath).filter(f => f.endsWith(".png"))
            for (const image of imagesFiles) {
                kremufki.push(path.join(imagesPath, image))
            }

            if (entry.last_pope !== now || entry.popes === 0) {
                entry.popes++
                entry.last_pope === yesterday ? entry.popes_in_a_row++ : entry.popes_in_a_row = 1
                entry.last_pope = now

                let reply_message = `${message.author} to twoja ${entry.popes} papieżowa, `
                if (entry.popes_in_a_row > 1) reply_message += `już ${entry.popes_in_a_row} z rzędu, `

                let attachment
                if (entry.popes_in_a_row % 100 !== 0) {
                    reply_message += `trzymaj kremówkę! <:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743>`
                    attachment = new AttachmentBuilder(kremufki[Math.floor(Math.random() * kremufki.length)], { name: "kremufka.png" })
                } else {
                    reply_message += `specjalna okazja!!! W nagrodę za twój pokaźny wyczyn, zostajesz nagrodzony złotą kremówką! <:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743>`
                    let golden_kremufka_path = path.join(process.cwd(), "src", "images", "golden_kremufka.png")
                    attachment = new AttachmentBuilder(golden_kremufka_path, { name: "golden_kremufka.png" })
                }

                message.reply({
                    content: reply_message,
                    files: [attachment]
                })

                message.react("<:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743>")
            } else {
                message.reply({
                    content: `${message.author} nieco za szybko piszesz tą godzine, może poczekaj do jutra co?`,
                    flags: MessageFlags.Ephemeral
                })
            }

            fs.writeFileSync("src/logs/pope.json", JSON.stringify(pope_list, null, 4))
        } else {
            if (entry.last_pope !== now) {
                let late_message = ""

                // Early messages
                if (hours < 21) {
                    late_message = `Jesteś za wcześnie, jest dopiero ${hours}:${minutes}, wróć o 21:37!`
                }
                if (hours === 21 && minutes < 37) {
                    late_message = `Jesteś nieco za wcześnie, jest dopiero ${hours}:${minutes}, wróć o 21:37!`
                }

                // Late messages
                if (hours === 21 && minutes > 37) {
                    late_message = "Ajj tak blisko, "
                    if (message.author.id == "710795299521822761") {
                        late_message += "Patryku przestaw ten zegar wreszcie i "
                    }
                    late_message += "wróć jutro o 21:37"
                }
                if (hours > 21) {
                    late_message = `Spóźniłeś/aś się po kremówki, jest już ${hours}:${minutes}, gdzieś ty był/a?!`
                }

                message.reply(late_message)

                if (hours === 21 && minutes === 38) {
                    message.channel.send("https://tenor.com/view/2137-2138-pope-jan-pawe%C5%82-ii-gif-4135764501454359633")
                }
            } else {
                message.reply("Już dzisiaj otrzymałeś/aś swoją kremówkę, zostaw trochę dla innych!")
            }
        }
    } else if (message.content.slice(0, 4) === "1237" && hours === 12 && minutes === 37) {
        let late_message = "Chyba pomyliłeś/aś godziny... Jeśli coś brałeś/aś, podziel się"
        late_message = late_message.split('').reverse().join('')
        message.reply(late_message)
    }
}
