import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { Pagination } from "pagination.djs"
import { Command, Color, WrappedEntry } from "src/utils/config"
import fs from "fs"
import "dotenv/config"

export const Barka: Command = {
    data: new SlashCommandBuilder()
        .setName("barka")
        .setDescription("Zobacz teskt ulubionej piosenki papieża")
        .setContexts([0]),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild || !interaction.channel ||
            !interaction.channel.isTextBased() || interaction.channel.id != process.env.CHANNEL_ID) {
                const channel_error_embed: EmbedBuilder = new EmbedBuilder()
                    .setColor(Color.accent)
                    .setTitle(`Możesz śpiewać barkę jedynie w kanale ${interaction.guild!.channels.fetch(process.env.CHANNEL_ID!)}`)

                interaction.reply({ embeds: [channel_error_embed], flags: MessageFlags.Ephemeral })
                return
            }

        const wrapped = JSON.parse(fs.readFileSync("src/logs/wrapped.json", "utf-8"))
        let wrapped_entry: WrappedEntry | undefined = wrapped.find((e: WrappedEntry) => e.id === interaction.user.id)

        if (!wrapped_entry) {
            wrapped_entry = {
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
        fs.writeFileSync("src/logs/wrapped.json", JSON.stringify(wrapped, null, 4), "utf-8")
    }
}