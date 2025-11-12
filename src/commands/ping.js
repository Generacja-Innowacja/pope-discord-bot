import { SlashCommandBuilder, MessageFlags } from "discord.js"

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")

export async function execute(interaction) {
    if (interaction.channel.id != process.env.CHANNEL_ID) {
        return interaction.reply({
            content: "Musisz użyć tego w kanale #2137!",
            flags: MessageFlags.Ephemeral
        })
    }

    await interaction.reply({
        //content: `Pong! *${Date.now() - interaction.createdTimestamp}ms*`,
        content: "Pong!",
        flags: MessageFlags.Ephemeral
    })
}