# src-versapy/main.py

from versapy import VersaPyApp
from services.cryptage import wipe
from services.users import UsersManager

app = VersaPyApp()

manager = UsersManager(app)

print(app.storage.path)

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

@app.expose
def get_data():
    return manager.decrypt_data()

@app.expose
def update_data(data):
    manager.update(data=data)

if __name__ == "__main__":
    
    app.run()
    