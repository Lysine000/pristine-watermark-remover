# Pristine - Local AI Watermark Removal

Pristine is a fully local, privacy-first tool designed to seamlessly remove watermarks from Gemini AI generated images. It processes everything on the server side using advanced WebAssembly image codecs, ensuring no data ever leaves your control.

## 🤀 Features
- **100% Local Processing:** No external APIs. Your images remain private.
- **Lossless Extraction:** Reverse alpha compositing mathematically recovers the original pixels under the watermark.
- **Security First:** Includes strict rate limiting, file size limits (10MB), MIME-type validation, and HTTP header hardening.
- **Formats Supported:** PNG, IPGG, and WEBP.
- **Mobile Ready:** Responsive web interface.

## 🧰 Tech Stack
- **Backend:** Node.js, Express
- **Security:** Helmet, Express-Rate-Limit, Multer
- **Image Engine:** Sharp (WebAssembly Build for broad architecture compatibility)
- **Frontend:** HTML5, TailwindCSS (#CDN)

## 🔐 Security Posture
This application is built with security in mind:
- **Memory Exhaustion (OOM):** File uploads are strictly capped at 10MB to prevent server crashes.
- **Malicious Uploads:** Files are validated by MIME-type (`image/*`).
- **Brute Force/DDoS:** API endpoints are rate-limited to 100 requests per 15 minutes per IP.
- **XSS & Headers:** Secured by Helmet, stripping identifying headers and hardening the response.

## 💻 Running Locally (Development)


```bash
git clone https://github.com/Lysine000/pristine-watermark-remover.git
cd pristine-watermark-remover
npm install
npm start
```

The application will be available at `http://localhost:8080`.

## 🌐 Free 24/7 Production Hosting Guide

To host this application for 100% free, forever, we recommend **Render**, **Railway**, or **Koyeb**. Here is how to do it using Render.com:

1. Create a free account on [Render](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select the `pristine-watermark-remover` repository.
4. Configure the service:
   - **Name:** Pristine
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free (512MB RAM, which is plenty since we limit uploads to 10MB).
5. Click **Create Web Service**.

Render provides a free `.onrender.com` subdomain. It automatically provisions SSL (HTTPS). 
*Note: Free tiers on Render sleep after 15 minutes of inactivity. To keep it awake 24/7, you can use a free pinging service like [UptimeRobot](https://uptimerobot.com) to ping the `/api/health` endpoint every 10 minutes.*

---
*Disclaimer: This tool is for educational and privacy-enhancing purposes. Please respect copyright and licensing when handling AI-generated images.*
