"""
Extract 64 high-quality WebP frames along the true 360° circular eye & head rotation
trajectory, plus center.webp, from Public/Character.mp4.

Corrected coordinate mapping:
0 deg (RIGHT)       -> frame 65
45 deg (DOWN-RIGHT) -> frame 90
90 deg (DOWN)       -> frame 123
135 deg (DOWN-LEFT) -> frame 152
180 deg (LEFT)      -> frame 182
225 deg (UP-LEFT)   -> frame 205
270 deg (UP)        -> frame 19
315 deg (UP-RIGHT)  -> frame 40
360 deg (RIGHT)     -> frame 65
"""

import os
import sys
import json
import cv2
import numpy as np
from PIL import Image

def smoothstep(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)

def get_source_frame_num(angle_deg):
    d = angle_deg % 360.0
    if 0.0 <= d <= 45.0:
        t = d / 45.0
        return 65.0 + smoothstep(t) * (90.0 - 65.0)
    elif 45.0 < d <= 90.0:
        t = (d - 45.0) / 45.0
        return 90.0 + smoothstep(t) * (123.0 - 90.0)
    elif 90.0 < d <= 135.0:
        t = (d - 90.0) / 45.0
        return 123.0 + smoothstep(t) * (152.0 - 123.0)
    elif 135.0 < d <= 180.0:
        t = (d - 135.0) / 45.0
        return 152.0 + smoothstep(t) * (182.0 - 152.0)
    elif 180.0 < d <= 225.0:
        t = (d - 180.0) / 45.0
        return 182.0 + smoothstep(t) * (205.0 - 182.0)
    elif 225.0 < d <= 270.0:
        t = (d - 225.0) / 45.0
        if t < 0.65:
            return 205.0 + (t / 0.65) * (214.0 - 205.0)
        else:
            t2 = (t - 0.65) / 0.35
            return 16.0 + t2 * (19.0 - 16.0)
    elif 270.0 < d <= 315.0:
        t = (d - 270.0) / 45.0
        return 19.0 + smoothstep(t) * (40.0 - 19.0)
    else: # 315.0 < d <= 360.0
        t = (d - 315.0) / 45.0
        return 40.0 + smoothstep(t) * (65.0 - 40.0)

def main():
    video_path = 'Public/Character.mp4' if os.path.exists('Public/Character.mp4') else 'public/character.mp4'
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        sys.exit(1)

    print(f"Opening video: {video_path}")
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"Source video: {width}x{height}, total frames: {total_frames}")

    all_frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        all_frames.append(frame)
    cap.release()
    print(f"Read {len(all_frames)} frames into memory.")

    # Target directories
    dirs = [os.path.join('Public', 'frames'), os.path.join('public', 'frames')]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

    # 1. Extract CENTER neutral frame (Frame 239)
    center_frame_bgr = all_frames[239]
    center_rgb = cv2.cvtColor(center_frame_bgr, cv2.COLOR_BGR2RGB)
    center_img = Image.fromarray(center_rgb)
    for d in dirs:
        center_path = os.path.join(d, 'center.webp')
        center_img.save(center_path, 'WEBP', quality=92, method=6)
    if os.path.exists('Public'):
        center_img.save('Public/center.webp', 'WEBP', quality=92, method=6)
    if os.path.exists('public'):
        center_img.save('public/center.webp', 'WEBP', quality=92, method=6)
    print("Saved center neutral frame (239)")

    # 2. Extract 64 circular frames
    NUM_FRAMES = 64
    manifest = []

    for i in range(NUM_FRAMES):
        angle_deg = i * (360.0 / NUM_FRAMES)
        angle_rad = angle_deg * (np.pi / 180.0)
        exact_f_idx = get_source_frame_num(angle_deg)
        int_f_idx = int(round(exact_f_idx))
        int_f_idx = max(0, min(total_frames - 1, int_f_idx))

        frame_bgr = all_frames[int_f_idx]
        frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(frame_rgb)

        filename = f"frame_{i:02d}.webp"
        for d in dirs:
            filepath = os.path.join(d, filename)
            img.save(filepath, 'WEBP', quality=92, method=6)

        manifest.append({
            "index": i,
            "filename": filename,
            "angleDeg": round(angle_deg, 2),
            "angleRad": round(angle_rad, 4),
            "sourceVideoFrame": int_f_idx
        })

    metadata = {
        "numFrames": NUM_FRAMES,
        "stepDeg": 360.0 / NUM_FRAMES,
        "width": width,
        "height": height,
        "faceCenter": {"x": 0.50, "y": 0.38},
        "compassKeyframes": {
            "RIGHT": 65,
            "DOWN_RIGHT": 90,
            "DOWN": 123,
            "DOWN_LEFT": 152,
            "LEFT": 182,
            "UP_LEFT": 205,
            "UP": 19,
            "UP_RIGHT": 40,
            "CENTER": 239
        },
        "frames": manifest
    }

    for d in dirs:
        json_path = os.path.join(d, 'frames.json')
        with open(json_path, 'w') as f:
            json.dump(metadata, f, indent=2)

    print("All 64 frames extracted with 100% correct cardinal alignment!")

if __name__ == '__main__':
    main()
