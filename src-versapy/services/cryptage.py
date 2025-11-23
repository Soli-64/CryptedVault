from cryptography.fernet import Fernet as F
from argon2.low_level import hash_secret_raw, Type
import base64
import os

KEY_S=b"CryptedVault-FIXED-SKEY-32b-2025"
KEY_P=b"CryptedVault-FIXED-PKEY-32b-2025"

def wipe(data: str):
    if isinstance(data, str):
        data = data.encode()
    os.write(1, b'\0' * len(data))

class DataManager:

    @staticmethod
    def pasw_to_key(pasw: str) -> bytes:

        key = hash_secret_raw(
            secret=pasw.encode(),
            salt=KEY_S,
            time_cost=4,
            memory_cost=194560,
            parallelism=4,
            hash_len=32,
            type=Type.ID
        )

        final_key = bytes(a ^ b for a, b in zip(key, KEY_P.ljust(32, b'\0')))
        return base64.urlsafe_b64encode(final_key)

    @staticmethod
    def Fernet(pasw: str):
        key = DataManager.pasw_to_key(pasw)
        wipe(pasw)
        cipher = F(key)
        return cipher

    @staticmethod
    def encrypt(fernet: F, data: str) -> str:
        crypted_data = fernet.encrypt(data.encode())
        wipe(data)
        return crypted_data.decode()

    @staticmethod
    def decrypt(fernet: F, data: str) -> str:
        return fernet.decrypt(data.encode()).decode()