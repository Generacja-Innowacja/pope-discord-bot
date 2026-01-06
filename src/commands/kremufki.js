import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from "discord.js"
import fs from "fs"

export const data = new SlashCommandBuilder()
    .setName("kremufki")
    .setDescription("Kremufkuj!")

export async function execute(interaction) {
    const kremufka = "<:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743>"
    const pope_list = JSON.parse(fs.readFileSync("src/logs/pope.json"))
    let target

    pope_list.forEach(believer => {
        if (believer.id != interaction.member.id) {
            return
        }

        target = believer
        return
    })

    const Embed = new EmbedBuilder()
        .setTitle(`Raport kremufkowy dla ${interaction.member.displayName}`)
        .setColor("#69bccd")

        .setFields(
            {
                name: `${kremufka} Kremufki ${kremufka}`,
                value: `Zjadłeś/aś ${target.popes} ${kremufka}`,
                inline: true
            },
            {
                name: `:fire: Streak :fire:`,
                value: `Zjadłeś/aś ${target.popes_in_a_row} ${kremufka} pod rząd :fire:`,
                inline: true
            }
        )

    interaction.reply({ embeds: [Embed] })
}
