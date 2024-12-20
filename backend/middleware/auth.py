import os
import jwt
import time
from typing import Dict, Optional
from dotenv import load_dotenv
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from routers.auth.handler.auth_handler import decode_jwt, verify_jwt

load_dotenv()

_secret = os.getenv("JWT_SECRET")

class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if not (request.url.path.startswith("/docs") or request.url.path.startswith("/openapi.json") or request.url.path.startswith("/api/v1/auth")):
            token: Optional[str] = request.cookies.get("token")
            if token is None:
                response = await call_next(request)
                return response

            try:
                payload = jwt.decode(token, _secret, algorithms=["HS512"])
                request.state.user = payload
            except jwt.ExpiredSignatureError:
                raise HTTPException(status_code=401, detail="JWT token has expired")
            except jwt.PyJWTError:
                raise HTTPException(status_code=401, detail="JWT token is invalid")

            response = await call_next(request)
            return response

        response = await call_next(request)
        return response