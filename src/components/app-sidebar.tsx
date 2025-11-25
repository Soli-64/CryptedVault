import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import { Button } from "./ui/button"
   
type AppSidebarProps = {
    onLock: () => void
    vaultName: string
}

export function AppSidebar(props: AppSidebarProps) {

    const {onLock, vaultName} = props

    return (
        <Sidebar>
        
            <SidebarHeader>{vaultName}</SidebarHeader>

            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            
            <SidebarFooter> 
                <Button onClick={() => onLock()}>Log Out</Button>
            </SidebarFooter>
        
        </Sidebar>
    )
}