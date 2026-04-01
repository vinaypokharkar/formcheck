import math
import numpy as np
from abc import ABC, abstractmethod

def calculate_angle(a, b, c):
    """
    Calculate the angle between three points.
    'b' is the vertex of the angle.
    Returns the angle in degrees (0.0 to 180.0).
    """
    a = np.array(a) # First point
    b = np.array(b) # Mid point / Vertex
    c = np.array(c) # End point
    
    radians = math.atan2(c[1]-b[1], c[0]-b[0]) - math.atan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / math.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

class BaseExerciseChecker(ABC):
    """Base framework for any exercise counter/feedback logic."""
    def __init__(self):
        self.stage = "ready"
        self.counter = 0
        self.feedback = "Ready"
        
    @abstractmethod
    def process(self, landmarks):
        """Implement logic to calculate angles and return _build_response()."""
        pass

    def _get_default_response(self, msg):
        return {
            "angle": 0, 
            "counter": self.counter, 
            "stage": self.stage, 
            "feedback": msg, 
            "color": (0, 255, 255)
        }
        
    def _build_response(self, angle, draw_coords, color):
        return {
            "angle": int(angle), 
            "counter": self.counter, 
            "stage": self.stage, 
            "feedback": self.feedback,
            "draw_coords": draw_coords, # agnostic to knee or elbow
            "color": color
        }

class ShoulderPressChecker(BaseExerciseChecker):
    def process(self, landmarks):
        if not landmarks or len(landmarks) < 16:
            return None
            
        # Left Arm Mapping
        l_shoulder = [landmarks[11].x, landmarks[11].y]
        l_elbow = [landmarks[13].x, landmarks[13].y]
        l_wrist = [landmarks[15].x, landmarks[15].y]
        
        if landmarks[11].visibility < 0.5 or landmarks[13].visibility < 0.5 or landmarks[15].visibility < 0.5:
            return self._get_default_response("Arm not fully visible!")
            
        angle = calculate_angle(l_shoulder, l_elbow, l_wrist)
        color = (0, 255, 255)
        
        if angle > 150:
            if self.stage in ["down", "pressing", "too_deep"]:
                self.counter += 1
                self.feedback = "Good lockout!"
            self.stage = "up"
            color = (0, 255, 0)
            
        elif angle < 65:
            self.stage = "too_deep"
            self.feedback = "WARNING: Elbows dropped too low!"
            color = (0, 0, 255)
            
        elif 65 <= angle < 90:
            self.stage = "down"
            self.feedback = "Perfect depth! Press UP!"
            color = (0, 255, 0)
            
        elif 90 <= angle <= 150:
            if self.stage == "up" or self.stage == "ready":
                self.stage = "lowering"
                self.feedback = "Control the weight down..."
            elif self.stage in ["down", "too_deep"]:
                self.stage = "pressing"
                self.feedback = "Push push push!"
        
        return self._build_response(angle, l_elbow, color)


class SquatChecker(BaseExerciseChecker):
    def process(self, landmarks):
        if not landmarks or len(landmarks) < 28:
            return None
            
        # Left Leg Mapping
        l_hip = [landmarks[23].x, landmarks[23].y]
        l_knee = [landmarks[25].x, landmarks[25].y]
        l_ankle = [landmarks[27].x, landmarks[27].y]
        
        if landmarks[23].visibility < 0.5 or landmarks[25].visibility < 0.5 or landmarks[27].visibility < 0.5:
            return self._get_default_response("Legs not fully visible!")
            
        angle = calculate_angle(l_hip, l_knee, l_ankle)
        color = (0, 255, 255)
        
        if angle > 150:
            if self.stage in ["low_squat", "half_squat"]:
                self.counter += 1
                self.feedback = "Good rep!"
            self.stage = "standing"
            color = (0, 255, 0)
            
        elif angle < 90:
            self.stage = "low_squat"
            self.feedback = "Perfect depth, stand up!"
            color = (0, 255, 0)
            
        elif 90 <= angle <= 150:
            if self.stage == "standing" or self.stage == "ready":
                self.stage = "half_squat"
                self.feedback = "Go lower..."
        
        return self._build_response(angle, l_knee, color)


class BicepCurlChecker(BaseExerciseChecker):
    """Bonus exercise just to show it works!"""
    def process(self, landmarks):
        if not landmarks or len(landmarks) < 16:
            return None
            
        l_shoulder = [landmarks[11].x, landmarks[11].y]
        l_elbow = [landmarks[13].x, landmarks[13].y]
        l_wrist = [landmarks[15].x, landmarks[15].y]
        
        if landmarks[11].visibility < 0.5 or landmarks[13].visibility < 0.5 or landmarks[15].visibility < 0.5:
            return self._get_default_response("Arm not fully visible!")
            
        angle = calculate_angle(l_shoulder, l_elbow, l_wrist)
        color = (0, 255, 255)
        
        if angle > 150:
            if self.stage == "curling":
                self.counter += 1
                self.feedback = "Good extension!"
            self.stage = "down"
            color = (0, 255, 0)
            
        elif angle < 45:
            self.stage = "curling"
            self.feedback = "Squeeze the bicep!"
            color = (0, 255, 0)
            
        elif 45 <= angle <= 150:
            self.feedback = "Keep tension..."
            
        return self._build_response(angle, l_elbow, color)


def get_exercise_checker(exercise_name):
    """
    Factory function to easily swap out the exercise tracker being used.
    """
    checkers = {
        "squat": SquatChecker,
        "shoulder_press": ShoulderPressChecker,
        "bicep_curl": BicepCurlChecker
    }
    
    # Safely default to shoulder press if unknown exercise comes through
    cls = checkers.get(exercise_name.lower(), ShoulderPressChecker)
    return cls()
