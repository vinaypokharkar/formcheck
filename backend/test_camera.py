import cv2
import time
from cv.pose_estimator import PoseEstimator

def main():
    print("Initializing Pose Estimator for Bicep Curls...")
    estimator = PoseEstimator(exercise="bicep_curl")
    
    print("Starting webcam. Press 'q' to quit.")
    # 0 is usually the default built-in or USB webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open the webcam.")
        return
        
    start_time = time.time()
    
    try:
        while True:
            success, frame = cap.read()
            if not success:
                print("Ignoring empty camera frame.")
                continue
                
            # Flip frame horizontally for a more natural mirror effect
            frame = cv2.flip(frame, 1)
                
            # Calculate timestamp required for Tasks API VIDEO mode
            timestamp_ms = int((time.time() - start_time) * 1000)
            
            # Run through our pose estimator
            _, annotated_frame = estimator.process_frame(frame, timestamp_ms)
            
            # Display the live output window
            cv2.imshow('Formcheck - Live Feedback', annotated_frame)
            
            # Check for 'q' key to stop
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    except KeyboardInterrupt:
        print("\nInterrupted by user (Ctrl+C). Shutting down...")
    finally:
        # Cleanup
        cap.release()
        cv2.destroyAllWindows()
        estimator.close()

if __name__ == "__main__":
    main()
