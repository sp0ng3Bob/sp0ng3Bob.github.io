import numpy as np
import librosa

import globals


def load_audio(filename):
    globals.log(f"Loading audio file: {filename}")
    y, sr = librosa.load(filename, sr=44100, mono=True)
    globals.log("Audio loaded successfully")
    return y, sr


def segment_audio(y, sr):
    total_segment_samples = int(globals.TOTAL_SEGMENT_DURATION * sr)
    analysis_samples = 5 * sr

    segments = []
    num_segments = int(np.ceil(len(y) / total_segment_samples))

    globals.log(f"Segmenting audio into {num_segments - globals.START_FROM} parts")

    for i in range(globals.START_FROM, num_segments):
        start_sample = i * total_segment_samples
        end_sample = min(start_sample + analysis_samples, len(y))
        segment = y[start_sample:end_sample]
        segments.append(segment)

    globals.log("Audio segmentation complete")

    return segments