import { log } from "./config"
import fs from "fs"
import path from "path"
import schedule from "node-schedule"

schedule.scheduleJob("0 0 1 1 *", () => {
    fs.writeFileSync(path.join(process.cwd(), "src", "logs", "wrapped.json"), "[]")
    log("LOG", "Resetted the wrapped.json file.")
})