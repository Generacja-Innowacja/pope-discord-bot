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

export interface PopeEntry {
    id: string,
    username: string,
    popes: number,
    popes_in_a_row: number,
    last_pope: string
}

export const default_pope_entry: PopeEntry = {
    id: "",
    username: "",
    popes: 0,
    popes_in_a_row: 0,
    last_pope: ""
}

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

export const default_wrapped_entry: WrappedEntry = {
    id: "",
    username: "",
    popes: 0,
    most_popes_in_a_row: 0,
    gandalf: 0,
    bible: 0,
    barka: 0,
    one_min_late: 0
}