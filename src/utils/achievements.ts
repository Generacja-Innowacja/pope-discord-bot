import { User, EmbedBuilder } from "discord.js"
import { PopeEntry, WrappedEntry, AchievementInfo, Achievement, AchievementEntry, Color } from "src/utils/config"
import fs from "fs"
import path from "path"

const achievement_list: AchievementInfo[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "utils", "achievement_info.json"), "utf-8"))

function getAchievement(id: number): AchievementInfo | undefined {
    return achievement_list.find((info: AchievementInfo) => info.id === id)
}

export async function handleAchievements(user: User): Promise<void> {
    const now: Date = new Date()
    const today: string = now.toISOString().split("T")[0]

    const pope_list: PopeEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), "utf-8"))
    const pope_entry: PopeEntry | undefined = pope_list.find((entry: PopeEntry) => entry.id === user.id)
    if (!pope_entry) return

    const wrapped_list: WrappedEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), "utf-8"))
    const wrapped_entry: WrappedEntry | undefined = wrapped_list.find((entry: WrappedEntry) => entry.id === user.id)
    if (!wrapped_entry) return

    const achievement_unlocked: AchievementEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "achievements.json"), "utf-8")) // All members
    const achievement_unlocked_entry: AchievementEntry | undefined = achievement_unlocked.find((entry: AchievementEntry) => entry.id === user.id) // Single member
    if (!achievement_unlocked_entry) return



    const new_achievements: AchievementInfo[] = []

    // Sunday
    if (pope_entry.last_pope === today && now.getDay() === 0) {
        const achievement: AchievementInfo | undefined = getAchievement(1)
        if (!achievement) return
        new_achievements.push(achievement)
    }

    // All secrets
    if (wrapped_entry.gandalf > 1 && wrapped_entry.bible > 1 && wrapped_entry.barka > 1 && wrapped_entry.one_min_late > 1) {
        const achievement: AchievementInfo | undefined = getAchievement(3)
        if (!achievement) return
        new_achievements.push(achievement)
    }

    // Golden kremówka
    if (pope_entry.popes_in_a_row > 100) {
        const achievement: AchievementInfo | undefined = getAchievement(4)
        if (!achievement) return
        new_achievements.push(achievement)
    }

    // 2137
    if (pope_entry.popes > 1) {
        const achievement: AchievementInfo | undefined = getAchievement(5)
        if (!achievement) return
        new_achievements.push(achievement)
    }
    if (pope_entry.popes_in_a_row > 10) {
        const achievement: AchievementInfo | undefined = getAchievement(6)
        if (!achievement) return
        new_achievements.push(achievement)
    }
    if (pope_entry.popes > 25) {
        const achievement: AchievementInfo | undefined = getAchievement(7)
        if (!achievement) return
        new_achievements.push(achievement)
    }
    if (pope_entry.popes > 50) {
        const achievement: AchievementInfo | undefined = getAchievement(8)
        if (!achievement) return
        new_achievements.push(achievement)
    }
    if (pope_entry.popes > 100) {
        const achievement: AchievementInfo | undefined = getAchievement(9)
        if (!achievement) return
        new_achievements.push(achievement)
    }
    if (pope_entry.popes > 250) {
        const achievement: AchievementInfo | undefined = getAchievement(10)
        if (!achievement) return
        new_achievements.push(achievement)
    }
    if (pope_entry.popes > 500) {
        const achievement: AchievementInfo | undefined = getAchievement(11)
        if (!achievement) return
        new_achievements.push(achievement)
    }

    new_achievements.map((entry: AchievementInfo) => {
        achievement_unlocked_entry.achievements.push({ id: entry.id, date: today })

        // Send embed
        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            // to be finished
    })

    // All achievements
    if (achievement_unlocked_entry.achievements.length === achievement_list.length - 1 && !getAchievement(2)) {
        const achievement: AchievementInfo | undefined = getAchievement(2)
        if (!achievement) return
        achievement_unlocked_entry.achievements.push({ id: achievement.id, date: today })
    }

    achievement_unlocked_entry.achievements.sort((a, b) => a.id - b.id)
    fs.writeFileSync(path.join(process.cwd(), "src", "logs", "achievements.json"), JSON.stringify(achievement_unlocked, null, 4))
}