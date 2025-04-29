import uvicorn
from src.routers import actions_router
from fastapi import FastAPI
from langchain_core.globals import set_verbose, set_debug
set_verbose(False)
set_debug(False)


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(actions_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
