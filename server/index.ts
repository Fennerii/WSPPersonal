import { config } from "dotenv"
config()
import express from "express"
import usersController from "./controllers/users"
import activitiesController from "./controllers/activities"
import activityTypesController from "./controllers/activityTypes"
import { DataEnvelope } from "./types/index"
import { requireAuth, validateJWT } from "./middleware/auth"

const PORT = process.env.PORT ?? 3000
const SERVER = process.env.SERVER ?? "localhost"
const STATIC_DIR = process.env.STATIC_DIR ?? "client/dist"

const app = express()

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "*")

    if (req.method === "OPTIONS") {
        res.sendStatus(200)
        return
    }

    next()
})
.use(express.json())
.use(validateJWT)

///////// Routes
app.use(express.static(STATIC_DIR))
    .get("/heavylifting", (_req, res) => {
        res.send("HeavyLifting is running!")
    })
    .use("/api/v1/users", usersController)
    .use("/api/v1/activities", requireAuth(), activitiesController)
    .use("/api/v1/activity-types", activityTypesController)

app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
    ) => {
        console.error(err)
        const response: DataEnvelope<null> = {
            data: null,
            isSuccess: false,
            message: err.message ?? "error",
        }
        res.status((err as any).status ?? 500).send(response)
    },
)

app.listen(PORT, () => {
    console.log(`Server is running on http://${SERVER}:${PORT}`)
})