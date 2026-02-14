import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { Command, Color, Emoji, Emojis, PopeEntry, default_pope_entry } from "src/utils/config"
import { error } from "src/utils/error_handler"
import fs from "fs"
import path from "path"

export const Kremufki: Command = {
    data: new SlashCommandBuilder()
        .setName("kremufki")
        .setDescription("Kremufkuj!"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild ||
            !interaction.channel ||
            !interaction.channel.isTextBased() ||
            interaction.channel.id != process.env.CHANNEL_ID) return await error(interaction, "channel", false)

        const kremufka_emoji: Emoji | undefined = Emojis.find(emoji => emoji.name === "kremuuuuufkuuuj_z_tyyyyyym_")
        if (!kremufka_emoji) return await error(interaction, "emoji", true)
        const kremufka_emoji_string: string = `<:${kremufka_emoji.name}:${kremufka_emoji.id}>`

        // Load JSON and find entry
        const pope_list: PopeEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), "utf-8"))
        let pope_entry: PopeEntry | undefined = pope_list.find((entry: PopeEntry) => entry.id === interaction.user.id)

        // Default pope entry assignment
        if (!pope_entry) {
            pope_entry = { ...default_pope_entry }
            pope_entry.id = interaction.user.id
            pope_entry.username = interaction.user.username
            pope_entry.last_pope = new Date(interaction.createdAt).toISOString().split("T")[0]

            pope_list.push(pope_entry)
            fs.writeFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), JSON.stringify(pope_list, null, 4), "utf-8")
        }

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle(`Raport kremufkowy dla ${interaction.user.displayName}`)

        if (pope_entry.popes > 0) {
            embed.setFields(
                {
                    name: `${kremufka_emoji_string} Kremufki ${kremufka_emoji_string}`,
                    value: `Zjadłeś/aś ${pope_entry.popes} ${kremufka_emoji_string}`,
                    inline: true
                },
                {
                    name: `:fire: Streak :fire:`,
                    value: `Zjadłeś/aś ${pope_entry.popes_in_a_row} ${kremufka_emoji_string} pod rząd :fire:`,
                    inline: true
                }
            )
        } else {
            embed.setDescription("Nie zjadłeś jeszcze żadnej kremufki! Na co czekasz!?")
        }

        interaction.reply({ embeds: [embed] })
    }
}