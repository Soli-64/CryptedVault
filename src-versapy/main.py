# src-versapy/main.py

from versapy import VersaPyApp
from services.cryptage import wipe
from services.vault import VaultsManager

app = VersaPyApp()

manager = VaultsManager(app)

@app.expose
def connected():
    return (manager.current_vault != None)

@app.expose
def get_vaults():
    return manager.load_vault_names()

@app.expose
def create_vault(vault_name,pasw):
    r = manager.create(vault_name, pasw)["success"]
    wipe(pasw)
    return r

@app.expose
def unlock_vault(vault_name, pasw):
    log_try = manager.load(vault_name, pasw)
    wipe(pasw)
    return log_try["success"]

@app.expose
def lock_vault():
    return manager.reset()
    
@app.expose
def delete_user():
    return manager.delete()["success"]

if __name__ == "__main__":
    
    app.run()
    