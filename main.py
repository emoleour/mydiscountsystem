from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from contextlib import asynccontextmanager
from database import engine, Model
from routers.user_router import router
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, "static")

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.create_all)

    print('База данных создана')

    yield

    print('Выключение сервера')



app = FastAPI(lifespan=lifespan)
app.include_router(router)

app.mount('/static', StaticFiles(directory=static_dir), name='static')

@app.get('/')
async def root():
    index_path = os.path.join(static_dir, "index.html")
    if not os.path.exists(index_path):
        return {"error": f"index.html not found at {index_path}"}
    return FileResponse(index_path)


