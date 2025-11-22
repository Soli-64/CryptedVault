
import { useState } from "react";
import { invoke, createSharedValue } from "versapy/api";


const HomeView = () => {

    const [password, setPassword] = useState<string>("")
    const [data, setData] = useState<string>("")
    const [username, setUsername] = useState<string>("")

    const createUser = async () => {
        const r = await invoke("create_user", {username, pasw: password})
        console.log(r)
    }

    return (
        <div className="">
            HomeView
            <div className="flex flex-col">
                <input type="text" value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                <input type="text" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <input type="text" value={data} placeholder="data" onChange={(e) => setData(e.target.value)} />
            </div>
            <button onClick={() => createUser()}>Create</button>
        </div>
    )

} 

export default HomeView;