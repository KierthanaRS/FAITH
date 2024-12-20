import os
import time
from typing import Dict
import jwt
from passlib.hash import bcrypt
from dotenv import load_dotenv
load_dotenv()

_secret = os.getenv("JWT_SECRET")

class JwtPayload:
    userid: str
    expires: int
    def __init__(self, userid: str, expires: int):
        self.userid = userid
        self.expires = expires

def get_hashed_password(password: str) -> str:
    return bcrypt.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return bcrypt.verify(password, hashed_pass)


def sign_jwt(userid: str) -> Dict[str, str]:
    payload = JwtPayload(userid, int(time.time() + 3600))
    token = jwt.encode(payload.__dict__, _secret, algorithm="HS512")
    return token

def decode_jwt(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, _secret, algorithms=["HS512"])
        return decoded_token if decoded_token["expires"] >= int(time.time()) else None
    except Exception as e:
        print(e)
        return None


def verify_jwt(token: str) -> bool:
    if decode_jwt(token):
        return True
    return False