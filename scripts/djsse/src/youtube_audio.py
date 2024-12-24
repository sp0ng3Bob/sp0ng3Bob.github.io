import os

from moviepy.editor import AudioFileClip
import yt_dlp

import globals


# https://stackoverflow.com/questions/71326109/how-to-hide-error-message-from-youtube-dl-yt-dlp
def download_youtube_audio(youtube_url):
    ydl_opts = {
        "format": "bestaudio/best",
        "ignoreerrors": True,
        "abort_on_unavailable_fragments": True,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "128",
        }],
        "outtmpl": globals.BASE_FOLDER + "/%(title)s.%(ext)s",
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(youtube_url, download=True)
        youtube_download_name = ydl.prepare_filename(info_dict)
        return os.path.splitext(youtube_download_name)[0] + ".mp3"