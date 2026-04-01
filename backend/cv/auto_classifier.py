import collections
import numpy as np
from cv.form_checker import calculate_angle

class ExerciseAutoClassifier:
    """
    Observes a specified number of frames to classify the exercise 
    being performed based on the target muscle group.
    """
    def __init__(self, muscle_group, window_size=30):
        self.muscle_group = muscle_group.lower()
        self.window_size = window_size
        self.frame_count = 0
        self.is_classified = False
        self.detected_exercise = None
        
        # We store angles over time to measure variance (movement)
        self.history = collections.defaultdict(list)

    def add_frame_data(self, landmarks):
        """Extracts key angles from the landmarks and stores them in the sliding window."""
        if not landmarks or len(landmarks) < 33:
            return False

        # --- Extract Key Joints ---
        l_shoulder = [landmarks[11].x, landmarks[11].y]
        r_shoulder = [landmarks[12].x, landmarks[12].y]
        l_elbow = [landmarks[13].x, landmarks[13].y]
        r_elbow = [landmarks[14].x, landmarks[14].y]
        l_wrist = [landmarks[15].x, landmarks[15].y]
        
        l_hip = [landmarks[23].x, landmarks[23].y]
        r_hip = [landmarks[24].x, landmarks[24].y]
        l_knee = [landmarks[25].x, landmarks[25].y]
        r_knee = [landmarks[26].x, landmarks[26].y]
        l_ankle = [landmarks[27].x, landmarks[27].y]
        
        # --- Calculate Angles ---
        # Arms
        l_elbow_angle = calculate_angle(l_shoulder, l_elbow, l_wrist)
        r_elbow_angle = calculate_angle(r_shoulder, r_elbow, l_wrist)
        l_shoulder_angle = calculate_angle(l_hip, l_shoulder, l_elbow) # Arm raising away from body
        
        # Legs
        l_knee_angle = calculate_angle(l_hip, l_knee, l_ankle)
        r_knee_angle = calculate_angle(r_hip, r_knee, l_ankle)
        l_hip_angle = calculate_angle(l_shoulder, l_hip, l_knee) # Torso bending
        
        # --- Store in History ---
        self.history['l_elbow_angle'].append(l_elbow_angle)
        self.history['l_shoulder_angle'].append(l_shoulder_angle)
        self.history['l_knee_angle'].append(l_knee_angle)
        self.history['r_knee_angle'].append(r_knee_angle)
        self.history['l_hip_angle'].append(l_hip_angle)
        
        # Check torso position (Horizontal vs Vertical)
        # If shoulder Y and hip Y are very close = horizontal (plank/pushup)
        # Warning: MediaPipe Y is inverted (0 is top of screen)
        torso_angle_vertical = calculate_angle([l_shoulder[0], 0], l_shoulder, l_hip)
        self.history['torso_verticality'].append(torso_angle_vertical)

        self.frame_count += 1
        
        # If we have enough frames, try to classify!
        if self.frame_count >= self.window_size:
            return self.classify()
            
        return False

    def classify(self):
        """Analyzes the variance over the window to determine the exercise."""
        # Calculate the variance (how much the angle changed) for key joints
        l_knee_var = np.ptp(self.history['l_knee_angle']) # Peak to peak (max - min)
        r_knee_var = np.ptp(self.history['r_knee_angle'])
        l_hip_var = np.ptp(self.history['l_hip_angle'])
        
        l_elbow_var = np.ptp(self.history['l_elbow_angle'])
        l_shoulder_var = np.ptp(self.history['l_shoulder_angle'])
        
        avg_torso_vert = np.mean(self.history['torso_verticality'])
        
        # --- Classification Logic Tree ---
        if self.muscle_group == "legs":
            # Rule: If hips bend (RDL), but knees stay relatively straight
            if l_hip_var > 30 and l_knee_var < 25:
                self.detected_exercise = "rdl"
            # Rule: If left knee and right knee bend very differently -> Asymmetrical
            elif abs(l_knee_var - r_knee_var) > 40:
                self.detected_exercise = "lunge"
            # Rule: If both knees bend synchronously and heavily
            elif l_knee_var > 40 and r_knee_var > 40:
                self.detected_exercise = "squat"
            else:
                self.detected_exercise = "squat" # Default fallback
                
        elif self.muscle_group == "shoulders":
            # Rule: Elbows bend a lot -> Press. Elbows rigid -> Lateral Raise.
            if l_elbow_var > 40:
                self.detected_exercise = "shoulder_press"
            else:
                self.detected_exercise = "lateral_raise"
                
        elif self.muscle_group == "biceps":
            # Bicep curls have high elbow movement, low shoulder movement
            self.detected_exercise = "bicep_curl"
            
        elif self.muscle_group == "chest":
            # Rule: If torso is horizontal -> Pushup
            # If torso is vertical but elbows are bending (maybe dips, but we'll default pushup)
            if avg_torso_vert > 45: # Horizontal-ish
                self.detected_exercise = "pushup"
            else:
                self.detected_exercise = "pushup" # Expandable later
                
        elif self.muscle_group == "abs":
            # Rule: If torso verticality is horizontal (lying down) and hips are closing
            self.detected_exercise = "crunch"
            
        elif self.muscle_group == "back":
            # Hardest to see from front. Usually rely on elbows moving while torso vertical.
            # Could be bent-over row (torso tilted) vs pullup (torso vertical)
            if avg_torso_vert > 45:
                self.detected_exercise = "row"
            else:
                self.detected_exercise = "pullup"
                
        elif self.muscle_group == "triceps":
            self.detected_exercise = "tricep_extension"
            
        else:
            self.detected_exercise = "unknown"

        self.is_classified = True
        return True

    def get_status(self):
        """Returns the current state for UI rendering."""
        if self.is_classified:
            return f"Exercise Locked: {self.detected_exercise.replace('_', ' ').title()}"
        
        progress = int((self.frame_count / self.window_size) * 100)
        return f"Muscle Group: {self.muscle_group.title()} | Analyzing Movement... {progress}%"
