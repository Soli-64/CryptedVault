
from versapy.storage import Model
from cryptography.fernet import Fernet

from .cryptage import DataManager, wipe

PROOF = "CRYPTEDVAULT-PROOF-2025-OK"

class User(Model):
    """
        Base storage Model
    """
    username: str = "default"
    encrypted_data: str = "default"
    password_proof: str = ""


class UsersManager:

    def __init__(self, app) -> None:
        self.app = app
        self.current_fernet: Fernet | None = None
        self.current_user: User | None = None

    def create(self, username, pasw):

        if self.load(username, pasw)["success"]:
            wipe(pasw)
            return {"success": False, "error": "Username already exists"}

        fernet = DataManager.Fernet(pasw)
        wipe(pasw)
        self.current_fernet = fernet
        user = User(
            self.app, 
            username=username,
            password_proof=DataManager.encrypt(fernet, PROOF),
            encrypted_data=DataManager.encrypt(fernet, "{}")
        )
        self.current_user = user
        return  {"success": True, "error": None, "data": user}

    def load(self, username, pasw):
        fernet = DataManager.Fernet(pasw)
        wipe(pasw)  
        for user in self.app.storage.get_all(User):
            if user.username != username:
                continue
            try:
                if DataManager.decrypt(fernet, user.password_proof) == PROOF:
                    self.current_fernet = fernet
                    self.current_user = user
                    return {"success": True, "error": None, "data": user}
            except Exception:
                pass
            return {"success": False, "error": "wrong-password", "data": None}
        return {"success": False, "error": "wrong-username", "data": None}

    def decrypt_data(self) -> str:
        if not self.current_fernet or not self.current_user:
            return {"success": False, "error": "not logged in", "data": None}
        try:
            data = DataManager.decrypt(self.current_fernet, self.current_user.encrypted_data)
            return {"success": True, "error": None, "data": data}
        except:
            self.current_fernet = None
            return {"success": False, "error": "error while decrypting data", "data": None}
    
    def update(self, data=None, username=None):
        if not self.current_fernet or not self.current_user:
            return {"success": False, "error": "not logged in", "data": None}
        
        if data is not None:
            self.current_user.update(encrypted_data=DataManager.encrypt(self.current_fernet, data))
        
        if username is not None:
            self.current_user.update(username=username)

        return {"success": True, "error": None, "data": None}
        
    def delete(self):
        if not self.current_fernet or not self.current_user:
            return {"success": False, "error": "not logged in", "data": None}
        self.current_user.delete()
        return {"success": True, "error": None, "data": None}

    def reset(self):
        self.current_fernet = None
        self.current_user = None
        return True