# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- **Bun**: `curl -fsSL https://bun.sh/install | bash`
- **Node.js**: Download from [nodejs.org](https://nodejs.org/)

### 1. Setup (Choose One)
```bash
# Option A: Automated setup
./setup.sh                    # Linux/macOS
setup.bat                     # Windows

# Option B: Manual setup
cd backend && bun install
cd ../frontend && npm install
```

### 2. Start the Application
```bash
# Terminal 1: Backend
cd backend
bun run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 3. Open Browser
Navigate to: **http://localhost:5173**

### 4. Start Scraping
1. Enter a product keyword (e.g., "laptop", "headphones")
2. Click "Search Products"
3. View results with ratings, reviews, and images

## 🔧 API Endpoints

- **Scrape**: `GET http://localhost:3000/api/scrape?keyword=yourKeyword`
- **Health**: `GET http://localhost:3000/api/health`

## 📁 Key Files

- `backend/index.js` - Main server with scraping logic
- `frontend/main.js` - Frontend JavaScript
- `frontend/style.css` - Modern responsive styling
- `README.md` - Complete documentation

## 🐛 Quick Fixes

**Backend won't start?**
```bash
cd backend
bun install
bun run dev
```

**Frontend won't start?**
```bash
cd frontend
npm install
npm run dev
```

**No products found?**
- Try different keywords
- Check internet connection
- Wait a few minutes and retry

---

**Need help?** See the full [README.md](README.md) for detailed instructions.