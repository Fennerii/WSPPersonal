import { Router } from "express"
import { getAll, get, getByUsername, create, update, remove, seed } from "../models/users"
import { User, DataEnvelope, DataListEnvelope } from "../types/index"

const app = Router()

app.post("/login", async (req, res) => {
    const { username } = req.body
    const user = await getByUsername(username)
    const response: DataEnvelope<User> = {
        data: user,
        isSuccess: true,
    }
    res.send(response)
})
.get("/", async (req, res) => {
    const { list, count } = await getAll()
    const response: DataListEnvelope<User> = {
        data: list,
        isSuccess: true,
        total: count,
    }
    res.send(response)
})
.get("/:id", async (req, res) => {
    const { id } = req.params
    const response: DataEnvelope<User> = {
        data: await get(Number(id)),
        isSuccess: true,
    }
    res.send(response)
})
.post("/", async (req, res) => {
    const newUser = await create(req.body)
    const response: DataEnvelope<User> = {
        data: newUser,
        isSuccess: true,
    }
    res.send(response)
})
.patch("/:id", async (req, res) => {
    const { id } = req.params
    const updatedUser = await update(Number(id), req.body)
    const response: DataEnvelope<User> = {
        data: updatedUser,
        isSuccess: true,
    }
    res.send(response)
})
.delete("/:id", async (req, res) => {
    const { id } = req.params
    const removedUser = await remove(Number(id))
    const response: DataEnvelope<User> = {
        data: removedUser,
        isSuccess: true,
        message: `User ${removedUser.name} has been removed.`,
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