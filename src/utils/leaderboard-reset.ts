import { PopeEntry, log } from "./config"
import fs from "fs"
import path from "path"
import schedule from "node-schedule"

function load(): PopeEntry[] {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), "utf-8"))
}

function save(data: PopeEntry[], message: string): void {
    fs.writeFileSync(path.join(process.cwd(), "src", "logs", "pope.json"), JSON.stringify(data, null, 4))
    log("LOG", message)
}

/*

    scheduleJob.spec syntax:

    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    │
    │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    │    │    │    │    └───── month (1 - 12)
    │    │    │    └────────── day of month (1 - 31)
    │    │    └─────────────── hour (0 - 23)
    │    └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)

*/

// Weekly reset
// Every other Sunday 22:00
schedule.scheduleJob("0 22 * * 7", async () => {
    const today: Date = new Date()

    // Check if the date is an even number so that it only runs every other week
    if (today.getDate() % 2 === 0) {
        const pope_list: PopeEntry[] = load()

        pope_list.forEach((entry: PopeEntry) => entry.popes_14d = 0)

        save(pope_list, "Resetted weekly scores")
    }
})

// Monthly reset
schedule.scheduleJob("0 22 * * *", async () => {
    const today: Date = new Date()
    const tomorrow: Date = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    // Check if it's last day of the month
    if (tomorrow.getDate() === 1) {
        const pope_list: PopeEntry[] = load()
        let message: string

        pope_list.forEach((entry: PopeEntry) => entry.popes_1m = 0)
        message = "Resetted monthly scores"

        if ((today.getMonth() + 1) % 3 === 0) {
            pope_list.forEach((entry: PopeEntry) => entry.popes_3m = 0)
            message = "Resetted monthly and every 3rd month scores"
        }

        save(pope_list, message)
    }
})

// Yearly reset
// December 31st 22:00
schedule.scheduleJob("0 22 31 12 *", async () => {
    const pope_list: PopeEntry[] = load()

    pope_list.forEach((entry: PopeEntry) => entry.popes_year = 0)

    save(pope_list, "Resetted yearly scores")
})