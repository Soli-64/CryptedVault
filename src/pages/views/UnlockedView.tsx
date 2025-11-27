import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DataManager } from "@/services/data"
import type { VaultData } from "@/types/data.type"
import { useEffect, useState } from "react"
import { LoginsView } from "./DataViews/LoginsView"
import NotesView from "./DataViews/NotesView"

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
        manager.create_sv(setData)
    }, [])

    const {
        logins, 
        notes,
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
                    <NotesView notes={notes} manager={manager} />
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