import { PopeEntry, log } from "./config"
import fs from "fs"
import path from "path"
import schedule from "node-schedule"

schedule.scheduleJob("38 21 * * *", () => {
    let now: string = new Date().toISOString().split("T")[0]
    const data: PopeEntry[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), "utf-8"))

    let users: number = 0
    for (const user of data) {
        if (user.last_pope !== now) {
            user.popes_in_a_row = 0
            users++
        }
    }

    fs.writeFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), JSON.stringify(data, null, 4))
    log("LOG", `Resetted streaks of ${users} users.`)
})