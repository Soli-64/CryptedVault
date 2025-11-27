import type { DataManager } from "@/services/data"
import type { Login } from "@/types/data.type"

import { Button } from "@/components/ui/button"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
                <p className="w-full aspect-square h-auto text-2xl bg-primary rounded-md text-background flex items-center justify-center">+</p>
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
                    <DialogClose asChild>
                        <Button className="w-1/2 bg-input text-primary">Cancel</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const LoginsView = (props: LoginsViewProps) => {

    const [focusedLogin, setFocusedLogin] = useState<Login | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const {logins, manager} = props;

    const newLogin = (props: Partial<Omit<Login, "id">>) => {
        manager.add_login({...props})
    }

    return (

        <div className="w-full h-full flex flex-row mt-[5vh]">
            <div className="p-2 w-[5vw] h-screen flex flex-col gap-2">
                <NewLoginDialog create={newLogin} />
                <Button className="w-full h-auto aspect-square rounded-s-md" onClick={() => console.log(logins)}>T</Button>
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <div className="flex flex-col gap-2 px-2 border-none">
                        <div className="w-full pt-2">
                            <Input className="bg-input h-[7vh]" placeholder="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}></Input>
                        </div>
                        {
                            logins.filter(login => login.service ? login.service.toLowerCase().includes(searchTerm.toLowerCase()) : false).map((login) => (
                                <div key={login.id} onClick={() => setFocusedLogin(login)} className="p-2 border border-gray-300 bg-sidebar">
                                    <div className="font-bold">Service: {login.service}</div>
                                    <p>@: {login.email}</p>
                                    <p>#: {login.username}</p>
                                </div>
                            ))
                        }
                    </div>
                </ResizablePanel>
                
                <ResizableHandle/>

                <ResizablePanel>
                    <div>
                        {focusedLogin &&
                            <div className="p-4">
                                <h2 className="text-2xl font-bold mb-4">Login Details</h2>
                                <p><strong>Service:</strong> {focusedLogin.service}</p>
                                <p><strong>Email:</strong> {focusedLogin.email}</p>
                                <p><strong>Username:</strong> {focusedLogin.username}</p>
                                <p><strong>Password:</strong> {focusedLogin.password}</p>
                                <p><strong>Notes:</strong> {focusedLogin.note}</p>
                                <Button onClick={() => manager.del_login(focusedLogin.id)}>Delete</Button>
                            </div>
                        }
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
