
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { createSharedValue, invoke } from "versapy/api";
import { UnlockView } from "./views/UnlockView";

const useStoredData = (condition: boolean) => {
    const [data, setData] = useState<string>("")
    const [_, setShared] = condition ? createSharedValue("decrypted_data", setData) : ["", () => {}]
    return [data, (e: string) => {
        if (!condition) return;
        setShared(e)
    }] as const
}

enum State {LOADING,DECONNECTED,CONNECTED}

const HomeView = () => {

    const [logged, setLogged] = useState<State>(State.LOADING)
    const [data, setData] = useStoredData(logged===State.CONNECTED)
    const [password, setPassword] = useState<string>("")

    const checkLog = async () => {
        const r = await invoke<boolean>("connected")
        console.log(r)
        setLogged(r ? State.CONNECTED : State.DECONNECTED)
    }

    useEffect(() => {
        checkLog()
    }, [])

    const create = async (vault_name: string) => {
        const r = await invoke<boolean>("create_vault", {vault_name, pasw: password})
        setLogged(r ? State.CONNECTED : State.DECONNECTED)
    }

    const unlock = async (vault_name: string) => {
        const r = await invoke<boolean>("unlock_vault", {vault_name, pasw: password})
        console.log(r)
        setLogged(r ? State.CONNECTED : State.DECONNECTED)
    }

    return (
        <div>
            {
                logged === State.LOADING &&
                <div className="w-screen h-screen bg-background absolute top-0 left-0 flex flex-col items-center justify-center">
                    <p>Loading...</p>
                </div>
            }
            {
                logged === State.DECONNECTED &&
                <UnlockView 
                    pasw={password}
                    setPasw={setPassword}
                    unlock={(_) => unlock(_)}
                    create={(_) => create(_)}
                />
            }
            <SidebarTrigger />
        </div>
    )

} 

export default HomeView;