import os
import tempfile
import time
import base64
import numpy as np
import cv2
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from cv.video_processor import process_video_file
from cv.pose_estimator import PoseEstimator


app = FastAPI(title="Formcheck API")

# Setup CORS for future frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Formcheck API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/process-video")
async def process_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    # Create temporary files for input and output
    fd_in, temp_in_path = tempfile.mkstemp(suffix=".mp4")
    fd_out, temp_out_path = tempfile.mkstemp(suffix=".mp4")
    os.close(fd_in)
    os.close(fd_out)
    
    # Save uploaded file
    with open(temp_in_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    # Process the video
    try:
        process_video_file(temp_in_path, temp_out_path)
    except Exception as e:
        # Cleanup input on failure
        if os.path.exists(temp_in_path):
            os.remove(temp_in_path)
        if os.path.exists(temp_out_path):
            os.remove(temp_out_path)
        return {"error": str(e)}
        
    # Clean up the input file now. We no longer need it.
    if os.path.exists(temp_in_path):
        os.remove(temp_in_path)
    
    # Send the processed video back. Fast API BackgroundTasks handles deleting the file AFTER sending.
    background_tasks.add_task(os.remove, temp_out_path)
    return FileResponse(path=temp_out_path, media_type="video/mp4", filename=f"processed_{file.filename}")

@app.websocket("/ws/live-feed")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for frontend React/Next.js/HTML clients to stream
    live webcam frames (base64) and receive annotated frames back in real-time.
    """
    await websocket.accept()
    estimator = PoseEstimator()
    start_time = time.time()
    
    try:
        while True:
            # Receive base64 encoded image frame from frontend
            data = await websocket.receive_text()
            
            # Strip the header if the frontend sends a pure data URL
            if "," in data:
                data = data.split(",")[1]
                
            # Decode image back into cv2 BGR array
            img_data = base64.b64decode(data)
            np_arr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if frame is None:
                continue
                
            # Process the frame
            timestamp_ms = int((time.time() - start_time) * 1000)
            pose_landmarks, annotated_frame, feedback_data = estimator.process_frame(frame, timestamp_ms)
            
            # Extract the 33 body landmarks
            landmarks_list = []
            if pose_landmarks and len(pose_landmarks) > 0:
                # pose_landmarks[0] contains the landmarks for the first detected person
                for lm in pose_landmarks[0]:
                    landmarks_list.append({
                        "x": lm.x,
                        "y": lm.y,
                        "z": lm.z,
                        "visibility": getattr(lm, "visibility", 0.0)
                    })
            
            # Prepare fast JSON response
            response_data = {
                "reps": feedback_data.get("counter", 0) if feedback_data else 0,
                "feedback": feedback_data.get("feedback", "POSITIONING...") if feedback_data else "WAITING...",
                "stage": feedback_data.get("stage", "") if feedback_data else "",
                "score": 95 if feedback_data and "Good" in feedback_data.get("feedback", "") else 70,
                "good_form": feedback_data and "WARNING" not in feedback_data.get("feedback", "") if feedback_data else False,
                "aligned": len(landmarks_list) > 0,
                "landmarks": landmarks_list  # <--- Sending 33 points instead of a large image!
            }
            
            # Send back the tiny, fast JSON packet
            await websocket.send_json(response_data)
            
    except WebSocketDisconnect:
        print("Frontend disconnected from live feed.")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        estimator.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
