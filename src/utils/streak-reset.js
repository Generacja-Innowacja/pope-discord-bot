import fs from "fs"
import schedule from "node-schedule"

function log(level, message) {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${level}]: ${message}`)
}

schedule.scheduleJob("40 21 * * *", () => {
    let now = new Date()
    now = now.toISOString().split("T")[0]
    const data = JSON.parse(fs.readFileSync("src/logs/pope.json"))

    let users = 0
    for (const user of data) {
        if (user.last_pope !== now) {
            user.popes_in_a_row = 0
            users++
        }
    }

    fs.writeFileSync("src/logs/pope.json", JSON.stringify(data, null, 4))
    log("LOG", `Resetted streaks of ${users} users.`)
})