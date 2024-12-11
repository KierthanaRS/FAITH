from fastapi import FastAPI
from backend.routers.user_router import router as user_router
from backend.routers.chats_router import router as chats_router
from backend.routers.analytics_router import router as analytics_router
from backend.routers.test_data_router import router as test_data_router

app = FastAPI()

app.include_router(user_router, prefix="/api/v1/users")
app.include_router(chats_router, prefix="/api/v1/chats")
app.include_router(analytics_router, prefix="/api/v1/analytics")
app.include_router(test_data_router, prefix="/api/v1/test-data")
