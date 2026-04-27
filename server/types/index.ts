export type { DataEnvelope, DataListEnvelope } from "./dataEnvelopes"

export type UserRole = "admin" | "user"

export type User = {
    id: string
    name: string
    username: string
    role: UserRole
    photo: string
    password: string
}

export const userKeys: (keyof User)[] = [
    "name",
    "username",
    "role",
    "photo",
    "password",
]

export type Activity = {
    id: number
    name: string
}
export const activityKeys: (keyof Activity)[] = ["name"]

export type Activity = {
    id: number
    userId: number
    typeId: number
    name: string
    date: string
    duration: number
    calories: number
    notes: string
}
export const activityKeys: (keyof Activity)[] = [
    "userId",
    "typeId",
    "name",
    "date",
    "duration",
    "calories",
    "notes",
]

export type Friend = {
    userId: number
    friendId: number
}
export const friendKeys: (keyof Friend)[] = [
    "userId",
    "friendId",
]