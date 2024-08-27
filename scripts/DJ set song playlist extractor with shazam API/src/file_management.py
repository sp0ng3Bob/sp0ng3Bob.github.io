import os
from pathlib import Path

import soundfile as sf

import globals


def find_last_segment():
    existing_files = sorted(Path(globals.BASE_FOLDER).glob(
        "segment_*_*_shazam_*_(*s segments).wav"
    ))

    if not existing_files:
        return (0, None, None), None

    last_file = existing_files[-1]
    splitted = last_file.stem.split("_")
    last_index = int(splitted[1]) + 1
    last_filename = splitted[4]
    segment_duration = int(splitted[5][1:-11])

    shazam_results = {}
    for file in existing_files:
        splitted = file.stem.split("_")
        i = int(splitted[1])
        shazam_id = splitted[4]
        shazam_results[i] = (last_filename, i * segment_duration)

    globals.log(f"Last segment found: {last_file.name}")

    return (last_index, segment_duration, last_filename), shazam_results


def save_segment(segment, index, sr):
    segment_filename = globals.BASE_FOLDER / f"segment_{index}.wav"
    sf.write(segment_filename, segment, sr)
    globals.log(f"Saved segment {index} as {segment_filename}")
    return segment_filename


def cleanup_segment(segment_filename):
    try:
        os.remove(segment_filename)
        globals.log(f"Deleted file: {segment_filename}")
    except OSError as e:
        globals.log(
            f"Error deleting file: {segment_filename} - {e}",
            level="ERROR"
        )