import base64
import os
import requests
import soundfile as sf
import subprocess

import globals


def convert_to_raw_pcm(segment, sr):
    segment = librosa.util.normalize(segment)
    pcm_data = (segment * 32767).astype(np.int16)
    return pcm_data.tobytes()

    
def identify_segment(segment, sr):
    temp_filename = os.path.join(globals.BASE_FOLDER, "temp_segment.wav")

    headers = {
        "x-rapidapi-key": globals.API_KEY,
        "x-rapidapi-host": globals.API_HOST
    }

    # Adjust filename and process based on the API choice
    if globals.API == "eipiai":
        sf.write(temp_filename, segment, sr)
        # Convert to mp3 using ffmpeg
        subprocess.run(
            ["ffmpeg", "-y", "-i", temp_filename, temp_filename.replace(".wav", ".mp3")],
            stdout = subprocess.DEVNULL,
            stderr = subprocess.STDOUT
        )
        temp_filename = temp_filename.replace(".wav", ".mp3")

    elif globals.API in ["yourdevmail", "dashydata"]:
        sf.write(temp_filename, segment, sr)

    elif globals.API == "apidojo":
        pcm_data = convert_to_raw_pcm(segment, sr)
        pcm_data_base64 = base64.b64encode(pcm_data).decode("utf-8")
        querystring = {
            "timezone": "Europe/Ljubljana",
            "locale": "en-US"
        }
        headers["Content-Type"] = "text/plain"
        response = requests.post(globals.API_URL, data=pcm_data_base64, headers=headers, params=querystring)
        return handle_response(response)
    
    if globals.API in ["yourdevmail", "dashydata", "eipiai"]:
        file_extension = "mp3" if globals.API == "eipiai" else "wav"
        files = {"file" if globals.API != "yourdevmail" else "audio": 
                 (f"temp_segment.{file_extension}", open(temp_filename, "rb"), "application/octet-stream")}
        response = requests.post(globals.API_URL, files=files, headers=headers)
        return handle_response(response)


def handle_response(response):
    if response.status_code == 200:
        globals.log("Shazam identified the segment successfully.")
        return response.json()
    else:
        globals.log(
            f"Shazam API returned an error: {response.status_code}, {response.json()}",
            level="ERROR"
        )
        return None