import type { DataManager } from "@/services/data"
import type { Login } from "@/types/data.type"

import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type LoginsViewProps = {
    logins: Array<Login>
    manager: DataManager
}

const NewLoginDialog = (props: {create: (_: Partial<Omit<Login, "id">>) => void}) => {
    
    const {create} = props;
    const [service, setService] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [note, setNote] = useState("");
    
    return (
        <Dialog>
            <DialogTrigger>
                <p className="w-full h-auto aspect-square rounded-s-md bg-primary text-black">
                    +
                </p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Login</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <Input value={service} onChange={e => setService(e.target.value)} placeholder="service"></Input>
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email"></Input>
                <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="username"></Input>
                <div className="flex flex-row flex-nowrap gap-4">
                    <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="password"></Input>
                    <Button className="aspect-square">G</Button>
                </div>
                <Input value={note} onChange={e => setNote(e.target.value)} placeholder="notes"></Input>
                <div className="w-full flex flex-row justify-end gap-2 mt-4">
                    <Button onClick={() => create({service,email,username,password,note})} className="w-1/2">Create</Button>
                    <Button className="w-1/2 bg-input text-primary">Cancel</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const LoginsView = (props: LoginsViewProps) => {

    const {logins, manager} = props;

    const newLogin = (props: Partial<Omit<Login, "id">>) => {
        manager.add_login({...props})
    }

    return (

        <div className="w-full h-full flex flex-row mt-[5vh]">
            <div className="p-2 w-[5vw] h-screen flex flex-col gap-2 over">
                <NewLoginDialog create={newLogin} />
                <Button className="w-full h-auto aspect-square rounded-s-md" onClick={() => console.log(logins)}>T</Button>
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <div className="bg-green-400">
                        {
                            logins.map((login) => (
                                <div key={login.id} onClick={() => manager.del_login(login.id)} className="p-2 border-b border-gray-300">
                                    <div className="font-bold">{login.id}</div>
                                </div>
                            ))
                        }
                    </div>
                </ResizablePanel>
                
                <ResizableHandle/>

                <ResizablePanel>
                    <div>
                        View
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
