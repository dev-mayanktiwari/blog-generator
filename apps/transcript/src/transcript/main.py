from flask import Flask, request, jsonify
from .get_transcript import get_transcript
from flask_cors import CORS

app = Flask(__name__)

# More explicit CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Server is running"}), 200

@app.route('/transcript', methods=['POST'])
def fetch_transcript():
    try:
        data = request.get_json()
        if not data or 'video_id' not in data:
            return jsonify({"error": "Missing 'video_id' in request body"}), 400
        
        video_id = data['video_id']
        print(f"Fetching transcript for video ID: {video_id}")  # Debug logging
        
        transcript = get_transcript(video_id)
        return jsonify({"video_id": video_id, "transcript": transcript}), 200
        
    except ValueError as e:
        print(f"ValueError: {str(e)}")  # Debug logging
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"Unexpected error: {str(e)}")  # Debug logging
        return jsonify({"error": "Internal server error"}), 500

def main():
    app.run(debug=True, port=8080, host='0.0.0.0')

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')