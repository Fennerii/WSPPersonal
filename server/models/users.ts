import { sign } from "jsonwebtoken"
import { userKeys, type User } from "../types"
import { connect, filterKeys, toCamelCase, toSnakeCase } from "./supabase"

const TABLE_NAME = "users"

type ItemType = User

export async function getAll() {
    const db = connect()
    const result = await db.from(TABLE_NAME).select("*", { count: "estimated" })
    if (result.error) {
        throw result.error
    }
    const list = result.data.map(toCamelCase) as ItemType[]
    const count = result.count || 0
    return { list, count }
}

export async function get(id: number): Promise<ItemType> {
    const db = connect()
    const result = await db.from(TABLE_NAME).select("*").eq("id", id).single()
    if (result.error) {
        const error = { status: 404, message: "User not found" }
        throw error
    }
    return toCamelCase(result.data) as ItemType
}

export async function getByUsername(username: string): Promise<ItemType> {
    const db = connect()
    const result = await db.from(TABLE_NAME).select("*").eq("username", username).single()
    if (result.error) {
        const error = { status: 404, message: "User not found" }
        throw error
    }
    return toCamelCase(result.data) as ItemType
}

export async function login(username: string): Promise<{ token: string; user: ItemType }> {
    const user = await getByUsername(username)
    return new Promise((resolve, reject) => {
        sign(
            user,
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" },
            (err, token) => {
                if (err || !token) {
                    reject(err || new Error("Token generation failed"))
                    return
                }
                resolve({ token, user })
            },
        )
    })
}

export async function create(user: ItemType): Promise<ItemType> {
    const db = connect()
    const result = await db
        .from(TABLE_NAME)
        .insert(toSnakeCase(filterKeys(user, userKeys)))
        .select()
        .single()
    if (result.error) {
        throw result.error
    }
    return toCamelCase(result.data) as ItemType
}

export async function update(id: number, user: Partial<ItemType>): Promise<ItemType> {
    const db = connect()
    const result = await db
        .from(TABLE_NAME)
        .update(toSnakeCase(user))
        .eq("id", id)
        .select()
        .single()
    if (result.error) {
        throw result.error
    }
    return toCamelCase(result.data) as ItemType
}

export async function remove(id: number): Promise<ItemType> {
    const db = connect()
    const result = await db
        .from(TABLE_NAME)
        .delete()
        .eq("id", id)
        .select()
        .single()
    if (result.error) {
        throw result.error
    }
    return toCamelCase(result.data) as ItemType
}

export async function seed() {
    const db = connect()
    const items = [
        { name: "Jonathan Fenner", username: "fennerii", role: "admin", photo: "/nightfly.jpg", password: "password" },
        { name: "Bilbo Swaggins", username: "FellowshipOfTheBling", role: "user", photo: "/bilbowaggins.jpg", password: "password" },
        { name: "Marty Reisman", username: "MartySupreme", role: "user", photo: "/marty.jpg", password: "password" },
        { name: "Kayleigh Rose Amstutz", username: "ChappellRoan", role: "user", photo: "/bigchappell.jpg", password: "password" },
    ]
    const result = await db.from(TABLE_NAME).insert(items)
    if (result.error) {
        throw result.error
    }
    return result.count
}