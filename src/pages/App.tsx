
import { useEffect, useState } from "react";
import { invoke } from "versapy/api";
import { UnlockedView } from "./views/UnlockedView";
import { LockedView } from "./views/LockedView";

enum State {LOADING,DECONNECTED,CONNECTED}

const App = () => {

    const [logged, setLogged] = useState<State>(State.LOADING)
    const [password, setPassword] = useState<string>("")
    const [vaultName, setVaultName] = useState<string>("")
    
    const checkLog = async () => {
        const r = await invoke<boolean>("connected")
        // TODO: GET ACTUAL VAULT NAME and setVaultName it
        setLogged(r ? State.CONNECTED : State.DECONNECTED)
    }

    useEffect(() => {
        checkLog()
    }, [])

    const create = async (vault_name: string) => {
        const r = await invoke<boolean>("create_vault", {vault_name, pasw: password})
        setLogged(r ? State.CONNECTED : State.DECONNECTED)
        setVaultName(vault_name)
        setPassword("")
    }

    const unlock = async (vault_name: string) => {
        const r = await invoke<boolean>("unlock_vault", {vault_name, pasw: password})
        setLogged(r ? State.CONNECTED : State.DECONNECTED)
        setVaultName(vault_name)
        setPassword("")
    }

    const lock = async () => {
        await invoke<boolean>("lock_vault")
        setLogged(State.DECONNECTED)
        localStorage.clear()
        sessionStorage.clear()
        document.cookie.split(';').forEach(c => {
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970;path=/')
        })

        if ('caches' in window) caches.keys().then(names => names.forEach(n => caches.delete(n)))
        if ('indexedDB' in window) indexedDB.databases?.().then(dbs => dbs.forEach(db => indexedDB.deleteDatabase(db.name!)))
    } 

    return (
        <div className="w-full h-full">
            {
                logged === State.LOADING &&
                <div className="w-screen h-screen bg-background absolute top-0 left-0 flex flex-col items-center justify-center">
                    <p>Loading...</p>
                </div>
            }
            {
                logged === State.DECONNECTED &&
                <LockedView 
                    pasw={password}
                    setPasw={setPassword}
                    unlock={(_) => unlock(_)}
                    create={(_) => create(_)}
                />
            }
            {
                logged === State.CONNECTED &&
                <UnlockedView vaultName={vaultName} lock={lock} />
            }
        </div>
    )

} 

export default App;