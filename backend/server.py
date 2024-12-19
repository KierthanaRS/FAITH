import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from starlette.requests import Request
from routers.chats.router import router as chats_router
from routers.bots.router import router as bots_router
from routers.analytics_router import router as analytics_router
from routers.test_model.router import router as test_model_router

app = FastAPI()

PROD = os.getenv("ENVIRONMENT") == "production"
# Middleware to force HTTPS
class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable[[Request], Response]):
        if not request.url.scheme == "https":
            url = f"https://{request.headers['host']}{request.url.path}"
            return RedirectResponse(url)
        return await call_next(request)

# Add the middleware to the app
if PROD:
    app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    # allow_credentials=True 
)

# app.include_router(user_router, prefix="/api/v1/users")
# app.include_router(test_data_router, prefix="/api/v1/test-data")


app.include_router(chats_router, prefix="/api/v1/chats")
app.include_router(bots_router, prefix="/api/v1/bots")
app.include_router(test_model_router, prefix="/api/v1/test-model")
app.include_router(analytics_router, prefix="/api/v1/analytics")
