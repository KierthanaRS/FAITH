from fastapi import APIRouter, HTTPException, Response
from configs.database import db
from models.auth import SignInRequest, SignUpRequest
from routers.auth.handler.auth_handler import get_hashed_password, verify_password
from routers.auth.handler.auth_handler import sign_jwt, decode_jwt
import os
from typing import List

router = APIRouter()


@router.post("/sign_up")
async def sign_up(payload: SignUpRequest):
    try:
        user = await db["User"].find_one({"username": payload.username})
        if user:
            raise HTTPException(status_code=409, detail={"status": "failed", "message": "User already exists"})
        password = get_hashed_password(payload.password)
        data = SignUpRequest(username=payload.username, email=payload.email, password=password, avatar=payload.avatar)
        await db["User"].insert_one(data.__dict__)
        return {"status": "success", "message": "User successfully created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"status": "failed", "message": f"Error while creating user {e}"})

@router.post("/sign_in")
async def sign_in(payload: SignInRequest, response: Response):
    try:
        user = await db["User"].find_one({"username": payload.username})
        if not user:
            raise HTTPException(status_code=404, detail={"status": "failed", "message": "User does not exist on the system"})
        valid_password = verify_password(payload.password, user.get("password"))
        if not valid_password:
            raise HTTPException(status_code=403, detail={"status": "failed", "message": "Username or password does not match"})
        payload = sign_jwt(str(user.get("_id")))
        response.set_cookie(key="token", value=payload[0], samesite="none", expires=payload[1], httponly=True, secure=True)
        return {"status": "success", "message": "Authentication successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"status": "failed", "message": f"Error while signing in {e}"})
