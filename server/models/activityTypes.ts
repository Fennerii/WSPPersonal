import { activityTypeKeys, type ActivityType } from "../types/index.ts"
import { connect, filterKeys, toCamelCase, toSnakeCase } from "./supabase.ts"

const TABLE_NAME = "activity_types"

type ItemType = ActivityType

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
        const error = { status: 404, message: "Activity type not found" }
        throw error
    }
    return toCamelCase(result.data) as ItemType
}

export async function create(item: ItemType): Promise<ItemType> {
    const db = connect()
    const result = await db
        .from(TABLE_NAME)
        .insert(toSnakeCase(filterKeys(item, activityTypeKeys)))
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
    const types = [
        { name: "running" },
        { name: "gym" },
        { name: "cycling" },
        { name: "swimming" },
        { name: "yoga" },
        { name: "hiking" },
    ]
    const result = await db.from(TABLE_NAME).insert(types)
    if (result.error) {
        throw result.error
    }
    return result.count
}