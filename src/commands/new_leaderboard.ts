import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { Pagination } from "pagination.djs"
import { Command, Color, Emoji, Emojis, PopeEntry } from "src/utils/config"
import { error } from "src/utils/error_handler"
import fs from "fs"
import path from "path"

export const new_leaderboard: Command = {
    data: new SlashCommandBuilder()
        .setName("new_leaderboard")
        .setDescription("Zobacz kto lubi kremufki najbardziej!")

        .addStringOption(option => option
            .setName("range")
            .setDescription("Z jakiego okresu czasu mają być pobrane kremówki")

            .addChoices(
                { name: "14 days", value: "14d" },
                { name: "1 month", value: "1m" },
                { name: "3 months", value: "3m" },
                { name: "1 year", value: "1y" }
            )

            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild ||
            !interaction.channel ||
            !interaction.channel.isTextBased() ||
            interaction.channel.id != process.env.CHANNEL_ID) return await error(interaction, "channel", false)

        const range: string = interaction.options.getString("range") ?? "14d"

        const kremufka_emoji: Emoji | undefined = Emojis.find(emoji => emoji.name === "kremuuuuufkuuuj_z_tyyyyyym_")
        if (!kremufka_emoji) return await error(interaction, "emoji", true)
        const kremufka_emoji_string: string = `<:${kremufka_emoji.name}:${kremufka_emoji.id}>`

        await interaction.deferReply() // Defer the reply now to let any errors get sent before limiting the interaction to this reply

        // Load JSON
        const pope_list: PopeEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), "utf-8"))

        const leaderboard = new Pagination(interaction, { limit: 1 })
            .setColor(Color.primary)

        switch (range) {
            case "14d":
                leaderboard.setTitle("Tablica wyników z 14 dni")
                pope_list
                    .sort((a, b) => b.popes_14d - a.popes_14d)
                    .filter((entry: PopeEntry) => entry.popes_14d !== 0)
                break
            case "1m":
                leaderboard.setTitle("Tablica wyników tego miesiąca")
                pope_list
                    .sort((a, b) => b.popes_1m - a.popes_1m)
                    .filter((entry: PopeEntry) => entry.popes_1m !== 0)
                break
            case "3m":
                leaderboard.setTitle("Tablica wyników z 3 miesięcy")
                pope_list
                    .sort((a, b) => b.popes_3m - a.popes_3m)
                    .filter((entry: PopeEntry) => entry.popes_3m !== 0)
                break
            case "1y":
                leaderboard.setTitle("Tablica wyników z tego roku")
                pope_list
                    .sort((a, b) => b.popes_year - a.popes_year)
                    .filter((entry: PopeEntry) => entry.popes_year !== 0)
                break
            default:
                leaderboard.setTitle("Tablica wyników")
                pope_list
                    .sort((a, b) => b.popes - a.popes)
                    .filter((entry: PopeEntry) => entry.popes !== 0)
        }

        const pages: number = Math.floor(pope_list.length / 10) // The total number of pages
        const last_page: number = pope_list.length - pages * 10 // How many entries will be on the last page
        let name: string = ""

        // member = person is in the server
        // user = person has left the server
        for (let p: number = 0; p < pages; p++) {
            let record: string = ""

            // every full page has 10 members
            for (let i: number = 0; i < 10; i++) {
                let score: number = 0
                const entry: PopeEntry = pope_list[i + p * 10]

                try {
                    const member = await interaction.guild.members.fetch(entry.id)
                    name = member.displayName.replaceAll("*", "\\*").replaceAll("_", "\\_")
                } catch(error) {
                    const user = await interaction.client.users.fetch(entry.id)
                    name = user.username.replaceAll("*", "\\*").replaceAll("_", "\\_")
                }

                switch (range) {
                    case "14d":
                        score = entry.popes_14d
                        break
                    case "1m":
                        score = entry.popes_1m
                        break
                    case "3m":
                        score = entry.popes_3m
                        break
                    case "year":
                        score = entry.popes_year
                        break
                }

                record += `**${(i + 1) + p * 10}.** *${name}* - ${score} ${kremufka_emoji_string} | ${entry.popes_in_a_row} :fire:\n`
            }

            leaderboard.addDescriptions([record])
        }

        let record = ""

        for(let i: number = 0; i < last_page; i++) {
            let score: number = 0
            const entry: PopeEntry = pope_list[i + pages * 10]

            try {
                const member = await interaction.guild.members.fetch(entry.id)
                name = member.displayName.replaceAll("*", "\\*").replaceAll("_", "\\_")
            } catch(error) {
                const user = await interaction.client.users.fetch(entry.id)
                name = user.username.replaceAll("*", "\\*").replaceAll("_", "\\_")
            }

            switch (range) {
                case "14d":
                    score = entry.popes_14d
                    break
                case "1m":
                    score = entry.popes_1m
                    break
                case "3m":
                    score = entry.popes_3m
                    break
                case "year":
                    score = entry.popes_year
                    break
            }

            record += `**${(i + 1) + pages * 10}.** *${name}* - ${score} ${kremufka_emoji_string} | ${entry.popes_in_a_row} :fire:\n`
        }

        leaderboard.addDescriptions([record])

        leaderboard.render()
    }
}