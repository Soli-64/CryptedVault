import { Outlet } from "react-router-dom"
import { NabBar } from "../../components/NavBar";

const StaticLayout = () => {

    return (
        <div
        className="w-full h-screen flex flex-row overflow-hidden"
        >
            <NabBar links={[
                {
                    "name": "Home",
                    "path": "/"
                },
                {
                    "name": "Login",
                    "path": "/login"
                },
            ]} />
            <div 
                style={{
                    paddingLeft: "4vw",
                    overflow: "hidden",
                    height: "100vh"
                }}
                className="overflow-hidden h-screen"
            >
                <Outlet/>
            </div>
        </div>
    )

}

export default StaticLayout;