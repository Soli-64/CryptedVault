
import { useEffect, useState } from "react";
import { invoke, createSharedValue } from "versapy/api";

type Response = {
    success: boolean
    error: null | string
    data: null | string
}

const useStoredData = () => {
    const [data, setData] = useState<string>("")
    const [shared, setShared] = createSharedValue("decrypted_data", setData)
    return [data, setShared] as const
}

const HomeView = () => {

    const [password, setPassword] = useState<string>("")
    const [data, setData] = useStoredData()
    const [username, setUsername] = useState<string>("")
    const [logged, setLogged] = useState<boolean>(false)

    const createUser = async () => {
        const r = await invoke("create_user", {username, pasw: password})
        console.log(r)
    }

    const login = async () => {
        const r = await invoke<boolean>("log_in", {username, pasw: password})
        setLogged(r)
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
            <br />
            <button onClick={() => login()}>Login</button>
        </div>
    )

} 

export default HomeView;