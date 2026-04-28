import { Router } from "express"
import { getAll, get, getByUser, getFriendFeed, getUserStats, create, update, remove, seed } from "../models/activities"
import { Activity, DataEnvelope, DataListEnvelope } from "../types/index"
import { requireAuth } from "../middleware/auth"

const app = Router()

app.get("/", async (_req, res) => {
    const { list, count } = await getAll()
    const response: DataListEnvelope<Activity> = {
        data: list,
        isSuccess: true,
        total: count,
    }
    res.send(response)
})
.get("/user/:userId", async (req, res) => {
    const { userId } = req.params
    const { list, count } = await getByUser(Number(userId))
    const response: DataListEnvelope<Activity> = {
        data: list,
        isSuccess: true,
        total: count,
    }
    res.send(response)
})
.get("/feed", async (req, res) => {
    const friendIds = (req.query.friendIds as string).split(",").map(Number)
    const { list, count } = await getFriendFeed(friendIds)
    const response: DataListEnvelope<Activity> = {
        data: list,
        isSuccess: true,
        total: count,
    }
    res.send(response)
})
.get("/stats/:userId", async (req, res) => {
    const { userId } = req.params
    const stats = await getUserStats(Number(userId))
    const response: DataEnvelope<typeof stats> = {
        data: stats,
        isSuccess: true,
    }
    res.send(response)
})
.get("/:id", async (req, res) => {
    const { id } = req.params
    const response: DataEnvelope<Activity> = {
        data: await get(Number(id)),
        isSuccess: true,
    }
    res.send(response)
})
.post("/", async (req, res) => {
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }
    const newActivity = await create({ ...req.body, userId })
    const response: DataEnvelope<Activity> = {
        data: newActivity,
        isSuccess: true,
    }
    res.send(response)
})
.patch("/:id", async (req, res) => {
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }
    const updatedActivity = await update(Number(req.params.id), req.body)
    const response: DataEnvelope<Activity> = {
        data: updatedActivity,
        isSuccess: true,
    }
    res.send(response)
})
.delete("/:id", async (req, res) => {
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }
    const removedActivity = await remove(Number(req.params.id))
    const response: DataEnvelope<Activity> = {
        data: removedActivity,
        isSuccess: true,
        message: `Activity ${removedActivity.name} has been removed.`,
    }
    res.send(response)
})
.post("/seed", requireAuth("admin"), async (_req, res) => {
    const count = await seed()
    const response: DataEnvelope<number | null> = {
        data: count,
        isSuccess: true,
    }
    res.send(response)
})

export default app