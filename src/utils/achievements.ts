import { Message, EmbedBuilder } from "discord.js"
import { PopeEntry, WrappedEntry, AchievementId, AchievementInfo, Achievement, AchievementEntry, Color } from "src/utils/config"
import fs from "fs"
import path from "path"

const achievement_list: AchievementInfo[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "utils", "achievement_info.json"), "utf-8"))

function getAchievement(id: number): AchievementInfo | undefined {
    return achievement_list.find((info: AchievementInfo) => info.id === id)
}

function getAchievementEmbed(achievement: AchievementInfo, now: Date): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(Color.primary)
        .setTitle(`Osiągnięcie odblokowane: ${achievement.name}`)
        .setDescription(achievement.description)
        .setTimestamp(now)
}

export async function handleAchievements(message: Message): Promise<void> {
    if (!message.guild ||
        !message.channel ||
        !message.channel.isTextBased() ||
        !message.channel.isSendable() ||
        message.channel.id !== process.env.CHANNEL_ID! ||
        message.channel.id !== process.env.OFFTOP_ID!) return
    const channel = message.channel

    const now: Date = new Date()
    const today: string = now.toISOString().split("T")[0]

    const pope_list: PopeEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), "utf-8"))
    const pope_entry: PopeEntry | undefined = pope_list.find((entry: PopeEntry) => entry.id === message.author.id)
    if (!pope_entry) return

    const wrapped_list: WrappedEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), "utf-8"))
    const wrapped_entry: WrappedEntry | undefined = wrapped_list.find((entry: WrappedEntry) => entry.id === message.author.id)
    if (!wrapped_entry) return

    const achievement_unlocked: AchievementEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "achievements.json"), "utf-8")) // All members
    const achievement_unlocked_entry: AchievementEntry | undefined = achievement_unlocked.find((entry: AchievementEntry) => entry.id === message.author.id) // Single member
    if (!achievement_unlocked_entry) return



    const new_achievements: AchievementInfo[] = []

    // Sunday
    if (pope_entry.last_pope === today && now.getDay() === 0) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.dzien_swiety)
        if (achievement) new_achievements.push(achievement)
    }

    // All secrets
    if (wrapped_entry.gandalf > 1 && wrapped_entry.bible > 1 && wrapped_entry.barka > 1 && wrapped_entry.one_min_late > 1) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.wielkanocny_zajaczek)
        if (achievement) new_achievements.push(achievement)
    }

    // Golden kremówka
    if (pope_entry.popes_in_a_row > 100) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.gold_digger)
        if (achievement) new_achievements.push(achievement)
    }

    // 2137
    if (pope_entry.popes > 1) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.witaj_w_sekcie)
        if (achievement) new_achievements.push(achievement)
    }
    if (pope_entry.popes_in_a_row > 10) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.pilny_uczen)
        if (achievement) new_achievements.push(achievement)
    }
    if (pope_entry.popes > 25) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.ministrant)
        if (achievement) new_achievements.push(achievement)
    }
    if (pope_entry.popes > 50) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.lektor)
        if (achievement) new_achievements.push(achievement)
    }
    if (pope_entry.popes > 100) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.ksiadz)
        if (achievement) new_achievements.push(achievement)
    }
    if (pope_entry.popes > 250) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.biskup)
        if (achievement) new_achievements.push(achievement)
    }
    if (pope_entry.popes > 500) {
        const achievement: AchievementInfo | undefined = getAchievement(AchievementId.blogoslawiony)
        if (achievement) new_achievements.push(achievement)
    }

    new_achievements.map(async (entry: AchievementInfo) => {
        achievement_unlocked_entry.achievements.push({ id: entry.id, date: today })

        const embed: EmbedBuilder = getAchievementEmbed(entry, now)
        await channel.send({ content: `Gratulacje ${message.author}, nowe osiągnięcie osiągnięte!`, embeds: [embed] })
    })

    // All achievements
    if (achievement_unlocked_entry.achievements.length === achievement_list.length - 1 && !getAchievement(2)) {
        const achievement: AchievementInfo | undefined = getAchievement(2)
        if (achievement) {
            achievement_unlocked_entry.achievements.push({ id: achievement.id, date: today })

            const embed: EmbedBuilder = getAchievementEmbed(achievement, now)
            await channel.send({ content: `Gratulacje ${message.author}, nowe osiągnięcie osiągnięte!`, embeds: [embed] })
        }
    }

    achievement_unlocked_entry.achievements.sort((a, b) => a.id - b.id)
    fs.writeFileSync(path.join(process.cwd(), "src", "logs", "achievements.json"), JSON.stringify(achievement_unlocked, null, 4))
}