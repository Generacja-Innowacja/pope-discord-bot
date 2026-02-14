import { Client, Message, AttachmentBuilder } from "discord.js"
import { Emoji, Emojis, PopeEntry, default_pope_entry, WrappedEntry, default_wrapped_entry } from "src/utils/config"
import { error } from "src/utils/error_handler"
import { Parser } from "expr-eval"
import fs from "fs"
import path from "path"

async function checkForPope(message_content: string): Promise<boolean> {
    // Initiate the expression parser
    const parser = new Parser()

    // In case the message isn't parsable (for example: "TestMessage123")
    try {
        // Limit the message to 100 characters to avoid overloading the server
        if (message_content.length > 100) return false;

        // Try to evaluate the expression
        const result = parser.evaluate(message_content)

        // Check if the result is an appropriate number
        if (isNaN(result) || !Number.isFinite(result)) return false

        return result === 2137
    } catch {
        return false
    }
}

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        if (!client.user) return await error(message, "user", true) // shut typescript up
        if (client.user.id === message.author.id) return // ignore own messages
        if (!message.guild ||
            !message.channel ||
            !message.channel.isTextBased() ||
            !message.channel.isSendable() ||
            message.channel.id != process.env.CHANNEL_ID) return // ignore messages sent outside of #2137

        let now: Date | string = new Date(message.createdAt)
        const hours: number = now.getHours()
        const minutes: number = now.getMinutes()
        now = now.toISOString().split("T")[0]

        let yesterday: Date | string = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday = yesterday.toISOString().split("T")[0]

        // Check if the message contains an expression that results in 2137
        if (await checkForPope(message.content)) {
            // Load JSONs
            const pope_list: PopeEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), "utf-8"))
            const wrapped_list: WrappedEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), "utf-8"))
            let pope_entry: PopeEntry | undefined = pope_list.find((entry: PopeEntry) => entry.id === message.author.id)
            let wrapped_entry: WrappedEntry | undefined = wrapped_list.find((entry: WrappedEntry) => entry.id === message.author.id)

            // Default pope entry assignment
            if (!pope_entry) {
                pope_entry = { ...default_pope_entry }
                pope_entry.id = message.author.id
                pope_entry.username = message.author.username
                pope_entry.last_pope = now

                pope_list.push(pope_entry)
            }

            // Default wrapped entry assignment
            if (!wrapped_entry) {
                wrapped_entry = { ...default_wrapped_entry }
                wrapped_entry.id = message.author.id
                wrapped_entry.username = message.author.username

                wrapped_list.push(wrapped_entry)
            }

            // In case someone has changed their username, update it
            pope_entry.username = message.author.username,
            wrapped_entry.username = message.author.username

            // Ensure the message was sent at the correct time
            if (hours === 21 && minutes === 37) {
                // Get the images that will be sent along the message
                const kremufki: string[] = []
                const imagePaths: string = path.join(process.cwd(), "src", "images", "kremufki")
                fs.readdirSync(imagePaths).filter((file: string) => file.endsWith(".png")).map((image: string) => kremufki.push(path.join(imagePaths, image)))

                if (pope_entry.last_pope !== now || pope_entry.popes === 0) {
                    pope_entry.popes++
                    pope_entry.last_pope === yesterday ? pope_entry.popes_in_a_row++ : pope_entry.popes_in_a_row = 1
                    pope_entry.last_pope = now

                    wrapped_entry.popes++
                    if (pope_entry.popes_in_a_row > wrapped_entry.most_popes_in_a_row) wrapped_entry.most_popes_in_a_row = pope_entry.popes_in_a_row

                    let reply_message = `${message.author} to twoja ${pope_entry.popes} papieżowa, `
                    if (pope_entry.popes_in_a_row > 1) reply_message += ` już ${pope_entry.popes_in_a_row} z rzędu, `

                    let attachment: AttachmentBuilder
                    const kremufka_emoji: Emoji | undefined = Emojis.find(emoji => emoji.name === "kremuuuuufkuuuj_z_tyyyyyym_")
                    if (!kremufka_emoji) return await error(message, "emoji", true)
                    const kremufka_emoji_string: string = `<:${kremufka_emoji.name}:${kremufka_emoji.id}>`

                    // If the streak is divisible by 100 (100, 300, 500, 1000), give user the golden kremufka, else just give a normal one
                    if (pope_entry.popes_in_a_row > 0 && pope_entry.popes_in_a_row % 100 === 0) {
                        reply_message += `specjalna okazja!!! W nagrodę za twój pokaźny wyczyn, zostajesz nagrodzony złotą kremówką!`
                        let golden_kremufka_path = path.join(process.cwd(), "src", "images", "golden_kremufka.png")
                        attachment = new AttachmentBuilder(golden_kremufka_path, { name: "golden_kremufka.png" })
                    } else {
                        reply_message += `trzymaj kremówkę!`
                        let kremufka_path = kremufki[Math.floor(Math.random() * kremufki.length)]
                        attachment = new AttachmentBuilder(kremufka_path, { name: "kremufka.png" })
                    }
                    reply_message += kremufka_emoji_string

                    message.reply({ content: reply_message, files: [ attachment ] })
                    message.react(kremufka_emoji_string)
                } else {
                    message.reply(`${message.author} nieco za szybko piszesz tą godzinę, może poczekaj do jutra, co?`)
                }

                // Save changes to both JSON files
                fs.writeFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), JSON.stringify(pope_list, null, 4))
                fs.writeFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), JSON.stringify(wrapped_list, null, 4))
            } else {
                if (pope_entry.last_pope !== now) {
                    let late_message: string = ""
                    let time: string = `${hours}:`
                    if (minutes < 10) time += "0"
                    time += minutes

                    // Early messages
                    if (hours < 21) {
                        late_message = `Jesteś za wcześnie, jest dopiero ${time}, wróć o 21:37!`
                    }
                    if (hours === 21 && minutes < 37) {
                        late_message = `Jesteś nieco za wcześnie, jest dopiero ${time}, wróć o 21:37!`
                    }

                    // Late messages
                    if (hours === 21 && minutes > 37) {
                        late_message = "Ajj tak blisko, "
                        if (message.author.id === "710795299521822761") { // patryk
                            late_message += "Patryku przestaw ten zegar wreszcie i "
                        }
                        if (message.author.id === "534698860732350464") { // shafti
                            late_message += "zacznij wreszcie przychodzić na czas i "
                        }
                        late_message += "wróć jutro o 21:37"
                    }
                    if (hours > 21) {
                        late_message = `Spóźniłeś/aś się po kremówki, jest już ${time}, gdzieś ty był/a?!`
                    }

                    message.reply(late_message)

                    // Special reply for when someone is a few seconds late
                    if (hours === 21 && minutes === 38) {
                        wrapped_entry.one_min_late++
                        fs.writeFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), JSON.stringify(wrapped_list, null, 4))
                        message.channel.send("https://tenor.com/view/2137-2138-pope-jan-pawe%C5%82-ii-gif-4135764501454359633")
                    }
                } else {
                    message.reply("Już dzisiaj otrzymałeś/aś swoją kremówkę, zostaw trochę dla innych!")
                }
            }
        // Messages at other times
        } else if (message.content.includes("1237") && hours === 12 && minutes === 37) {
            let late_message = "Chyba pomyliłeś/aś godziny... Jeśli coś brałeś/aś, podziel się"
            late_message = late_message.split('').reverse().join('')
            message.reply(late_message)
        }
    })
}