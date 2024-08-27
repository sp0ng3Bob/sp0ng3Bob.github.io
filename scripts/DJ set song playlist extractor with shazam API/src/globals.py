import os
import argparse
from pathlib import Path
from utils import safe_filename, is_youtube_video_url

# Global variables
DEBUG = False
GENERATE_YOUTUBE_TIMESTAMP = False
API = "dashydata"  # Options: "apidojo", "yourdevmail", "dashydata", "eipiai"
BASE_FOLDER = "output"
TOTAL_SEGMENT_DURATION = 20  # Default segment duration in seconds
START_FROM = 0
LAST_SHAZAM_ID = None

# Your Shazam API key
API_KEY = "cff80c23f6msh0f9ba7502624dfap173fa3jsn24e5bddfbb7e"  # Replace with your Shazam API key
API_URL = ""
API_HOST = ""

hosts = {
    "apidojo": [
        "https://shazam.p.rapidapi.com/songs/v2/detect", 
        "shazam.p.rapidapi.com"
    ],
    "dashydata": [
        "https://shazam-song-recognition-api.p.rapidapi.com/recognize/file", 
        "shazam-song-recognition-api.p.rapidapi.com"
    ],
    "eipiai": [
        "https://music-identify.p.rapidapi.com/identify", 
        "music-identify.p.rapidapi.com"
    ],
    "yourdevmail": [
        "https://shazam-api7.p.rapidapi.com/songs/recognize-song", 
        "shazam-api7.p.rapidapi.com"
    ],
}

args = None

# def initialize_base_folder(input_filename):
#     """If the base folder would take on the name of the input file by default, not used right now."""
#     global BASE_FOLDER
#     BASE_FOLDER = Path(safe_filename(input_filename)).with_suffix("")  # Strips the extension
#     BASE_FOLDER.mkdir(parents=True, exist_ok=True)  # Create folder if it doesn't exist

def log(message, level="INFO"):
    """Logs messages with a given severity level."""
    if DEBUG or level == "ERROR":
        print(f"[{level}] {message}")

def get_user_input():
    """Handles user input and assigns values to global variables."""
    global args, DEBUG, GENERATE_YOUTUBE_TIMESTAMP, API, API_URL, API_HOST, BASE_FOLDER
    
    parser = argparse.ArgumentParser(
        description="Process audio files and identify tracks using Shazam API."
    )
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    parser.add_argument(
        "--generate-timestamp", 
        action="store_true", 
        help="Generate YouTube timestamp playlist"
    )
    parser.add_argument(
        "--api", 
        choices=["apidojo", "yourdevmail", "dashydata", "eipiai"],
        help="Choose the RapidAPI to use: apidojo, yourdevmail, dashydata, eipiai"
    )
    parser.add_argument("--input", type=str, help="YouTube URL or local file path")
    parser.add_argument("--base-folder", type=str, help="Base folder for output files")
    parser.add_argument(
        "--segment-duration", 
        type=int, 
        help="Duration of each segment in seconds (min 5, max 60)"
    )
    
    args = parser.parse_args()

    # Assign arguments to global variables if provided, else prompt interactively
    DEBUG = args.debug or (
        input("Enable debug mode? (y/N): ").strip().lower() == "y"
    )
    GENERATE_YOUTUBE_TIMESTAMP = args.generate_timestamp or (
        input("Generate YouTube timestamp list? (y/N): ").strip().lower() == "y"
    )
    API = args.api or (
        input("Choose RapidAPI to use (apidojo, yourdevmail, dashydata, eipiai) [apidojo]: ").strip() or API
    )
    API_URL = hosts[API][0]
    API_HOST = hosts[API][1]
    input_source = args.input or input("Enter YouTube URL or local file path: ").strip()
    
    input_source = (
        input_source[1:-1] if input_source[0] in ("\"", "\'") else input_source
    )
    is_youtube = is_youtube_video_url(input_source)
    
    BASE_FOLDER = args.base_folder or (
        input("Enter base folder for output files [output]: ").strip() or BASE_FOLDER
    )
    if not os.path.exists(BASE_FOLDER):
        os.makedirs(BASE_FOLDER)
        
    return input_source, is_youtube
    
def resume(start_index, cut_interval, last_shazam):
    """Handles resuming from a specific point based on previous progress."""
    global TOTAL_SEGMENT_DURATION, START_FROM, LAST_SHAZAM_ID
    
    if start_index > 0:
        print("The identification will resume from where it was left before.")
        START_FROM = start_index
        TOTAL_SEGMENT_DURATION = cut_interval
        LAST_SHAZAM_ID = last_shazam
    else:
        TOTAL_SEGMENT_DURATION = (
            args.segment_duration
            if args.segment_duration is not None
            else max(5, min(int(input("Enter segment duration in seconds (5-60) [20]: ").strip() or "20"), 60))
        )

    if DEBUG:
        print("\n")
        print("*******************************************************************")
        print(f"DEBUG: {DEBUG}")
        print(f"GENERATE_YOUTUBE_TIMESTAMP: {GENERATE_YOUTUBE_TIMESTAMP}")
        print(f"RapidAPI: {API}")
        print(f"BASE_FOLDER: {BASE_FOLDER}")
        print(f"TOTAL_SEGMENT_DURATION: {TOTAL_SEGMENT_DURATION} seconds")
        print("*******************************************************************")
    print("\n")
