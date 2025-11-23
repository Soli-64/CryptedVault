
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import { invoke } from "versapy/api";
import { Label } from "@/components/ui/label";

type LoginViewProps = {
    pasw: string
    setPasw: (arg: string) => void
    unlock: (vaultname: string) => void
    create: (vaultname: string) => void
}

export const UnlockView = (props: LoginViewProps) => {


    const [vaultsNames, setVaultsNames] = useState<string[]>([])
    const [selectedVault, setSelectedVault] = useState<string|null>(vaultsNames[0] || null)
    const [newVaultName, setNewVaultName] = useState("")
    const [confirmPasw, setConfirmPasw] = useState("")

    const loadVaultsNames = async () => {
        const names = await invoke<string[]>('get_vaults')
        console.log(names)
        setVaultsNames(names || [])
    }

    const SubmitCreate = () => {
        if (newVaultName.trim().length < 1) return toast("Vault name can't be empty.");
        if (pasw.trim().length < 1) return toast("Password can't be empty.");
        if (pasw.includes(" ")) return toast("Password can't contain spaces");
        if (pasw.trim().length < 8) return toast("Password must be at least 8 characters.");
        if (pasw !== confirmPasw) return toast("Passwords aren't identical.");
        
        create(newVaultName)
    }

    const SubmitUnlock = () => {
        if (!selectedVault) return toast("Select a Vault to open")
        if (pasw.length < 1) return toast("You must enter the password to unlock this Vault.")
        unlock(selectedVault)        
    }

    useEffect(() => {
        setTimeout(() => {
            loadVaultsNames()
        }, 200)
    }, [])

    const {
        pasw,
        setPasw,
        unlock,
        create
    } = props;

    return (
        <div className="absolute top-0 left-0 w-screen h-screen bg-background flex flex-col items-center justify-around">
            <Dialog>
            <div className="w-2/3 h-1/2 flex flex-col items-center">
                <div className="h-1/2 w-full flex items-center gap-4 justify-center overflow-x">
                    {
                        vaultsNames.map((v,i) => (
                            <div key={i} onClick={() => setSelectedVault(v)} className="pl-1 border-primary border-4 aspect-square w-[10vw] rounded-full flex flex-row items-center justify-center">
                                {v}
                            </div>
                        ))
                    }
                        <DialogTrigger asChild>
                            <div onClick={() => setPasw("")} className="pl-1 border-primary border aspect-square w-[5vw] rounded-full flex flex-row items-center justify-center">
                                <p className="text-3xl">+</p>
                            </div>
                        </DialogTrigger>
                </div>
                <div className="w-1/3 h-1/2 flex flex-col items-center justify-around pb-8">
                    <p>{selectedVault}</p>
                    <Input className="bg-input" type="password" value={pasw} onChange={(e) => setPasw(e.target.value)} />
                    <div className=" w-5/6">
                        <Button onClick={() => SubmitUnlock()} className="w-full">Unlock</Button>
                    </div>
                </div>
            </div>
                            
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Vault</DialogTitle>
                    <DialogDescription>
                    Create a new Password Encrypted Vault.
                    Make sure your password is strong enough.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input value={newVaultName} onChange={e => setNewVaultName(e.target.value)} id="name-1" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="pasw">Password</Label>
                        <Input value={pasw} onChange={e => setPasw(e.target.value)} type="password" id="pasw"/>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="c-pasw">Confirm Password</Label>
                        <Input value={confirmPasw} onChange={e => setConfirmPasw(e.target.value)} type="password" id="c-pasw"/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => SubmitCreate()}>Create and Open</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
            <div className="absolute right-10 top-10">
                <ModeToggle />
            </div>
        </div>
    )

}
