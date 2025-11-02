import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import "dotenv/config";

const commands = [];
const commandsPath = path.join(process.cwd(), "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = await import(`../commands/${file}`);
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(process.env.TOKEN);

try {
    console.log(`Refreshing ${commands.length} application (/) commands...`);

    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands },
    );

    console.log("Successfully reloaded application (/) commands!");
} catch (error) {
    console.error(error);
}