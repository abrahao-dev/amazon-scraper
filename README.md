# 🛒 Amazon Product Scraper

[![Bun](https://img.shields.io/badge/Bun-1.2.19-000000?style=for-the-badge&logo=bun)](https://bun.sh/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> A modern, full-stack web application that scrapes Amazon product listings from search results. Built with **Bun** (backend) and **Vite** (frontend) for optimal performance and developer experience.

## 🌟 Features

- **🔍 Real-time Amazon Scraping**: Search and scrape Amazon product listings instantly
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations and professional styling
- **📊 Product Details**: Extract product titles, ratings, reviews, and high-quality images
- **🛡️ Error Handling**: Graceful error handling with user-friendly messages and retry options
- **⚡ Loading States**: Visual feedback during scraping operations with animated spinners
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🔄 Demo Mode**: Fallback system with sample data when Amazon blocks requests
- **🚀 Fast Performance**: Built with Bun and Vite for lightning-fast development and runtime



## 🛠️ Tech Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Backend Runtime** | [Bun](https://bun.sh/) | 1.2.19 | Fast JavaScript runtime |
| **Backend Framework** | [Express.js](https://expressjs.com/) | 4.18.2 | Web framework |
| **HTTP Client** | [Axios](https://axios-http.com/) | 1.6.0 | HTTP requests |
| **HTML Parser** | [JSDOM](https://github.com/jsdom/jsdom) | 23.0.1 | DOM manipulation |
| **CORS** | [cors](https://www.npmjs.com/package/cors) | 2.8.5 | Cross-origin requests |
| **Frontend Build Tool** | [Vite](https://vitejs.dev/) | 5.0.0 | Fast dev server & build |
| **Frontend** | Vanilla JavaScript | - | No framework dependencies |
| **Styling** | CSS3 + Flexbox/Grid | - | Modern responsive design |
| **Icons** | [Font Awesome](https://fontawesome.com/) | 6.0.0 | Beautiful icons |
| **Typography** | [Google Fonts](https://fonts.google.com/) | Inter | Modern fonts |

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

| Requirement | Version | Installation |
|-------------|---------|--------------|
| **Bun** | v1.0.0+ | [Installation Guide](#installing-bun) |
| **Node.js** | v18.0.0+ | [Download](https://nodejs.org/) |
| **Git** | Latest | [Download](https://git-scm.com/) |

### Installing Bun

<details>
<summary><strong>📥 Click to expand installation instructions</strong></summary>

#### **macOS or Linux**
```bash
curl -fsSL https://bun.sh/install | bash
```

#### **Windows (PowerShell)**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

#### **Verify Installation**
```bash
bun --version
# Should output: 1.2.19 (or higher)
```

</details>

## 🚀 Quick Start

### **1. Clone the Repository**
```bash
git clone https://github.com/abrahao-dev/amazon-scraper.git
cd amazon-scraper
```

### **2. Install Dependencies**

<details>
<summary><strong>🔧 Manual Installation</strong></summary>

```bash
# Install backend dependencies
cd backend
bun install

# Install frontend dependencies
cd ../frontend
npm install
```

</details>

<details>
<summary><strong>⚡ Automated Setup (Recommended)</strong></summary>

#### **Windows**
```cmd
setup.bat
```

#### **macOS/Linux**
```bash
chmod +x setup.sh
./setup.sh
```

</details>

### **3. Start the Application**

#### **Option A: Manual Start**
```bash
# Terminal 1: Start Backend
cd backend
bun run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

#### **Option B: Quick Start Script**
```bash
# Start both servers with one command
npm run dev:all
```

### **4. Open the Application**
🌐 Navigate to: **http://localhost:5173**

### **5. Start Scraping!**
1. Enter a product keyword (e.g., "laptop", "headphones")
2. Click "Search Products"
3. View results with ratings, reviews, and images

## 📖 Usage

### **Basic Usage**
1. **Enter a Search Keyword**: Type a product keyword in the search input
   - Examples: `laptop`, `wireless headphones`, `gaming mouse`, `dell g15`
2. **Click Search**: Click the "Search Products" button or press **Enter**
3. **View Results**: The application displays:
   - 📱 Product titles with full specifications
   - ⭐ Star ratings (visual representation)
   - 💬 Number of reviews
   - 🖼️ High-quality product images

### **Demo Mode**
When Amazon blocks automated requests, the app automatically switches to **Demo Mode**:
- Shows sample data for demonstration
- Clear indication that demo data is being used
- Maintains full functionality for testing

### **Error Handling**
- **Connection Issues**: Clear messages about server connectivity
- **No Results**: Helpful suggestions for different keywords
- **Retry Options**: Easy retry functionality for failed requests

## 🔧 API Documentation

### **Base URL**
```
http://localhost:3000
```

### **Endpoints**

#### **GET `/api/scrape`**
Scrapes Amazon products for a given keyword.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `keyword` | string | ✅ | The search term to scrape |
| `demo` | boolean | ❌ | Force demo mode (default: false) |

**Example Requests:**
```bash
# Real scraping
curl "http://localhost:3000/api/scrape?keyword=laptop"

# Demo mode
curl "http://localhost:3000/api/scrape?keyword=laptop&demo=true"
```

**Example Response:**
```json
{
  "success": true,
  "keyword": "laptop",
  "count": 3,
  "products": [
    {
      "id": 1,
      "title": "Dell XPS 13 Laptop - 13.4\" FHD+ Display, Intel Core i7-1250U, 16GB RAM, 512GB SSD",
      "rating": "4.5",
      "reviews": "2,847",
      "imageUrl": "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg"
    }
  ],
  "demo": false
}
```

#### **GET `/api/health`**
Health check endpoint to verify API status.

**Example Response:**
```json
{
  "success": true,
  "message": "Amazon Scraper API is running",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### **Testing the API**
```bash
# Health check
curl http://localhost:3000/api/health

# Search for laptops
curl "http://localhost:3000/api/scrape?keyword=laptop"

# Search for headphones
curl "http://localhost:3000/api/scrape?keyword=headphones"

# Force demo mode
curl "http://localhost:3000/api/scrape?keyword=gaming%20mouse&demo=true"
```

## 📸 Screenshots

<details>
<summary><strong>🖼️ Click to view screenshots</strong></summary>

### **Main Interface**
![Main Interface](https://via.placeholder.com/800x400/667eea/ffffff?text=Amazon+Product+Scraper+Interface)

### **Search Results**
![Search Results](https://via.placeholder.com/800x400/764ba2/ffffff?text=Product+Search+Results)

### **Mobile Responsive**
![Mobile View](https://via.placeholder.com/400x600/667eea/ffffff?text=Mobile+Responsive+Design)

</details>

## 📁 Project Structure

```
amazon-scraper/
├── 📁 backend/                    # Backend server
│   ├── 📄 index.js               # Main server with scraping logic
│   └── 📄 package.json           # Backend dependencies
├── 📁 frontend/                   # Frontend application
│   ├── 📄 index.html             # Main HTML structure
│   ├── 📄 style.css              # Modern responsive styling
│   ├── 📄 main.js                # Frontend JavaScript logic
│   ├── 📄 vite.config.js         # Vite configuration
│   └── 📄 package.json           # Frontend dependencies
├── 📄 README.md                   # Project documentation
├── 📄 QUICK_START.md             # Quick start guide
├── 📄 setup.sh                   # Automated setup (Linux/macOS)
└── 📄 setup.bat                  # Automated setup (Windows)
```

## 🎨 Features in Detail

### Backend Features
- **Robust Scraping**: Uses multiple CSS selectors to handle Amazon's dynamic structure
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Rate Limiting**: Built-in delays to be respectful to Amazon's servers
- **CORS Support**: Configured for cross-origin requests
- **Health Check**: Endpoint to verify API status

### Frontend Features
- **Modern UI**: Clean, professional design with smooth animations
- **Responsive Layout**: Adapts to all screen sizes
- **Loading States**: Visual feedback during API calls
- **Error Recovery**: Retry functionality for failed requests
- **Keyboard Support**: Enter key to trigger search
- **Image Fallbacks**: Graceful handling of missing product images

## ⚠️ Important Notes

### Legal Considerations
- This tool is for educational purposes only
- Respect Amazon's Terms of Service and robots.txt
- Consider implementing rate limiting for production use
- Be aware of web scraping laws in your jurisdiction

### Technical Limitations
- Amazon may block requests if too many are made too quickly
- The scraper may need updates if Amazon changes their HTML structure
- Some products may not have all information available (ratings, reviews, images)

## 🐛 Troubleshooting

### **Common Issues & Solutions**

<details>
<summary><strong>🚫 Backend won't start</strong></summary>

**Problem**: `bun: command not found` or server fails to start

**Solutions**:
```bash
# 1. Check if Bun is installed
bun --version

# 2. If not installed, install Bun
curl -fsSL https://bun.sh/install | bash

# 3. Reinstall dependencies
cd backend
rm -rf node_modules
bun install

# 4. Check for port conflicts
lsof -i :3000
```

</details>

<details>
<summary><strong>🚫 Frontend won't start</strong></summary>

**Problem**: `npm: command not found` or Vite fails to start

**Solutions**:
```bash
# 1. Check Node.js version
node --version  # Should be 18.0.0+

# 2. Reinstall dependencies
cd frontend
rm -rf node_modules
npm install

# 3. Check for port conflicts
lsof -i :5173
```

</details>

<details>
<summary><strong>🚫 No products found</strong></summary>

**Problem**: Search returns no results

**Solutions**:
- ✅ Try different keywords (e.g., "laptop", "headphones")
- ✅ Check internet connection
- ✅ Amazon may be blocking requests (normal behavior)
- ✅ App will automatically switch to demo mode

</details>

<details>
<summary><strong>🚫 CORS errors</strong></summary>

**Problem**: `Access to fetch at 'http://localhost:3000' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solutions**:
```bash
# 1. Ensure backend is running on port 3000
curl http://localhost:3000/api/health

# 2. Check CORS configuration in backend/index.js
# 3. Restart both servers
```

</details>

<details>
<summary><strong>🚫 503 Error from Amazon</strong></summary>

**Problem**: `Request failed with status code 503`

**Solutions**:
- ✅ This is expected behavior (Amazon blocks automated requests)
- ✅ App automatically falls back to demo mode
- ✅ Try again later or use different keywords
- ✅ Demo mode provides realistic sample data

</details>

### **Debug Mode**

Enable detailed logging for troubleshooting:
```bash
# Set debug environment variable
export DEBUG=true

# Start backend with debug logging
cd backend
DEBUG=true bun run dev
```

### **Log Files**

Check these locations for error logs:
- **Backend**: Console output in terminal
- **Frontend**: Browser Developer Tools (F12)
- **Network**: Browser Network tab for API calls

## 🔄 Development

### **Backend Development**
```bash
cd backend
bun run dev  # Starts with auto-reload
```

**Features:**
- ⚡ Hot reload on file changes
- 🔍 Real-time logging
- 🛡️ Error handling with stack traces
- 📊 Request monitoring

### **Frontend Development**
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

**Features:**
- ⚡ Lightning-fast hot module replacement
- 🎨 CSS hot reload
- 📱 Responsive design testing
- 🔧 Development tools integration

### **Building for Production**
```bash
# Build frontend for production
cd frontend
npm run build

# Start backend in production mode
cd backend
bun run start
```

### **Development Scripts**
```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev:all

# Build for production
npm run build:all

# Run tests (if implemented)
npm run test
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Getting Started**
1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 🚀 Push to the branch (`git push origin feature/amazing-feature`)
5. 📝 Open a Pull Request

### **Development Guidelines**
- 📝 Add comments to explain complex logic
- 🧪 Test your changes thoroughly
- 📖 Update documentation if needed
- 🎨 Follow existing code style

### **Areas for Contribution**
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Amazon** - For providing product data (educational purposes only)
- **Bun Team** - For the amazing JavaScript runtime
- **Vite Team** - For the lightning-fast build tool
- **Express.js** - For the robust web framework
- **Font Awesome** - For the beautiful icons
- **Google Fonts** - For the Inter font family

## 📞 Support & Community

### **Getting Help**
1. 📖 Check the [troubleshooting section](#-troubleshooting) above
2. 🔍 Search [existing issues](https://github.com/abrahao-dev/amazon-scraper/issues)
3. 🐛 Create a [new issue](https://github.com/abrahao-dev/amazon-scraper/issues/new) with details

### **Community**
- 💬 [Discussions](https://github.com/abrahao-dev/amazon-scraper/discussions)
- 📧 [Email Support](mailto:support@example.com)
- 🐦 [Twitter](https://twitter.com/abrahao_dev)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

**Happy Scraping! 🚀**

</div>