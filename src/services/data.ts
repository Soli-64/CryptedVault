import type { Login, Note, Tag, VaultData } from "@/types/data.type";
import { toast } from "sonner";


export class DataManager {

    jsonData: string;
    data: VaultData;
    setData: (arg: string) => void;

    constructor(data: string, setData: (arg: string) => void) {
        this.jsonData = data; 
        this.data = this.parsed_data()
        this.setData = setData
    }

    parsed_data(): VaultData {
        return JSON.parse(this.jsonData)
    }

    json_data() {
        return JSON.stringify(this.data) 
    }

    update_db() {
        this.setData(this.json_data())
    }

    add_note(title: string) {
        let check = this.data.notes.filter(n => n.title === title)
        if (check.length > 0) return toast("Can't create 2 notes with the same name.")
        const note = {
            id: Date.now()*Math.random(),
            title
        }
        this.data.notes.push(note)
    }

    update_note(id: number, updates: Partial<Omit<Note, 'id'>>) {
        this.data.notes.map(n => {
            n.id === id ? {...n, ...updates} : {...n}
        })
    }

    del_note(id: number) {
        this.data.notes = this.data.notes.filter(n => n.id !== id)
    }

    get_tags() {
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

}