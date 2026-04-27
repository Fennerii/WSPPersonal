import { config } from "dotenv"
config()

import { seed as seedUsers } from "./users"
import { seed as seedActivityTypes } from "./activityTypes"
import { seed as seedActivities } from "./activities"

Promise.all([seedUsers(), seedActivityTypes()])
    .then(() => seedActivities())
    .then(() => {
        console.log("Seeding complete")
        process.exit(0)
    })
    .catch((err) => {
        console.error("Error seeding data:", err)
        process.exit(1)
    })