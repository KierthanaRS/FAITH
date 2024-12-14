from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.user_router import router as user_router
from routers.chats.router import router as chats_router
from routers.analytics_router import router as analytics_router
from routers.test_data_router import router as test_data_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    # allow_credentials=True 
)

app.include_router(user_router, prefix="/api/v1/users")
app.include_router(chats_router, prefix="/api/v1/chats")
app.include_router(analytics_router, prefix="/api/v1/analytics")
app.include_router(test_data_router, prefix="/api/v1/test-data")

print("server running at 8000")