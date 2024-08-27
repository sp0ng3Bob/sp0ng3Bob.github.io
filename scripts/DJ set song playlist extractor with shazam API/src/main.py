import base64
import os
import itertools
from pathlib import Path

import librosa
import numpy as np
import requests
import soundfile as sf

from youtube_audio import download_youtube_audio
from utils import generate_youtube_timestamps, safe_filename, calculate_segment_time
import globals
from file_management import find_last_segment
from audio_processing import segment_audio
from shazam_identification import identify_segment


def check_shazam_ids(shazam_id, previous_shazam_id, shazam_results, i, segment, sr):
    if shazam_id != previous_shazam_id:
        shazam_results[i] = (shazam_id, i * globals.TOTAL_SEGMENT_DURATION)
        
        title = safe_filename(shazam_id)
        unique_segment_filename = os.path.join(
            globals.BASE_FOLDER,
            f"segment_{i}_{calculate_segment_time(i)}_shazam_{title}_"
            f"({globals.TOTAL_SEGMENT_DURATION}s segments).wav"
        )
        sf.write(unique_segment_filename, segment, sr)
        
        print(f"Segment {i} (Shazam ID: {shazam_id}) saved as {unique_segment_filename}.")
    else:
        print(f"Segment {i} skipped due to duplicate ID.")


def process_audio(input_source, is_youtube=False, shazam_results_from_before={}):
    shazam_results = shazam_results_from_before

    if is_youtube:
        mp3_file = download_youtube_audio(input_source)
    else:
        mp3_file = input_source
    
    print("Loading mp3 ... ", end="")
    y, sr = librosa.load(mp3_file, sr=44100, mono=True)
    print("DONE.")
    
    analysis_duration = 5.0
    total_segment_samples = int(globals.TOTAL_SEGMENT_DURATION * sr)
    analysis_samples = int(analysis_duration * sr)
    
    print("Starting to segment audio ... ")
    segments = segment_audio(y, sr)
    print("DONE.")
    print(f"Audio segmented into {len(segments)} parts.")

    previous_shazam_id = globals.LAST_SHAZAM_ID

    try:
        for i, segment in zip(itertools.count(start=globals.START_FROM), segments):
            segment_filename = os.path.join(globals.BASE_FOLDER, f"temp_segment_{i}.wav")
            sf.write(segment_filename, segment, sr)
            
            try:
                if globals.API in ["yourdevmail", "dashydata"]:
                    print(f"Identifying segment {i} with Shazam")
                    result = identify_segment(segment, sr)
                    
                    if result and "track" in result and "share" in result["track"]:
                        shazam_id = result["track"]["share"]["text"]
                        check_shazam_ids(shazam_id, previous_shazam_id, shazam_results, i, segment, sr)
                        previous_shazam_id = shazam_id
                    else:
                        print(f"Shazam returned this for segment {i}: {result}")
                
                elif globals.API == "eipiai":
                    print(f"Identifying segment {i} with Shazam")
                    result = identify_segment(segment, sr)
                    
                    if result and "data" in result:
                        shazam_id = f"{result['data']['title']} by {result['data']['artist']}"
                        check_shazam_ids(shazam_id, previous_shazam_id, shazam_results, i, segment, sr)
                        previous_shazam_id = shazam_id
                    else:
                        print(f"Shazam returned this for segment {i}: {result}")
                
                else:  # apidojo
                    pcm_data = convert_to_raw_pcm(segment, sr)
                    pcm_data_base64 = base64.b64encode(pcm_data).decode("utf-8")
                    
                    print(f"Identifying segment {i} with Shazam")
                    result = identify_segment(pcm_data_base64, sr)
                    
                    if result and "track" in result and "share" in result["track"]:
                        shazam_id = result["track"]["share"]["text"]
                        check_shazam_ids(shazam_id, previous_shazam_id, shazam_results, i, segment, sr)
                        previous_shazam_id = shazam_id
                    else:
                        print(f"Shazam returned this for segment {i}: {result}")
            
            except requests.exceptions.RequestException as e:
                print(f"Error identifying segment {i}: {e}")
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        for tmpwav in sorted(Path(globals.BASE_FOLDER).glob("temp_segment*")):
            os.remove(tmpwav)

    if globals.GENERATE_YOUTUBE_TIMESTAMP and shazam_results:
        youtube_timestamps = generate_youtube_timestamps(shazam_results)
        print("\nYouTube Timestamp Comments:")
        print(youtube_timestamps)
        with open(os.path.join(globals.BASE_FOLDER, "Playlist.txt"), "w+") as f:
            f.write(youtube_timestamps)


if __name__ == "__main__":
    input_source, is_youtube = globals.get_user_input()
    tuple_for_globals, shazam_results = find_last_segment()
    globals.resume(*tuple_for_globals)

    args = [input_source, is_youtube]
    if shazam_results:
        args.append(shazam_results)

    process_audio(*args)