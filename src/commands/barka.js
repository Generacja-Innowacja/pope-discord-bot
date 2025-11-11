import { SlashCommandBuilder } from "discord.js"
import { Pagination } from "pagination.djs"

export const data = new SlashCommandBuilder()
    .setName("barka")
    .setDescription("Zobacz tekst ulubionej piosenki papierza")

export async function execute(interaction) {
    new Pagination(interaction)
        .setTitle("🙏 Barka 🙏")
        .setDescription("tłumaczenie przez ks. Stanisława Szmidta")
        .setColor("#69bccd")

        .setFields([
            {
                name: "1. Pan kiedyś stanął nad brzegiem,",
                value: `Szukał ludzi gotowych pójść za Nim;
                        By łowić serca
                        Słów Bożych prawdą.`.replace(/^+/gm, '')
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
                        I czyste serce.`.replace(/^+/gm, '')
            },
            {
                name: "Ref.: O Panie, to Ty na mnie spojrzałeś,",
                value: `Twoje usta dziś wyrzekły me imię.
                        Swoją barkę pozostawiam na brzegu,
                        Razem z Tobą nowy zacznę dziś łów.`.replace(/^+/gm, '')
            },
            {
                name: "3. Ty, potrzebujesz mych dłoni,",
                value: `Mego serca młodego zapałem
                        Mych kropli potu
                        I samotności.`.replace(/^+/gm, '')
            },
            {
                name: "Ref.: O Panie, to Ty na mnie spojrzałeś,",
                value: `Twoje usta dziś wyrzekły me imię.
                        Swoją barkę pozostawiam na brzegu,
                        Razem z Tobą nowy zacznę dziś łów.`.replace(/^+/gm, '')
            },
            {
                name: "4. Dziś wypłyniemy już razem",
                value: `Łowić serca na morzach dusz ludzkich
                        Twej prawdy siecią
                        I słowem życia.`.replace(/^+/gm, '')
            },
            {
                name: "Ref.: O Panie, to Ty na mnie spojrzałeś,",
                value: `Twoje usta dziś wyrzekły me imię.
                        Swoją barkę pozostawiam na brzegu,
                        Razem z Tobą nowy zacznę dziś łów`.replace(/^+/gm, '')
            }
        ])

        .paginateFields()
        .render()
}