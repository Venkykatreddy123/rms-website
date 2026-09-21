import os
import sys
import imageio
from PIL import Image

def extract_camera_frames(video_path, output_dir, num_frames=60, target_width=1280, target_height=720, quality=78):
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        return False

    os.makedirs(output_dir, exist_ok=True)
    print(f"Opening video: {video_path}")
    reader = imageio.get_reader(video_path, "ffmpeg")
    
    frames_buffer = []
    for frame in reader:
        frames_buffer.append(frame)
    reader.close()

    total_frames = len(frames_buffer)
    print(f"Read {total_frames} frames from {os.path.basename(video_path)}. Exporting {num_frames} frames to {output_dir}...")
    
    indices = [int(i * (total_frames - 1) / (num_frames - 1)) for i in range(num_frames)]
    target_aspect = target_width / target_height

    for out_idx, frame_idx in enumerate(indices):
        raw_frame = frames_buffer[frame_idx]
        img = Image.fromarray(raw_frame)
        
        w, h = img.size
        img_aspect = w / h
        if img_aspect > target_aspect:
            new_w = int(h * target_aspect)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_aspect)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
            
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        out_filename = os.path.join(output_dir, f"frame_{out_idx:04d}.webp")
        img.save(out_filename, "WEBP", quality=quality)

    print(f"Successfully extracted {num_frames} frames to {output_dir}")
    return True

if __name__ == "__main__":
    v_brass = r"d:\RITHMOS-MAIN\rithmos\public\videos\brass-cinematic.mp4"
    out_brass = r"d:\RITHMOS-MAIN\rithmos\public\frames_brass"
    extract_camera_frames(v_brass, out_brass, num_frames=60)

    v_energy = r"d:\RITHMOS-MAIN\rithmos\public\videos\sound-energy.mp4"
    out_energy = r"d:\RITHMOS-MAIN\rithmos\public\frames_energy"
    extract_camera_frames(v_energy, out_energy, num_frames=60)
