import os
import sys
import imageio
from PIL import Image

def extract_frames(
    video_path,
    output_dir,
    num_frames=120,
    target_width=1280,
    target_height=720,
    quality=80
):
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    print(f"Opening video: {video_path}")
    reader = imageio.get_reader(video_path, "ffmpeg")
    meta = reader.get_meta_data()
    fps = meta.get("fps", 24.0)
    duration = meta.get("duration", 10.0)
    print(f"Video metadata: FPS={fps}, Duration={duration}s, Size={meta.get('size')}")

    # Read all frames or sample evenly
    # Let's count total available frames
    total_frames = 0
    frames_buffer = []
    print("Reading video frames...")
    for frame in reader:
        frames_buffer.append(frame)
        total_frames += 1
    reader.close()

    print(f"Total video frames available: {total_frames}")

    if total_frames == 0:
        print("Error: No frames extracted from video")
        sys.exit(1)

    # Determine indices to sample
    indices = [int(i * (total_frames - 1) / (num_frames - 1)) for i in range(num_frames)]
    
    print(f"Exporting {num_frames} frames to {output_dir}...")
    for out_idx, frame_idx in enumerate(indices):
        raw_frame = frames_buffer[frame_idx]
        img = Image.fromarray(raw_frame)
        
        # Resize to target resolution maintaining aspect ratio (crop cover)
        w, h = img.size
        target_aspect = target_width / target_height
        img_aspect = w / h
        
        if img_aspect > target_aspect:
            # Crop width
            new_w = int(h * target_aspect)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:
            # Crop height
            new_h = int(w / target_aspect)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
            
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        out_filename = os.path.join(output_dir, f"frame_{out_idx:04d}.webp")
        img.save(out_filename, "WEBP", quality=quality)
        
        if (out_idx + 1) % 20 == 0 or out_idx == num_frames - 1:
            print(f"  Processed {out_idx + 1}/{num_frames} frames")

    print(f"Successfully extracted {num_frames} frames to {output_dir}")

if __name__ == "__main__":
    video = r"d:\RITHMOS-MAIN\rithmos\public\videos\guitar-cinematic.mp4"
    out = r"d:\RITHMOS-MAIN\rithmos\public\frames"
    extract_frames(video, out, num_frames=120)
