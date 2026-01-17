import {
    SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
    ColorResolvable
} from "discord.js"

export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export const Color: {primary: ColorResolvable, accent: ColorResolvable} = {
    primary: "#1a699a",
    accent: "#fcb0b0"
}

export type Emoji = {
    id: string,
    name: string
}

export const Emojis: Emoji[] = [
    {
        id: "1435698939323224195",
        name: "kremuuuuufkuuuj_z_tyyyyyym_"
    }
]

export interface WrappedEntry {
    id: string,
    username: string,
    popes: number,
    most_popes_in_a_row: number,
    gandalf: number,
    bible: number,
    barka: number,
    one_min_late: number
}