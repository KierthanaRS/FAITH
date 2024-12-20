import bson
import os
from configs.database import db
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from routers.auth.router import router as auth_router
from routers.auth.handler.auth_handler import verify_jwt, decode_jwt
from routers.chats.router import router as chats_router
from routers.bots.router import router as bots_router
from routers.analytics_router import router as analytics_router
from routers.test_model.router import router as test_model_router
from middleware.auth import JWTMiddleware

load_dotenv()

app = FastAPI()

_environment = os.getenv("ENVIRONMENT")
_frontend_domain = os.getenv("FRONTEND_URL")

if _environment == "development":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://localhost:3000"],
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=[
            "Access-Control-Allow-Origin",
            "Referer",
            "Set-Cookie",
            "Cookie",
            "Content-Length",
            "Content-Type",
            "Access-Control-Allow-Credentials",
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Methods"
        ],
        allow_credentials=True
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[_frontend_domain],
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=[
            "Access-Control-Allow-Origin",
            "Referer",
            "Set-Cookie",
            "Cookie",
            "Content-Length",
            "Content-Type",
            "Access-Control-Allow-Credentials",
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Methods"
        ],
        expose_headers=["*"],
        allow_credentials=True
    )


app.add_middleware(JWTMiddleware)

app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(chats_router, prefix="/api/v1/chats")
app.include_router(bots_router, prefix="/api/v1/bots")
app.include_router(test_model_router, prefix="/api/v1/test-model")
app.include_router(analytics_router, prefix="/api/v1/analytics")

@app.get("/api/v1/validate_token")
async def validate_token(request: Request) -> JSONResponse:
    if (token := request.cookies.get("token")):
        decoded_token = decode_jwt(token)
        user = await db["User"].find_one({"_id": bson.objectid.ObjectId(decoded_token["userid"])})
        if not user:
            raise HTTPException(status_code=409, detail={"status": "failed", "message": "User not found"})
        return {
            "user": {
                "name": user.get("username"),
                "id": decoded_token["userid"],
                "email": user.get("email"),
                "avatar": user.get("avatar")
            }
        }
        return user