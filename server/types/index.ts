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