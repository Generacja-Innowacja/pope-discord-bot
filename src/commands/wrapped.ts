import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { Command, Color, Emoji, Emojis, WrappedEntry, default_wrapped_entry } from "src/utils/config"
import { error } from "src/utils/error_handler"
import fs from "fs"
import path from "path"

export const Wrapped: Command = {
    data: new SlashCommandBuilder()
        .setName("wrapped")
        .setDescription("Sprawdź swój tegoroczny wynik kremówek!")

        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Kogo wrapped wyświetlić")
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild ||
            !interaction.channel ||
            !interaction.channel.isTextBased()) return await error(interaction, "channel", false)

        const month: number = new Date().getMonth() + 1
        if (month !== 12) {
            interaction.reply({
                content: "Wrapped jest dostępne dopiero w grudniu, poczekaj troszkę",
                flags: MessageFlags.Ephemeral
            })
            return
        }

        const kremufka_emoji: Emoji | undefined = Emojis.find(emoji => emoji.name === "kremuuuuufkuuuj_z_tyyyyyym_")
        if (!kremufka_emoji) return await error(interaction, "emoji", true)
        const kremufka_emoji_string: string = `<:${kremufka_emoji.name}:${kremufka_emoji.id}>`

        await interaction.deferReply()

        let reply_message: string = ""
        const target = interaction.options.getUser("user") ?? interaction.user
        if (target === interaction.user) {
            reply_message = "Oto twoje PopeWrapped™"
        } else {
            reply_message = `Oto PopeWrapped™ dla ${target}`
        }

        // Load JSON and find entry
        const wrapped_list: WrappedEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), "utf-8"))
        let wrapped_entry: WrappedEntry | undefined = wrapped_list.find((entry: WrappedEntry) => entry.id === target.id)

        // Default wrapped entry assignment
        if (!wrapped_entry) {
            wrapped_entry = { ...default_wrapped_entry }
            wrapped_entry.id = interaction.user.id
            wrapped_entry.username = interaction.user.username

            wrapped_list.push(wrapped_entry)
            fs.writeFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), JSON.stringify(wrapped_list, null, 4), "utf-8")
        }

        const wrapped_embed = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle(`PopeWrapped™ ${new Date().getFullYear()}`)
            .setThumbnail(target.displayAvatarURL())

            .setFields(
                {
                    name: `W tym roku zebrałeś/aś ${wrapped_entry.popes} ${kremufka_emoji_string}`,
                    value: "Pokaźny wynik!",
                    inline: true
                },
                {
                    name: "Co jest bardziej imponujące, to ile ich miałeś/aś z rzędu!",
                    value: `Aż ${wrapped_entry.most_popes_in_a_row}!`,
                    inline: true
                },
                {
                    name: `Przywitałeś/aś się z papieżem ${wrapped_entry.gandalf} razy`,
                    value: "Ale co w końcu miałeś/aś przez to na myśli..?",
                    inline: true
                },
                {
                    name: `Słuchałeś/aś słowa bożego ${wrapped_entry.bible} razy`,
                    value: "Prawdziwy uczeń Chrystusa!",
                    inline: true
                },
                {
                    name: `Śpiewałeś/aś barkę ${wrapped_entry.barka} razy`,
                    value: "Ulubiona piosenka?",
                    inline: true
                },
                {
                    name: `Spóźniłeś/aś się o kilka sekund ${wrapped_entry.one_min_late} razy`,
                    value: "Wiesz, że to 21:37, a nie 21:38, tak..?",
                    inline: true
                }
            )

        await interaction.editReply({ content: reply_message, embeds: [wrapped_embed] })
    }
}