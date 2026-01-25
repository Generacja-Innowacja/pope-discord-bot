import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { Command, Color, Emoji, Emojis, PopeEntry } from "src/utils/config"
import { error } from "src/utils/error_handler"
import fs from "fs"

export const TimeLeftUntilNextPope: Command = {
    data: new SlashCommandBuilder()
        .setName("timeleftuntilnextpope")
        .setDescription("Zapytaj papieża o godzinę"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild ||
            !interaction.channel ||
            !interaction.channel.isTextBased() ||
            interaction.channel.id != process.env.CHANNEL_ID) return await error(interaction, "channel", false)

        const now: Date = new Date()

        const next_pope: Date = new Date()
        next_pope.setHours(21, 37, 0, 0)
        if (now > next_pope) next_pope.setDate(next_pope.getDate() + 1)

        const left_until_next_pope = next_pope.valueOf() - now.valueOf()
        const total_seconds = Math.floor(left_until_next_pope / 1000)
        const hours = Math.floor(total_seconds / 3600)
        const minutes = Math.floor((total_seconds % 3600) / 60)
        const seconds = total_seconds % 60

        await interaction.reply(`${interaction.user} pozostało jeszcze **${hours}h ${minutes}m ${seconds}s** do 21:37.`)
    }
}