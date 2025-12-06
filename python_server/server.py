import asyncio, json, os
import websockets
from vosk import Model, KaldiRecognizer

def _default_model_path():
    base = os.path.dirname(os.path.dirname(__file__))  # repo root
    return os.path.join(base, "voicemodels", "vosk-model-en-us-0.22")

MODEL_PATH = os.environ.get("VOSK_MODEL", _default_model_path())
DEFAULT_SR = int(os.environ.get("SAMPLE_RATE", "16000"))

model = None  # set in main()


async def handler(ws):
    """WebSocket per-connection handler."""
    rec = KaldiRecognizer(model, DEFAULT_SR)
    rec.SetWords(True)

    try:
        async for msg in ws:
            if isinstance(msg, bytes):
                # Audio frames (PCM16LE)
                if rec.AcceptWaveform(msg):
                    await ws.send(rec.Result())        # {"text": "..."}
                else:
                    await ws.send(rec.PartialResult()) # {"partial": "..."}
            else:
                # Control messages
                try:
                    data = json.loads(msg)
                except Exception:
                    continue

                if data.get("type") == "start":
                    sr = int(data.get("sampleRate", DEFAULT_SR))
                    rec = KaldiRecognizer(model, sr)
                    rec.SetWords(True)

                elif data.get("type") == "stop":
                    # Flush any pending final and close nicely
                    try:
                        await ws.send(rec.FinalResult())
                    except Exception:
                        pass
                    await ws.close(code=1000, reason="client stop")
                    return

    except asyncio.CancelledError:
        # Server is shutting down (Ctrl+C) — just exit quietly
        return
    except websockets.exceptions.ConnectionClosedOK as e:
        # Normal client close
        print(f"[ws] client closed: {e.code} {e.reason}")
    except websockets.exceptions.ConnectionClosedError as e:
        # Treat abrupt client disconnects as benign
        if e.code in (1005, 1006):
            print(f"[ws] client disconnected: {e.code} {e.reason}")
        else:
            print(f"[ws] connection closed with error: {e.code} {e.reason}")
    except Exception as e:
        print("[ws] unexpected error:", e)


async def main():
    global model
    print(f"[vosk] loading model: {MODEL_PATH}")
    model = Model(MODEL_PATH)

    port = int(os.environ.get("PORT", "8765"))
    # Using async context manager ensures the server closes cleanly on exit
    async with websockets.serve(handler, "0.0.0.0", port, max_size=None):
        print(f"[vosk] WS listening on ws://0.0.0.0:{port} (Ctrl+C to stop)")
        # Wait forever; KeyboardInterrupt will exit asyncio.run below
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        # Clean, readable shutdown line instead of a traceback
        print("\n[ws] server stopped by user (Ctrl+C).")
