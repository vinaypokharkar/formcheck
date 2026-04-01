import os
import cv2
import urllib.request
import mediapipe as mp
import numpy as np
from cv.form_checker import get_exercise_checker

MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task"
MODEL_PATH = os.path.join(os.path.dirname(__file__), "pose_landmarker_full.task")

def ensure_model_exists():
    """Downloads the required MediaPipe Task file if missing."""
    if not os.path.exists(MODEL_PATH):
        print(f"Downloading MediaPipe Pose Model to {MODEL_PATH}...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print("Download complete.")

# 33 landmarks, standard connections for MediaPipe Pose
POSE_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 7), (0, 4), (4, 5), (5, 6), (6, 8), (9, 10), (11, 12),
    (11, 13), (13, 15), (15, 17), (15, 19), (15, 21), (17, 19), (12, 14), (14, 16),
    (16, 18), (16, 20), (16, 22), (18, 20), (11, 23), (12, 24), (23, 24), (23, 25),
    (24, 26), (25, 27), (26, 28), (27, 29), (28, 30), (29, 31), (30, 32), (27, 31), (28, 32)
]

class PoseEstimator:
    def __init__(self, exercise="shoulder_press"):
        """
        Initialize the modern MediaPipe Tasks API PoseLandmarker.
        """
        ensure_model_exists()
        
        BaseOptions = mp.tasks.BaseOptions
        PoseLandmarker = mp.tasks.vision.PoseLandmarker
        PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
        VisionRunningMode = mp.tasks.vision.RunningMode

        # Initialize the landmarker in VIDEO mode with increased confidence thresholds
        options = PoseLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=MODEL_PATH),
            running_mode=VisionRunningMode.VIDEO,
            min_pose_detection_confidence=0.5,
            min_pose_presence_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.landmarker = PoseLandmarker.create_from_options(options)
        self.checker = get_exercise_checker(exercise)

    def process_frame(self, image: np.ndarray, timestamp_ms: int):
        """
        Process a single OpenCV image frame (BGR format) at a specific timestamp.
        Returns:
            pose_landmarks: MediaPipe landmarks object result list
            annotated_image: The original image with pose lines drawn manually using OpenCV
        """
        # Convert BGR to RGB for MediaPipe
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
        
        # Detect pose
        detection_result = self.landmarker.detect_for_video(mp_image, timestamp_ms)
        
        annotated_image = image.copy()
        
        # Draw the pose landmarks on the image copy
        if hasattr(detection_result, 'pose_landmarks') and detection_result.pose_landmarks:
            for pose_landmarks in detection_result.pose_landmarks:
                h, w, _ = annotated_image.shape
                
                # Convert normalized coordinates to pixel coordinates
                # Use a dictionary to store valid landmarks to enforce a hardware visibility threshold
                pixel_landmarks = {}
                for idx, lm in enumerate(pose_landmarks): # lm has x, y, z, visibility, presence
                    # MediaPipe guesses the position of invisible joints (e.g. feet off-screen). 
                    # If visibility is less than a certain threshold, it usually creates inaccurate lines.
                    if getattr(lm, 'visibility', 1.0) < 0.5:
                        continue
                        
                    x, y = int(lm.x * w), int(lm.y * h)
                    pixel_landmarks[idx] = (x, y)
                    
                    # Draw node dots
                    cv2.circle(annotated_image, (x, y), 4, (0, 255, 0), -1)
                
                # Draw connecting lines
                for connection in POSE_CONNECTIONS:
                    start_idx, end_idx = connection
                    if start_idx in pixel_landmarks and end_idx in pixel_landmarks:
                        cv2.line(annotated_image, 
                                 pixel_landmarks[start_idx], 
                                 pixel_landmarks[end_idx], 
                                 (255, 0, 0), 2)
                                 
                # Evaluate the exercise!
                feedback_data = self.checker.process(pose_landmarks)
                
                if feedback_data:
                    # Draw Replay Counter and Feedback on Screen
                    cv2.rectangle(annotated_image, (0, 0), (450, 100), (0, 0, 0), -1)
                    
                    # Display count
                    cv2.putText(annotated_image, f"REPS: {feedback_data['counter']}", 
                                (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                                
                    # Display stage
                    cv2.putText(annotated_image, f"STAGE: {feedback_data['stage']}", 
                                (200, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                                
                    # Display form feedback with dynamic coloring!
                    text_color = feedback_data.get('color', (0, 255, 255))
                    cv2.putText(annotated_image, f"FEEDBACK: {feedback_data['feedback']}", 
                                (10, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.8, text_color, 2, cv2.LINE_AA)
                                
                    # Optionally draw the exact angle right next to the active joint
                    if feedback_data.get('draw_coords') and feedback_data['angle'] > 0:
                        ex, ey = feedback_data['draw_coords']
                        # Convert normalized back to pixel to draw text
                        px, py = int(ex * w), int(ey * h)
                        cv2.putText(annotated_image, str(feedback_data['angle']), 
                                    (px + 15, py), cv2.FONT_HERSHEY_SIMPLEX, 0.7, text_color, 2, cv2.LINE_AA)
                                    
        return detection_result.pose_landmarks, annotated_image

    def close(self):
        """Required clean up for MediaPipe resources."""
        self.landmarker.close()
