import os
import time
from typing import Dict
import jwt
from passlib.hash import bcrypt

_secret = os.getenv("JWT_SECRET")

def get_hashed_password(password: str) -> str:
    return bcrypt.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return bcrypt.verify(password, hashed_pass)

def sign_jwt(userid: str) -> Dict[str, str]:
    payload = {
        "userid": userid,
        "expires": int(time.time() + 3600)
    }
    token = jwt.encode(payload, _secret, algorithm="HS512")
    payload["token"] = token
    return payload

def decode_jwt(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= int(time.time()) else None
    except:
        return None