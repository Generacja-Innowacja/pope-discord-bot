import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import { Command } from "../utils/config"

export const Ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: `Pong! *${interaction.client.ws.ping}ms*`,
            flags: MessageFlags.Ephemeral
        })
    }
}