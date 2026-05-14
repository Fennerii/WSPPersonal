import { activityKeys, type Activity } from "../types/index"
import { connect, filterKeys, toCamelCase, toSnakeCase } from "./supabase"

const TABLE_NAME = "activities"

type ItemType = Activity

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
        const error = { status: 404, message: "Activity not found" }
        throw error
    }
    return toCamelCase(result.data) as ItemType
}

export async function getByUser(userId: number, page: number = 1, limit: number = 5) {
    const db = connect()
    const from = (page - 1) * limit
    const to = from + limit - 1
    const result = await db
        .from(TABLE_NAME)
        .select("*", { count: "estimated" })
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .range(from, to)
    if (result.error) {
        throw result.error
    }
    const list = result.data.map(toCamelCase) as ItemType[]
    const count = result.count || 0
    return { list, count }
}

export async function getFriendFeed(friendIds: number[]) {
    const db = connect()
    const result = await db.from(TABLE_NAME).select("*", { count: "estimated" }).in("user_id", friendIds).order("date", { ascending: false })
    if (result.error) {
        throw result.error
    }
    const list = result.data.map(toCamelCase) as ItemType[]
    const count = result.count || 0
    return { list, count }
}

export async function getUserStats(userId: number) {
    const db = connect()
    const result = await db.from(TABLE_NAME).select("*").eq("user_id", userId)
    if (result.error) {
        throw result.error
    }
    const activities = result.data.map(toCamelCase) as ItemType[]
    const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0)
    const totalCalories = activities.reduce((sum, a) => sum + a.calories, 0)
    const totalSessions = activities.length
    return { totalDuration, totalCalories, totalSessions }
}

export async function create(item: ItemType): Promise<ItemType> {
    const db = connect()
    const result = await db
        .from(TABLE_NAME)
        .insert(toSnakeCase(filterKeys(item, activityKeys)))
        .select()
        .single()
    if (result.error) {
        throw result.error
    }
    return toCamelCase(result.data) as ItemType
}

export async function update(id: number, item: Partial<ItemType>): Promise<ItemType> {
    const db = connect()
    const result = await db
        .from(TABLE_NAME)
        .update(toSnakeCase(item))
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
        { user_id: 1, type_id: 1, name: "Running around the fountain", date: "2026-03-01", duration: 30, calories: 300, notes: "felt great" },
        { user_id: 1, type_id: 2, name: "PPL Cycle 1", date: "2026-03-02", duration: 60, calories: 400, notes: "" },
        { user_id: 2, type_id: 3, name: "park park park ride ride ride", date: "2026-03-01", duration: 45, calories: 350, notes: "" },
        { user_id: 2, type_id: 4, name: "swimmin in circles", date: "2026-03-03", duration: 40, calories: 320, notes: "new pb" },
        { user_id: 3, type_id: 5, name: "Upwards and Downwards Dog", date: "2026-03-02", duration: 30, calories: 150, notes: "" },
        { user_id: 4, type_id: 6, name: "Trailing The Mountain", date: "2026-03-01", duration: 90, calories: 600, notes: "beautiful views" },
    ]
    const result = await db.from(TABLE_NAME).insert(items)
    if (result.error) {
        throw result.error
    }
    return result.count
}