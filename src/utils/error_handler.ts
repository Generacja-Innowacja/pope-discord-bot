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

export async function error(interaction: ChatInputCommandInteraction, type: string = "error", report: boolean = false): Promise<void> {
    const errorEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(Color.accent)
        .setTitle("Error code 418: I'm a teapot")

    let description: string = ""

    switch (type.toLowerCase()) {
        case "slashcommand":
            description = "Command not found."
            break
        case "channel":
            const guild = await interaction.client.guilds.fetch(process.env.GUILD_ID!)
            if (!guild || interaction.guild !== guild) {
                description = `This command can only be ran in the ${guild.name} server.`
                break
            }

            const channel = await guild.channels.fetch(process.env.CHANNEL_ID!)
            if (channel) {
                description = `This command can only be ran in the ${channel.url} channel.`
            } else {
                description = "This command can't be ran in this channel."
            }
            break
        case "emoji":
            description = "Unable to access the application's emoji."
            break

        default:
            description = "Unexpected error has occured."
    }

    errorEmbed.setDescription(description)

    interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
    if (report) sendReport(interaction, errorEmbed)
}