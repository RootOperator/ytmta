import os
import asyncio
import websockets


async def open(websocket):
    async for message in websocket:
        os.system(f"am start -a android.intent.action.VIEW -d \"{message}\"")
        await websocket.close()


async def main():
    async with websockets.serve(open, port=9876):
        await asyncio.Future()

asyncio.run(main())
