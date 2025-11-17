import { SlashCommandBuilder, MessageFlags } from "discord.js"
import { Pagination } from "pagination.djs"
import fs from "fs"

export const data = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Zobacz kto lubi kremówki najbardziej!")

export async function execute(interaction) {
    if (interaction.channel.id != process.env.CHANNEL_ID) {
        return interaction.reply({
            content: "Musisz użyć tego w kanale #2137!",
            flags: MessageFlags.Ephemeral
        })
    }

    await interaction.deferReply()

    const pope_list = JSON.parse(fs.readFileSync("src/logs/pope.json"))
    pope_list.sort((a, b) => b.popes - a.popes)

    const leaderboard = new Pagination(interaction, { limit: 1 })
        .setTitle("Tablica kremówkowych wyników")
        .setColor("#69bccd")

    const pages = Math.floor(pope_list.length / 10)
    const last_page = pope_list.length - pages * 10

    for(let p = 0; p < pages; p++) {
        let popes = ""

        for(let i = 0; i < 10; i++) {
            try {
                const member = await interaction.guild.members.fetch(pope_list[i + p * 10].id)
                popes += `**${(i + 1) + p * 10}.** ${member} - ${pope_list[i + p * 10].popes} <:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743> | ${pope_list[i + p * 10].popes_in_a_row} :fire:\n`
            } catch(error) {
                const user = await interaction.client.users.fetch(pope_list[i + p * 10].id)
                popes += `**${(i + 1) + p * 10}.** ${user} - ${pope_list[i + p * 10].popes} <:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743> | ${pope_list[i + p * 10].popes_in_a_row} :fire:\n`
            }
        }

        leaderboard.addDescriptions([popes])
    }

    let popes = ""

    for(let i = 0; i < last_page; i++) {
        try {
            const member = await interaction.guild.members.fetch(pope_list[i + pages * 10].id)
            popes += `**${(i + 1) + pages * 10}.** ${member} - ${pope_list[i + pages * 10].popes} <:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743> | ${pope_list[i + pages * 10].popes_in_a_row} :fire:\n`
        } catch(error) {
            const user = await interaction.client.users.fetch(pope_list[i + pages * 10].id)
            popes += `**${(i + 1) + pages * 10}.** ${user} - ${pope_list[i + pages * 10].popes} <:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743> | ${pope_list[i + pages * 10].popes_in_a_row} :fire:\n`
        }
    }

    leaderboard.addDescriptions([popes])

    leaderboard.render()
}
