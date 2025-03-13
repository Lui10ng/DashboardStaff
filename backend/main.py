from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from TTS.api import TTS
import soundfile as sf
import numpy as np
import uvicorn
import os
from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("output"):
    os.makedirs("output", exist_ok=True)

app.mount("/output", StaticFiles(directory="output"), name="output")

tts = TTS(model_name="tts_models/en/ljspeech/vits", progress_bar=False).to(
    "cpu"
)

#ljspeech - default
#tacotron2-DDC - basic model
#vits - noce model
#vctk - model_name="tts_models/en/vctk/vits"
# male - p246 pass this to audio_data: speaker="p246"

@app.get("/")
def home():
    return {"message": "Coqui TTS Server Running"}


@app.post("/synthesize/")
async def synthesize(text: str):
    try:
        audio_filename = f"{uuid4()}.wav"
        filepath = f"output/{audio_filename}"
        
        audio_data = tts.tts(text)
        # sf.write(filepath, np.array(audio_data), samplerate=22050)
        sf.write(filepath, audio_data, samplerate=22050)
        
        return JSONResponse({
            "audio_file": f"output/{audio_filename}"
        })
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    print("succes!")
    print("visit localhost 8000")


# TODO:
# output files should be at 50 max. it should delete the oldest file when a new one is created
# when files exceed 50. - Harold