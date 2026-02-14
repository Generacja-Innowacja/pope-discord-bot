import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { Pagination } from "pagination.djs"
import { Command, Color, WrappedEntry, default_wrapped_entry } from "src/utils/config"
import { error } from "src/utils/error_handler"
import fs from "fs"
import path from "path"

export const Barka: Command = {
    data: new SlashCommandBuilder()
        .setName("barka")
        .setDescription("Zobacz teskt ulubionej piosenki papieża"),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild ||
            !interaction.channel ||
            !interaction.channel.isTextBased() ||
            interaction.channel.id != process.env.CHANNEL_ID) return error(interaction, "channel", false)

        // Load JSON and find entry
        const wrapped_list: WrappedEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), "utf-8"))
        let wrapped_entry: WrappedEntry | undefined = wrapped_list.find((entry: WrappedEntry) => entry.id === interaction.user.id)

        // Default wrapped entry assignment
        if (!wrapped_entry) {
            wrapped_entry = { ...default_wrapped_entry }
            wrapped_entry.id = interaction.user.id
            wrapped_entry.username = interaction.user.username

            wrapped_list.push(wrapped_entry)
        }

        // In case someone has changed their username, update it
        wrapped_entry.username = interaction.user.username

        new Pagination(interaction)
            .setColor(Color.primary)
            .setTitle("🙏 Barka 🙏")
            .setDescription("tłumaczenie przez ks. Stanisława Szmidta")

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
        fs.writeFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), JSON.stringify(wrapped_list, null, 4), "utf-8")
    }
}