import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DataManager } from "@/services/data"
import type { VaultData } from "@/types/data.type"
import { useEffect, useState } from "react"
import { LoginsView } from "./LoginsView"

const manager = new DataManager()

type UnlockedViewProps = {
    vaultName: string
    lock: () => void
    // firstConnect: boolean
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
    const [viewFocus, setViewFocus] = useState<ViewFocus>(ViewFocus.LOGINS)

    useEffect(() => {
        console.log("Componet mounted, creating SV...")
        manager.create_sv(setData)
    }, [])

    const {
        logins, notes,
        tags
    } = data;

    return (
        <SidebarProvider>
            <AppSidebar setFocus={setViewFocus} vaultName={vaultName} onLock={lock} />
            <div className="w-full h-full">
                <SidebarTrigger />
                {
                    viewFocus === ViewFocus.DASH &&
                    <div>Dashboard View</div>
                }
                {
                    viewFocus === ViewFocus.LOGINS &&
                    <LoginsView logins={logins} manager={manager} />
                }
                {
                    viewFocus === ViewFocus.NOTES &&
                    <div>Notes View - notes
                        <button onClick={() => console.log(data.notes)}>Notes</button>
                    </div>
                }
                {
                    viewFocus === ViewFocus.TAGS &&
                    <div>Tags View - tags
                        <button onClick={() => console.log(data.tags)}>Tags</button>
                    </div>
                }
            </div>
        </SidebarProvider>
    )
}