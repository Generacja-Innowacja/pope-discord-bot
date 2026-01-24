import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { Color } from "./config"
import "dotenv/config"

async function sendReport(interaction: ChatInputCommandInteraction, embed: EmbedBuilder): Promise<void> {
    embed
        .setTimestamp(Date.now())
        .setAuthor({
            name: `${interaction.user.username} (${interaction.user.id})`,
            iconURL: interaction.user.avatarURL() ?? undefined
        })

    const owner = await interaction.client.users.fetch(process.env.OWNER_ID!)
    owner.send({ embeds: [embed] })
}

export function error(interaction: ChatInputCommandInteraction, type: string = "error", report: boolean = false): void {
    const errorEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(Color.accent)
        .setTitle("Error code 418: I'm a teapot")

    switch (type.toLowerCase()) {
        case "slashcommand":
            errorEmbed.setDescription("Command not found.")
        case "channel":
            errorEmbed.setDescription(`This command can only be ran in the ${interaction.client.channels.fetch(process.env.CHANNEL_ID!)} channel.`)
        case "emoji":
            errorEmbed.setDescription("Unable to access the application's emoji.")
            break

        default:
            errorEmbed.setDescription("Unexpected error has occured.")
    }

    interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
    if (report) sendReport(interaction, errorEmbed)
}