import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { Command, Color, Emoji, Emojis, PopeEntry } from "src/utils/config"
import { error } from "src/utils/error_handler"
import fs from "fs"

export const Kremufki: Command = {
    data: new SlashCommandBuilder()
        .setName("kremufki")
        .setDescription("Kremufkuj!"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const kremufka_emoji: Emoji | undefined = Emojis.find(emoji => emoji.name === "cards")
        if (!kremufka_emoji) return error(interaction, "emoji", true)
        const kremufka_emoji_string: string = `<:${kremufka_emoji.name}:${kremufka_emoji.id}>`

        const pope_list: PopeEntry[] = JSON.parse(fs.readFileSync("src/logs/pope.json", "utf-8"))
        let entry: PopeEntry | undefined = pope_list.find((entry: PopeEntry) => entry.id === interaction.user.id)

        if (!entry) {
            entry = {
                id: interaction.user.id,
                username: interaction.user.username,
                popes: 0,
                popes_in_a_row: 0,
                last_pope: ""
            }

            pope_list.push(entry)
            fs.writeFileSync("src/logs/popes.json", JSON.stringify(pope_list, null, 4), "utf-8")
        }

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle(`Raport kremufkowy dla ${interaction.user.displayName}`)

        if (entry.popes > 0) {
            embed.setFields(
                {
                    name: `${kremufka_emoji_string} Kremufki ${kremufka_emoji_string}`,
                    value: `Zjadłeś/aś ${entry.popes} ${kremufka_emoji_string}`,
                    inline: true
                },
                {
                    name: `:fire: Streak :fire:`,
                    value: `Zjadłeś/aś ${entry.popes_in_a_row} ${kremufka_emoji_string} pod rząd :fire:`,
                    inline: true
                }
            )
        } else {
            embed.setDescription("Nie zjadłeś jeszcze żadnej kremufki! Na co czekasz!?")
        }

        interaction.reply({ embeds: [embed] })
    }
}