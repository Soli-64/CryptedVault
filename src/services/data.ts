import type { Login, Note, Tag, VaultData } from "@/types/data.type";
import { toast } from "sonner";
import { createSharedValue } from "versapy/api";


const genid = () => Math.floor(Date.now()*Math.random())

export class DataManager {

    jsonData: string | null;
    data: VaultData;
    setJsonData: (arg: string) => void;
    uiUpdate: (_: VaultData) => void;

    constructor() {
        this.jsonData = "";
        this.setJsonData = () => {}
        this.data = {logins: [], notes: [], tags: []};
        this.uiUpdate = () => {}
        // [this.jsonData, this.setJsonData] = createSharedValue<string>("decrypted_data", (_) => {this.jsonData = _;this.data=JSON.parse(_)} )
    }

    parsed_data(): VaultData {
        if (!this.jsonData) return {logins: [], notes: [], tags: []}
        try {
            return JSON.parse(this.jsonData)
        } catch (e) {
            console.error("Error parsing data: ", e)
            console.log(this.jsonData)
            return {logins: [], notes: [], tags: []}
        }
    }

    create_sv(cb: (_: VaultData) => void) {
        this.uiUpdate = cb;
        [this.jsonData, this.setJsonData] = createSharedValue<string>("decrypted_data", (_) => {this.jsonData = _;this.data=JSON.parse(_);this.uiUpdate(JSON.parse(_))} )
    }

    json_data() {
        console.log("Settings in db: ", this.data)
        return JSON.stringify(this.data) 
    }

    update_db() {
        this.uiUpdate(this.data)
        this.setJsonData(this.json_data())
    }

    // NOTES

    add_note(props: Omit<Note, 'id'>) {
        let check = this.data.notes.filter(n => n.title === props.title)
        if (check.length > 0) return toast("Can't create 2 notes with the same name.")
        const note: Note = {
            id: genid(),
            ...props
        }
        this.data.notes.push(note)
        this.update_db()
    }

    update_note(id: number, updates: Partial<Omit<Note, 'id'>>) {
        this.data.notes.map(n => {
            n.id === id ? {...n, ...updates} : {...n}
        })
        this.update_db()
    }

    del_note(id: number) {
        this.data.notes = this.data.notes.filter(n => n.id !== id)
        this.update_db()
    }

    // LOGINS

    add_login(props: Omit<Login, "id">) {
        const login: Login = {
            id: genid(),
            ...props
        }
        this.data.logins.push(login)
        console.log(this.data.logins)
        this.update_db()
    }

    update_login(id: number, updates: Partial<Omit<Login, 'id'>>) {
        this.data.logins.map(l => {
            l.id === id ? {...l, ...updates} : {...l}
        })
        this.update_db()
    }

    del_login(id: number) {
        this.data.logins = this.data.logins.filter(l => l.id !== id)
        this.update_db()
    }

    // TAGS

    add_tag(props: Omit<Tag, "id">) {
        const tag: Tag = {
            id: genid(),
            ...props
        }
        this.data.tags.push(tag)
        this.update_db()
    }

    update_tag(id: number, updates: Partial<Omit<Tag, 'id'>>) {
        this.data.tags.map(t => {
            t.id === id ? {...t, ...updates} : {...t}
        })
        this.update_db()
    }

    del_tag(id: number) {
        this.data.tags = this.data.tags.filter(t => t.id !== id)
        this.update_db()
    }

    // GETS

    get_tags(): Tag[] {
        return this.data.tags
    }

    get_notes(tags: Tag[] = []): Note[] {
        let notes = this.data.notes
        for (let tag of tags) {
            notes = notes.filter(n => n.tags?.includes(tag))
        }
        return notes
    }

    get_logins(tags: Tag[] = []): Login[] {
        let logins = this.data.logins
        for (let tag of tags) {
            logins = logins.filter(l => l.tags?.includes(tag))
        }
        return logins
    }

    // clear

    clear() {
        this.data = {logins: [], notes: [], tags: []}
        this.jsonData = ""
        this.setJsonData(JSON.stringify({logins: [], notes: [], tags: []}))
        this.uiUpdate = () => {}
    }

}
