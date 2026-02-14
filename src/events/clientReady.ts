import { Client, REST, Routes } from "discord.js"
import { Commands } from "./../index"

export default (client: Client): void => {
    client.on("clientReady", async () => {
        if (!client.user || !client.application) return

        client.application.commands.set([])
        const rest = new REST().setToken(process.env.TOKEN!)
        await rest.put(Routes.applicationCommands(client.user.id), { body: Commands.map(command => command.data.toJSON()) })

        console.log(`Logged in as ${client.user.username}`)
    })
}