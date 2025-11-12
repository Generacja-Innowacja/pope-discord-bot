import { SlashCommandBuilder, MessageFlags } from "discord.js"

export const data = new SlashCommandBuilder()
    .setName("timeleftuntilnextpope")
    .setDescription("Returns the time left until the pope hour. Pretty self explanatory.")

export async function execute(interaction) {
    if (interaction.channel.id != process.env.CHANNEL_ID) {
        return interaction.reply({
            content: "Musisz użyć tego w kanale #2137!",
            flags: MessageFlags.Ephemeral
        })
    }

    const now = new Date()

    const next_pope = new Date()
    next_pope.setHours(21, 37, 0, 0)
    if (now > next_pope) next_pope.setDate(next_pope.getDate() + 1)

    const left_until_next_pope = next_pope - now
    const totalSeconds = Math.floor(left_until_next_pope / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    await interaction.reply(`${interaction.user} pozostało jeszcze **${hours}h ${minutes}m ${seconds}s** do 21:37.`)
}