# Pristine Watermark Remover

A minimal, professional Node.js application for removing watermarks from images using the Gemini Watermark Removal algorithm.

## Features
- **Clean UI**: Minimalist, human-centric design focused on utility.
- **Fast Processing**: Efficient image handling using Jimp and Multer.
- **Privacy First**: Images are processed in memory and never stored on the server.
- **Easy Deployment**: Standard Express.js structure, ready for any cloud provider.

## Tech Stack
- **Backend**: Node.js, Express, Multer, Jimp
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (No frameworks, no bloat)
- **Algorithm**: [@pilio/gemini-watermark-remover](https://www.npmjs.com/package/@pilio/gemini-watermark-remover)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Lysine000/pristine-watermark-remover.git
   cd pristine-watermark-remover
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:8080`.

## Deployment

### 24/7 Free Options
- **Hugging Face Spaces**: Recommended. Supports Docker or Node.js directly. Free and always on.
- **Render**: Great for free hobby projects (sleeps after inactivity).
- **Railway**: Excellent performance, limited free tier credits.

### Docker
A `Dockerfile` can be easily added to containerize this application for production environments.

## License
This project is licensed under the ISC License.
