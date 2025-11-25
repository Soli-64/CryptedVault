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

enum ViewFocus {
    DASH,
    LOGINS,
    NOTES,
    TAGS
}

export const UnlockedView = (props: UnlockedViewProps) => {

    const {vaultName, lock} = props
    const [data, setData] = useState<VaultData>({logins: [], notes: [], tags: []})
    const [viewFocus, setViewFocus] = useState<ViewFocus>(ViewFocus.DASH)

    const {
        logins,
        notes,
        tags
    } = data;

    useEffect(() => {
        manager.create_sv(setData)
        return () => manager.clear()
    }, [])

    return (
        <SidebarProvider>
            <AppSidebar vaultName={vaultName} onLock={lock} />
            <div>
                <SidebarTrigger />
            </div>
        </SidebarProvider>
    )
}