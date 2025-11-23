# src-versapy/main.py

from versapy import VersaPyApp
from services.cryptage import wipe
from services.users import UsersManager

app = VersaPyApp()

manager = UsersManager(app)

@app.expose
def create_user(username,pasw):
    r = manager.create(username, pasw)["success"]
    wipe(pasw)
    return r

@app.expose
def log_in(username, pasw):
    log_try = manager.load(username, pasw)
    wipe(pasw)
    return log_try["success"]

@app.expose
def log_out():
    return manager.reset()
    
@app.expose
def delete_user():
    return manager.delete()["success"]

if __name__ == "__main__":
    
    app.run()
    