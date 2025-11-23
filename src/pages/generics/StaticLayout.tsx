import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const StaticLayout = () => {

    return (
        <div
        className="w-full h-screen flex flex-row overflow-hidden"
        >
            <SidebarProvider>
                <AppSidebar />
                <Outlet/>
            </SidebarProvider>

        </div>
    )

}

export default StaticLayout;