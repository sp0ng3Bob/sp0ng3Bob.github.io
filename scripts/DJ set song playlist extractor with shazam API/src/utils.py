import datetime
import re
from urllib.parse import parse_qs, urlparse

import globals


def is_youtube_video_url(url):
    # Define regular expressions for various YouTube video URL formats
    regex_patterns = [
        re.compile(r'https://www\.youtube\.com/watch\?v=[\w-]{11}'),  # Standard URL
        re.compile(r'https://youtu\.be/[\w-]{11}'),  # Short URL
        re.compile(r'https://www\.youtube\.com/embed/[\w-]{11}'),  # Embed URL
    ]
    
    # Parse the URL
    parsed_url = urlparse(url)
    
    # Check if the domain is YouTube
    if parsed_url.netloc not in ['www.youtube.com', 'youtu.be']:
        return False
    
    # Check URL against all defined patterns
    for pattern in regex_patterns:
        if pattern.fullmatch(url):
            return True
    
    # Check for standard URL parameters if the URL is from youtube.com
    if parsed_url.netloc == 'www.youtube.com':
        query_params = parse_qs(parsed_url.query)
        if 'v' in query_params and len(query_params['v'][0]) == 11:
            return True

    return False


def generate_youtube_timestamps(shazam_results):
    timestamps = []
    for segment_id, (shazam_id, timestamp_seconds) in shazam_results.items():
        hours = timestamp_seconds // 3600
        minutes = (timestamp_seconds % 3600) // 60
        seconds = timestamp_seconds % 60
        timestamp = f"\"{hours:02d}:{minutes:02d}:{seconds:02d}\""
        timestamps.append(f"{timestamp} - {shazam_id}")
    return "\n".join(timestamps)


def calculate_segment_time(segment_id):
    s = segment_id * globals.TOTAL_SEGMENT_DURATION
    return str(datetime.timedelta(seconds=s)).replace(":", "h", 1).replace(":", "m", 1) + "s"


def safe_filename(filename):
    return filename.translate(str.maketrans("", "", "*\\/:?<>|"))