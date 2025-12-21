import fs from "fs"
import schedule from "node-schedule"

function log(level, message) {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${level}]: ${message}`)
}

schedule.scheduleJob("0 0 1 1 *", () => {
    const data = JSON.parse(fs.readFileSync("src/logs/wrapped.json"))
    fs.writeFileSync("src/logs/wrapped.json", "")
    log("LOG", `Resetted the wrapped.json file.`)
})