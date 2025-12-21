import { EmbedBuilder, SlashCommandBuilder, MessageFlags } from "discord.js"
import fs from "fs"

export const data = new SlashCommandBuilder()
    .setName("wrapped")
    .setDescription("See how well you've done this year!")

    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("Kogo wrapped wyświetlić")
            .setRequired(false)
    )

export async function execute(interaction) {
    const month = new Date().getMonth() + 1
    if (month != 12) {
        return interaction.reply({
            content: "Wrapped jest dostępne dopiero w grudniu, poczekaj troszkę",
            flags: MessageFlags.Ephemeral
        })
    }

    await interaction.deferReply()

    const wrapped = JSON.parse(fs.readFileSync("src/logs/wrapped.json"))
    let wrapped_entry = wrapped.find(e => e.id === interaction.user.id)

    if (!wrapped_entry) {
        entry = {
            id: interaction.user.id,
            username: interaction.user.username,
            popes: 0,
            most_popes_in_a_row: 0,
            gandalf: 0,
            bible: 0,
            barka: 0,
            one_min_late: 0
        }

        wrapped.push(wrapped_entry)
    }

    // In case someone changed their username
    wrapped_entry.username = interaction.user.username

    let reply_message = ""
    const target = interaction.options.getUser("user") ?? interaction.user

    const WrappedEmbed = new EmbedBuilder()
        .setTitle(`PopeWrapped™ ${new Date().getFullYear()}`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setColor("#69bccd")

        .setFields(
            {
                name: `W tym roku zebrałeś/aś ${wrapped_entry.popes} <:kremuuuuufkuuuj_z_tyyyyyym_:1435705908167708743>`,
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

    if (target === interaction.user) {
        reply_message = "Oto twoje PopeWrapped™"
    } else {
        reply_message = `Oto PopeWrapped™ dla ${target}`
    }

    await interaction.editReply({
        content: reply_message,
        embeds: [WrappedEmbed]
    })
}