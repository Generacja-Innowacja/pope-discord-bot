import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { Pagination } from "pagination.djs"
import { Command, Color, Emoji, Emojis, PopeEntry } from "src/utils/config"
import { error } from "src/utils/error_handler"
import fs from "fs"

export const Leaderboard: Command = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Zobacz kto lubi kremufki najbardziej!"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild ||
            !interaction.channel ||
            !interaction.channel.isTextBased() ||
            interaction.channel.id != process.env.CHANNEL_ID) return await error(interaction, "channel", false)

        interaction.deferReply()

        const kremufka_emoji: Emoji | undefined = Emojis.find(emoji => emoji.name === "cards")
        if (!kremufka_emoji) return await error(interaction, "emoji", true)
        const kremufka_emoji_string: string = `<:${kremufka_emoji.name}:${kremufka_emoji.id}>`

        const pope_list: PopeEntry[] = JSON.parse(fs.readFileSync("src/logs/pope.json", "utf-8"))
        pope_list.sort((a, b) => b.popes - a.popes)

        const leaderboard = new Pagination(interaction, { limit: 1 })
            .setColor(Color.primary)
            .setTitle("Tablica kremówkowych wyników")

        const pages: number = Math.floor(pope_list.length / 10) // The total number of pages
        const last_page: number = pope_list.length - pages * 10 // How many entries will be on the last page
        let name: string = ""

        // member = person is in the server
        // user = person has left the server
        for (let p: number = 0; p < pages; p++) {
            let entry: string = ""

            // every full page has 10 members
            for (let i: number = 0; i < 10; i++) {
                try {
                    const member = await interaction.guild.members.fetch(pope_list[i + p * 10].id)
                    name = member.displayName.replaceAll("*", "\\*").replaceAll("_", "\\_")
                } catch(error) {
                    const user = await interaction.client.users.fetch(pope_list[i + p * 10].id)
                    name = user.username.replaceAll("*", "\\*").replaceAll("_", "\\_")
                }

                entry += `**${(i + 1) + p * 10}.** *${name}* - ${pope_list[i + p * 10].popes} ${kremufka_emoji_string} | ${pope_list[i + p * 10].popes_in_a_row} :fire:\n`
            }

            leaderboard.addDescriptions([entry])
        }

        let entry = ""

        for(let i: number = 0; i < last_page; i++) {
            try {
                const member = await interaction.guild.members.fetch(pope_list[i + pages * 10].id)
                name = member.displayName.replaceAll("*", "\\*").replaceAll("_", "\\_")
            } catch(error) {
                const user = await interaction.client.users.fetch(pope_list[i + pages * 10].id)
                name = user.username.replaceAll("*", "\\*").replaceAll("_", "\\_")
            }

            entry += `**${(i + 1) + pages * 10}.** *${name}* - ${pope_list[i + pages * 10].popes} ${kremufka_emoji_string} | ${pope_list[i + pages * 10].popes_in_a_row} :fire:\n`
        }

        leaderboard.addDescriptions([entry])

        leaderboard.render()
    }
}