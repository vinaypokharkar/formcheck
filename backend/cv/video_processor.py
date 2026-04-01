import cv2
import os
from .pose_estimator import PoseEstimator

def process_video_file(input_path: str, output_path: str):
    """
    Reads an mp4 video from input_path, runs sequence through PoseEstimator,
    and writes the annotated mp4 video to output_path.
    """
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video at {input_path}")
    
    try:
        # Get video properties
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        if fps == 0:
            fps = 30 # fallback
            
        # Using mp4v codec for mp4 output
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        try:
            estimator = PoseEstimator()
            frame_idx = 0
            while cap.isOpened():
                success, frame = cap.read()
                if not success:
                    break
                    
                timestamp_ms = int((frame_idx * 1000) / fps)
                frame_idx += 1
                
                _, annotated_frame = estimator.process_frame(frame, timestamp_ms=timestamp_ms)
                out.write(annotated_frame)
        finally:
            out.release()
            try:
                estimator.close()
            except UnboundLocalError:
                pass
    finally:
        cap.release()
