import type { DataManager } from "@/services/data"
import type { Note } from "@/types/data.type"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useState } from "react"

type NotesViewProps = {
    notes: Array<Note>
    manager: DataManager
}

const NewNoteDialog = (props: {create: (_: Omit<Note, 'id'>) => void}) => {
    const {create} = props;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <Dialog>
            <DialogTrigger>
                <p className="w-full aspect-square h-auto text-2xl bg-primary rounded-md text-background flex items-center justify-center">+</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Note</DialogTitle>
                    <DialogDescription>
                        Create a new secure note.
                    </DialogDescription>
                </DialogHeader>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"></Input>
                <Input value={content} onChange={e => setContent(e.target.value)} placeholder="Content"></Input>
                <div className="w-full flex flex-row justify-end gap-2 mt-4">
                    <Button onClick={() => create({title, content})} className="w-1/2">Create</Button>
                    <DialogClose asChild>
                        <Button className="w-1/2 bg-input text-primary">Cancel</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const NotesView = (props: NotesViewProps) => {

    const [focusedNote, setFocusedNote] = useState<Note | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const {notes, manager} = props;

    const newNote = (props: Omit<Note, 'id'>) => {
        manager.add_note({...props})
    }

    return (
        <div className="w-full h-full flex flex-row mt-[5vh]">
            <div className="p-2 w-[5vw] h-screen flex flex-col gap-2">
                <NewNoteDialog create={newNote} />
                <Button className="w-full h-auto aspect-square rounded-s-md" onClick={() => console.log(notes)}>T</Button>
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <div className="flex flex-col gap-2 px-2 border-none">
                        <div className="w-full pt-2">
                            <Input className="bg-input h-[7vh]" placeholder="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}></Input>
                        </div>
                        {
                            notes.filter(n => n.title ? n.title.toLowerCase().includes(searchTerm.toLowerCase()) : false).map((note) => (
                                <div key={note.id} onClick={() => setFocusedNote(note)} className="p-2 border border-gray-300 bg-sidebar">
                                    <div className="font-bold">{note.title}</div>
                                    <p className="truncate">{note.content}</p>
                                </div>
                            ))
                        }
                    </div>
                </ResizablePanel>

                <ResizableHandle/>

                <ResizablePanel>
                    <div>
                        {focusedNote &&
                            <div className="p-4">
                                <h2 className="text-2xl font-bold mb-4">Note Details</h2>
                                <p><strong>Title:</strong> {focusedNote.title}</p>
                                <p className="whitespace-pre-wrap"><strong>Content:</strong> {focusedNote.content}</p>
                                <div className="flex gap-2 mt-4">
                                    <Button onClick={() => { manager.del_note(focusedNote.id); setFocusedNote(null); }}>Delete</Button>
                                </div>
                            </div>
                        }
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default NotesView
