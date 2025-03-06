# Text-to-Speech Web Application

A web application that converts text to speech using Coqui TTS.

## Prerequisites

- Python 3.8 or higher but don't use 3.12
- Node.js and npm
- Git

## Installation

### Backend Setup

1. Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

2. Install required Python packages:

```bash
pip install fastapi
pip install "uvicorn[standard]"
pip install TTS
pip install soundfile
pip install numpy
pip install python-multipart
```

### Frontend Setup

1. Install frontend dependencies:

```bash
npm install axios
```

## Running the Application

1. Start the backend server:

```bash
# Make sure your virtual environment is activated
python main.py
```

The backend will be available at `http://127.0.0.1:8000`

2. In a new terminal, start the frontend development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter text in the textarea
3. Click "Synthesize" to convert text to speech
4. The audio player will appear with your generated speech

## Troubleshooting

If you encounter any issues:

- Ensure all dependencies are properly installed
- Check that both backend and frontend servers are running
- Verify that ports 3000 and 8000 are not in use by other applications
- Check the console logs in your browser for frontend errors
- Check the terminal running the backend for any Python errors

## Project Structure

```
├── backend/
│   ├── main.py
│   └── output/      # Generated audio files
```

