import { Outlet } from "react-router-dom"

const StaticLayout = () => {

    return (
        <div
        className="w-full h-screen flex flex-row overflow-hidden"
        >
            <Outlet/>
        </div>
    )

}

export default StaticLayout;
