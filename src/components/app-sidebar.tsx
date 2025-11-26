import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { FileText, House, LockKeyhole, Tag } from "lucide-react"
   
enum ViewFocus {
    DASH,
    LOGINS,
    NOTES,
    TAGS
}

type AppSidebarProps = {
    onLock: () => void
    vaultName: string
    setFocus: (_: ViewFocus) => void
}

const items = [
    {name: "Dashboard", focus: ViewFocus.DASH, icon: House},
    {name: "Logins", focus: ViewFocus.LOGINS, icon: LockKeyhole},
    {name: "Notes", focus: ViewFocus.NOTES, icon: FileText},
    {name: "Tags", focus: ViewFocus.TAGS, icon: Tag},
]

export function AppSidebar(props: AppSidebarProps) {

    const {onLock, vaultName, setFocus} = props

    return (
        <Sidebar>
        
            <SidebarHeader>{vaultName}</SidebarHeader>

            <SidebarContent>
                <SidebarGroup />
                    <SidebarGroupLabel>Data</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <button onClick={() => setFocus(item.focus)}> <item.icon /> {item.name}</button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>
            
            <SidebarFooter> 
                <Button onClick={() => onLock()}>Log Out</Button>
            </SidebarFooter>
        
        </Sidebar>
    )
}