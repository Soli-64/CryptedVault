
import os, json
from versapy.storage import Model
from cryptography.fernet import Fernet
from versapy import VersaPyApp

from .cryptage import DataManager, wipe

PROOF = "CRYPTEDVAULT-PROOF-2025-OK"

class Vault(Model):
    """
        Base storage Model
    """
    name: str = "base-vault-name"
    encrypted_data: str = "default"
    password_proof: str = ""


class VaultsManager:

    def __init__(self, app: VersaPyApp) -> None:
        self.app = app
        self.current_fernet: Fernet | None = None
        self.current_vault: Vault | None = None
        self._shared_vault = None

    def load_vault_names(self):
        names = []
        for vault in self.app.storage.get_all(Vault):
            names.append(vault.name)
        return names
        
    def create(self, vaultname, pasw):

        if self.load(vaultname, pasw)["success"]:
            wipe(pasw)
            return {"success": False, "error": f"Vault {vaultname} already exists."}

        fernet = DataManager.Fernet(pasw)
        wipe(pasw)
        self.current_fernet = fernet
        vault = Vault(
            self.app, 
            name=vaultname,
            password_proof=DataManager.encrypt(fernet, PROOF),
            encrypted_data=DataManager.encrypt(fernet, "{}")
        )
        self.current_vault = vault
        self.decrypt_data()
        return  {"success": True, "error": None, "data": vault}

    def load(self, vaultname, pasw):
        fernet = DataManager.Fernet(pasw)
        wipe(pasw)  
        for vault in self.app.storage.get_all(Vault):
            if vault.name != vaultname:
                continue
            try:
                if DataManager.decrypt(fernet, vault.password_proof) == PROOF:
                    self.current_fernet = fernet
                    self.current_vault = vault
                    self.decrypt_data()
                    return {"success": True, "error": None, "data": vault}
                else:
                    return {"success": False, "error": "wrong-password", "data": None}
            except Exception:
                pass
            
        return {"success": False, "error": "wrong-vaultname", "data": None}

    def decrypt_data(self) -> str:
        if not self.current_fernet or not self.current_vault:
            return {"success": False, "error": "not logged in", "data": None}
        try:
            data = DataManager.decrypt(self.current_fernet, self.current_vault.encrypted_data)
            try:
                d=json.loads(data)
                print(d)
            except:
                data = '{"logins":[],"notes":[],"tags":[]}'
            print(data)
            self._shared_vault = self.app.SharedValue("decrypted_data", data, lambda _: self.update(data=_))
            wipe(data)
        except:
            self.current_fernet = None
            return {"success": False, "error": "error while decrypting data", "data": None}
    
    def update(self, data=None, vaultname=None):
        if not self.current_fernet or not self.current_vault:
            print("no update")
            wipe(data)
            return {"success": False, "error": "not logged in", "data": None}
        print(data, vaultname)
        if data is not None:
            self.current_vault.update(encrypted_data=DataManager.encrypt(self.current_fernet, data))
            wipe(data)
        if vaultname is not None:
            self.current_vault.update(name=vaultname)

        return {"success": True, "error": None, "data": None}
        
    def delete(self):
        if not self.current_fernet or not self.current_vault:
            return {"success": False, "error": "not logged in", "data": None}
        self.current_vault.delete()
        return {"success": True, "error": None, "data": None}

    def reset(self):
        if self.current_fernet:
            try:
                wipe(self.current_fernet._encryption_key)
                wipe(self.current_fernet._signing_key)
            except:
                pass

        if self._shared_vault:
            junk = "X" * 4096 + os.urandom(1024).decode('latin1', 'ignore')
            # self._shared_vault.set(junk)
            wipe(junk)
            del self._shared_vault
            self._shared_vault = None

        self.current_fernet = None
        self.current_vault = None
        