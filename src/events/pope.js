import { AttachmentBuilder, MessageFlags } from "discord.js"
import fs from "fs"
import path from "path"
import "dotenv/config"

export const name = "messageCreate"
export const once = false
export function execute(message) {
    if (message.author.id == process.env.CLIENT_ID) return;

    const kremufki = []
    const imagesPath = path.join(process.cwd(), "src", "images", "kremufki")
    const imagesFiles = fs.readdirSync(imagesPath).filter(f => f.endsWith(".png"))
    for (const image of imagesFiles) {
        kremufki.push(path.join(imagesPath, image))
    }

    let now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    now = now.toISOString().split("T")[0]

    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday = yesterday.toISOString().split("T")[0]

    const pope_list = JSON.parse(fs.readFileSync("src/logs/pope.json"))

    if (message.content === "2137" && hours === 21 && minutes === 37) {
        if (message.channel.id != process.env.CHANNEL_ID) {
            return message.reply({
                content: "Możesz pisać 2137 tylko na kanale 2137!",
                flags: MessageFlags.Ephemeral
            })
        }

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

        if (entry.last_pope !== now || entry.popes === 0) {
            entry.popes++
            entry.last_pope === yesterday ? entry.popes_in_a_row++ : entry.popes_in_a_row = 0
            entry.last_pope = now

            let reply_message = `${message.author} to twoja ${entry.popes} papieżowa, `
            if (entry.popes_in_a_row > 1) reply_message += `już ${entry.popes_in_a_row} z rzędu, `
            reply_message += `trzymaj kremówkę! <:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743>`

            const attachment = new AttachmentBuilder(kremufki[Math.floor(Math.random() * kremufki.length)], { name: "kremufka.png" })

            message.reply({
                content: reply_message,
                files: [attachment]
            })

            message.react("<:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743>")
        } else {
            message.reply(`${message.author} nieco za szybko piszesz tą godzine, może poczekaj do jutra co?`)
        }

        fs.writeFileSync("src/logs/pope.json", JSON.stringify(pope_list, null, 4))
    }
}