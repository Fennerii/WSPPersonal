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
    const activityNames = [
        "Morning Run", "Evening Jog", "PPL Cycle", "Upper Body Day", "Leg Day",
        "Park Bike Ride", "Swimming Laps", "Yoga Flow", "Mountain Trail", "HIIT Session",
        "Jump Rope", "Rowing Machine", "Stairmaster", "Treadmill Walk", "Deadlift Day",
        "Bench Press Day", "Pull Day", "Push Day", "Core Workout", "Stretching Session",
        "CrossFit WOD", "Spin Class", "Pilates", "Boxing Session", "Kettlebell Circuit",
    ]
    const notes = ["felt great", "tough session", "new pb", "solid effort", "need more sleep", "crushed it", "", "", ""]
    const items = []
    for (let i = 0; i < 50; i++) {
        const date = new Date(2026, 0, 1)
        date.setDate(date.getDate() + i)
        items.push({
            user_id: 1,
            type_id: (i % 6) + 1,
            name: activityNames[i % activityNames.length],
            date: date.toISOString().split("T")[0],
            duration: 20 + (i % 8) * 10,
            calories: 150 + (i % 10) * 50,
            notes: notes[i % notes.length],
        })
    }
    const result = await db.from(TABLE_NAME).insert(items)
    if (result.error) {
        throw result.error
    }
    return result.count
}