import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from routers.auth.router import router as auth_router
from routers.chats.router import router as chats_router
from routers.bots.router import router as bots_router
from routers.analytics_router import router as analytics_router
from routers.test_model.router import router as test_model_router
from middleware.auth import JWTMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

app.add_middleware(JWTMiddleware)

app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(chats_router, prefix="/api/v1/chats")
app.include_router(bots_router, prefix="/api/v1/bots")
app.include_router(test_model_router, prefix="/api/v1/test-model")
app.include_router(analytics_router, prefix="/api/v1/analytics")
