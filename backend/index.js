const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Scrapes Amazon search results for a given keyword
 * @param {string} keyword - The search keyword
 * @returns {Array} Array of product objects with title, rating, reviews, and image
 */
async function scrapeAmazonProducts(keyword) {
  try {
    // Add a small delay to be respectful to Amazon's servers
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Construct Amazon search URL with additional parameters to look more natural
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&ref=sr_pg_1`;

    // More realistic headers to avoid detection
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'DNT': '1',
      'Referer': 'https://www.amazon.com/',
    };

    // Fetch the page content with improved headers
    const response = await axios.get(searchUrl, {
      headers,
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: function (status) {
        return status < 500; // Accept all status codes less than 500
      }
    });

    // Parse HTML with JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Extract product data from search results
    const products = [];

    // Select product containers (Amazon's structure may vary, so we'll try multiple selectors)
    const productSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item',
      '.sg-col-inner'
    ];

    let productElements = [];
    for (const selector of productSelectors) {
      productElements = document.querySelectorAll(selector);
      if (productElements.length > 0) break;
    }

    // Process each product element
    productElements.forEach((element, index) => {
      try {
        // Extract product title
        const titleElement = element.querySelector('h2 a span') ||
          element.querySelector('.a-text-normal') ||
          element.querySelector('[data-cy="title-recipe"]');
        const title = titleElement ? titleElement.textContent.trim() : 'Title not available';

        // Extract rating
        const ratingElement = element.querySelector('.a-icon-alt') ||
          element.querySelector('[aria-label*="stars"]');
        let rating = 'No rating';
        if (ratingElement) {
          const ratingText = ratingElement.textContent || ratingElement.getAttribute('aria-label');
          const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)\s*out\s*of\s*5/);
          rating = ratingMatch ? ratingMatch[1] : 'No rating';
        }

        // Extract number of reviews
        const reviewsElement = element.querySelector('a[href*="customerReviews"]') ||
          element.querySelector('[aria-label*="reviews"]');
        let reviews = 'No reviews';
        if (reviewsElement) {
          const reviewsText = reviewsElement.textContent || reviewsElement.getAttribute('aria-label');
          const reviewsMatch = reviewsText.match(/(\d+(?:,\d+)*)/);
          reviews = reviewsMatch ? reviewsMatch[1] : 'No reviews';
        }

        // Extract product image URL
        const imageElement = element.querySelector('img.s-image') ||
          element.querySelector('img[data-image-latency]');
        const imageUrl = imageElement ? imageElement.src || imageElement.getAttribute('data-src') : 'No image';

        // Only add products that have at least a title
        if (title !== 'Title not available') {
          products.push({
            id: index + 1,
            title,
            rating,
            reviews,
            imageUrl
          });
        }
      } catch (error) {
        console.error(`Error processing product ${index}:`, error.message);
      }
    });

    // If we got products, return them
    if (products.length > 0) {
      return products.slice(0, 20); // Limit to first 20 products
    }

    // If no products found, try alternative approach
    console.log('No products found with primary method, trying alternative selectors...');

    // Try alternative selectors for different Amazon layouts
    const altSelectors = [
      '.s-result-item[data-component-type="s-search-result"]',
      '.sg-col-inner .s-result-item',
      '[data-asin]',
      '.s-card-container'
    ];

    for (const selector of altSelectors) {
      const altElements = document.querySelectorAll(selector);
      if (altElements.length > 0) {
        console.log(`Found ${altElements.length} products with selector: ${selector}`);

        altElements.forEach((element, index) => {
          try {
            // Simplified extraction for alternative layout
            const titleElement = element.querySelector('h2, .a-text-normal, [data-cy="title-recipe"]');
            const title = titleElement ? titleElement.textContent.trim() : 'Title not available';

            if (title !== 'Title not available') {
              products.push({
                id: index + 1,
                title,
                rating: 'Rating not available',
                reviews: 'Reviews not available',
                imageUrl: 'No image'
              });
            }
          } catch (error) {
            console.error(`Error processing alternative product ${index}:`, error.message);
          }
        });

        if (products.length > 0) {
          return products.slice(0, 20);
        }
      }
    }

    // If still no products, return a helpful message
    return [{
      id: 1,
      title: 'No products found - Amazon may be blocking requests',
      rating: 'N/A',
      reviews: 'N/A',
      imageUrl: 'No image'
    }];

  } catch (error) {
    console.error('Error scraping Amazon:', error.message);

    // Check if it's a 503 error (Amazon blocking)
    if (error.response && error.response.status === 503) {
      throw new Error('Amazon is currently blocking automated requests. Please try again later or use a different search term.');
    }

    // Check if it's a timeout
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }

    throw new Error(`Failed to scrape Amazon: ${error.message}`);
  }
}

// Demo data for when Amazon blocks requests
function getDemoProducts(keyword) {
  const demoProducts = {
    'laptop': [
      {
        id: 1,
        title: 'Dell XPS 13 Laptop - 13.4" FHD+ Display, Intel Core i7-1250U, 16GB RAM, 512GB SSD',
        rating: '4.5',
        reviews: '2,847',
        imageUrl: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UY218_.jpg'
      },
      {
        id: 2,
        title: 'MacBook Air M2 Chip - 13.6" Liquid Retina Display, 8GB RAM, 256GB SSD',
        rating: '4.7',
        reviews: '1,234',
        imageUrl: 'https://m.media-amazon.com/images/I/71an9eiBxpL._AC_UY218_.jpg'
      },
      {
        id: 3,
        title: 'HP Pavilion 15 Laptop - 15.6" FHD Display, AMD Ryzen 7, 16GB RAM, 512GB SSD',
        rating: '4.3',
        reviews: '956',
        imageUrl: 'https://m.media-amazon.com/images/I/71h6PpXml9L._AC_UY218_.jpg'
      }
    ],
    'headphones': [
      {
        id: 1,
        title: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
        rating: '4.6',
        reviews: '3,421',
        imageUrl: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_UY218_.jpg'
      },
      {
        id: 2,
        title: 'Bose QuietComfort 45 Wireless Bluetooth Headphones',
        rating: '4.5',
        reviews: '2,156',
        imageUrl: 'https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UY218_.jpg'
      },
      {
        id: 3,
        title: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
        rating: '4.4',
        reviews: '1,789',
        imageUrl: 'https://m.media-amazon.com/images/I/71bhWgQK-cL._AC_UY218_.jpg'
      }
    ],
    'dell g15': [
      {
        id: 1,
        title: 'Dell G15 Gaming Laptop - 15.6" FHD 165Hz Display, Intel Core i7-12700H, RTX 3060',
        rating: '4.4',
        reviews: '1,234',
        imageUrl: 'https://m.media-amazon.com/images/I/71an9eiBxpL._AC_UY218_.jpg'
      },
      {
        id: 2,
        title: 'Dell G15 5520 Gaming Laptop - 15.6" FHD Display, Intel Core i5-12500H, RTX 3050',
        rating: '4.2',
        reviews: '856',
        imageUrl: 'https://m.media-amazon.com/images/I/71h6PpXml9L._AC_UY218_.jpg'
      },
      {
        id: 3,
        title: 'Dell G15 5515 Gaming Laptop - 15.6" FHD Display, AMD Ryzen 7 5800H, RTX 3060',
        rating: '4.3',
        reviews: '743',
        imageUrl: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_UY218_.jpg'
      }
    ]
  };

  // Return demo data for the keyword, or generic data if not found
  return demoProducts[keyword.toLowerCase()] || demoProducts['laptop'];
}

// API Routes
app.get('/api/scrape', async (req, res) => {
  try {
    const { keyword, demo } = req.query;

    // Validate keyword parameter
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Keyword parameter is required'
      });
    }

    console.log(`Scraping Amazon for keyword: "${keyword}"`);

    let products;

    // If demo mode is requested, return demo data
    if (demo === 'true') {
      products = getDemoProducts(keyword.trim());
      console.log('Using demo data');
    } else {
      // Try to scrape real data
      try {
        products = await scrapeAmazonProducts(keyword.trim());
      } catch (error) {
        console.log('Real scraping failed, falling back to demo data');
        products = getDemoProducts(keyword.trim());
      }
    }

    res.json({
      success: true,
      keyword: keyword.trim(),
      count: products.length,
      products,
      demo: demo === 'true' || products[0]?.title.includes('demo')
    });

  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Amazon Scraper API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Amazon Scraper Backend running on http://localhost:${PORT}`);
  console.log(`📊 Scrape endpoint: http://localhost:${PORT}/api/scrape?keyword=yourKeyword`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});