import { Router } from "express"
import { getAll, get, create, update, remove, seed } from "../models/activityTypes"
import { ActivityType, DataEnvelope, DataListEnvelope } from "../types/index"

const app = Router()

app.get("/", async (_req, res) => {
    const { list, count } = await getAll()
    const response: DataListEnvelope<ActivityType> = {
        data: list,
        isSuccess: true,
        total: count,
    }
    res.send(response)
})
.get("/:id", async (req, res) => {
    const { id } = req.params
    const response: DataEnvelope<ActivityType> = {
        data: await get(Number(id)),
        isSuccess: true,
    }
    res.send(response)
})
.post("/", async (req, res) => {
    const newType = await create(req.body)
    const response: DataEnvelope<ActivityType> = {
        data: newType,
        isSuccess: true,
    }
    res.send(response)
})
.patch("/:id", async (req, res) => {
    const { id } = req.params
    const updatedType = await update(Number(id), req.body)
    const response: DataEnvelope<ActivityType> = {
        data: updatedType,
        isSuccess: true,
    }
    res.send(response)
})
.delete("/:id", async (req, res) => {
    const { id } = req.params
    const removedType = await remove(Number(id))
    const response: DataEnvelope<ActivityType> = {
        data: removedType,
        isSuccess: true,
        message: `Activity type ${removedType.name} has been removed.`,
    }
    res.send(response)
})
.post("/seed", async (_req, res) => {
    const count = await seed()
    const response: DataEnvelope<number | null> = {
        data: count,
        isSuccess: true,
    }
    res.send(response)
})

export default app