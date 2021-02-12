export interface UserDto {
    id: string
    email: string
    passwprd: string
    firstName?: string
    lastName?: string
    permissionLevel?: number
}