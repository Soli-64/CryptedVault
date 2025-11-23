
export type Tag = {
    id: number
    ref: string
}

export type Login = {
    id: number
    service?: string
    username?: string
    email?: string
    password?: string
    note?: string
    tags?: Tag[]
}

export type Note = {
    id: number
    title: string
    tags?: Tag[]
    content?: string
}

export type VaultData = {

    logins: Login[]
    notes: Note[]
    tags: Tag[]

}
