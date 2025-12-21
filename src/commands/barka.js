import { SlashCommandBuilder, MessageFlags } from "discord.js"
import { Pagination } from "pagination.djs"
import fs from "fs"

export const data = new SlashCommandBuilder()
    .setName("barka")
    .setDescription("Zobacz tekst ulubionej piosenki papierza")

export async function execute(interaction) {
    if (interaction.channel.id != process.env.CHANNEL_ID) {
        return interaction.reply({
            content: "Musisz użyć tego w kanale #2137!",
            flags: MessageFlags.Ephemeral
        })
    }

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

    new Pagination(interaction)
        .setTitle("🙏 Barka 🙏")
        .setDescription("tłumaczenie przez ks. Stanisława Szmidta")
        .setColor("#69bccd")

        .setFields([
            {
                name: "1. Pan kiedyś stanął nad brzegiem,",
                value: `Szukał ludzi gotowych pójść za Nim;
                        By łowić serca
                        Słów Bożych prawdą.`.replace(/^ +/gm, '')
            },
            {
                name: "Ref.: O Panie, to Ty na mnie spojrzałeś,",
                value: `Twoje usta dziś wyrzekły me imię.
                        Swoją barkę pozostawiam na brzegu.
                        Razem z Tobą nowy zacznę dziś łów.`.replace(/^ +/gm, '')
            },
            {
                name: "2. Jestem ubogim człowiekiem,",
                value: `Moim skarbem są ręce gotowe
                        Do pracy z Tobą
                        I czyste serce.`.replace(/^ +/gm, '')
            },
            {
                name: "Ref.: O Panie, to Ty na mnie spojrzałeś,",
                value: `Twoje usta dziś wyrzekły me imię.
                        Swoją barkę pozostawiam na brzegu,
                        Razem z Tobą nowy zacznę dziś łów.`.replace(/^ +/gm, '')
            },
            {
                name: "3. Ty, potrzebujesz mych dłoni,",
                value: `Mego serca młodego zapałem
                        Mych kropli potu
                        I samotności.`.replace(/^ +/gm, '')
            },
            {
                name: "Ref.: O Panie, to Ty na mnie spojrzałeś,",
                value: `Twoje usta dziś wyrzekły me imię.
                        Swoją barkę pozostawiam na brzegu,
                        Razem z Tobą nowy zacznę dziś łów.`.replace(/^ +/gm, '')
            },
            {
                name: "4. Dziś wypłyniemy już razem",
                value: `Łowić serca na morzach dusz ludzkich
                        Twej prawdy siecią
                        I słowem życia.`.replace(/^ +/gm, '')
            },
            {
                name: "Ref.: O Panie, to Ty na mnie spojrzałeś,",
                value: `Twoje usta dziś wyrzekły me imię.
                        Swoją barkę pozostawiam na brzegu,
                        Razem z Tobą nowy zacznę dziś łów`.replace(/^ +/gm, '')
            }
        ])

        .paginateFields()
        .render()

    wrapped_entry.barka++
    fs.writeFileSync("src/logs/wrapped.json", JSON.stringify(wrapped, null, 4))
}