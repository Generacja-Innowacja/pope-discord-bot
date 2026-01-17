import { Client, Interaction, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { Commands } from "./../index"
import "dotenv/config"

async function handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const slashCommand = Commands.find(command => command.data.name === interaction.commandName)

    // Command not found
    if (!slashCommand) {
        await interaction.reply({
            content: "An error has occured",
            flags: MessageFlags.Ephemeral
        })

        return
    }

    await slashCommand.execute(interaction)
}

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) await handleSlashCommand(interaction)
    })
}