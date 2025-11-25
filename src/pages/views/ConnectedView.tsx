import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DataManager } from "@/services/data"
import type { VaultData } from "@/types/data.type"
import { useEffect, useState } from "react"

const manager = new DataManager()

type UnlockedViewProps = {
    vaultName: string
    lock: () => void
}

export const UnlockedView = (props: UnlockedViewProps) => {

    const {vaultName, lock} = props
    const [data, setData] = useState<VaultData>({logins: [], notes: [], tags: []})

    useEffect(() => {
        manager.create_sv(setData)
    })

    return (
        <SidebarProvider>
            <AppSidebar vaultName={vaultName} onLock={lock} />
            <div>
                <SidebarTrigger />
                <hr />
                <p>{JSON.stringify(data)}</p>
                <hr />
                <button onClick={() => manager.add_login({service:"amazon.com"})}>
                    New Login
                </button>
                <button onClick={() => manager.del_login(manager.data.logins[0].id)}>
                    Del Login
                </button>
            </div>
        </SidebarProvider>
    )
}