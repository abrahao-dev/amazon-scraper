// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// DOM Elements
const elements = {
  keywordInput: document.getElementById('keywordInput'),
  searchBtn: document.getElementById('searchBtn'),
  loadingState: document.getElementById('loadingState'),
  errorState: document.getElementById('errorState'),
  resultsSection: document.getElementById('resultsSection'),
  productsGrid: document.getElementById('productsGrid'),
  noResults: document.getElementById('noResults'),
  resultsTitle: document.getElementById('resultsTitle'),
  resultsCount: document.getElementById('resultsCount'),
  searchKeyword: document.getElementById('searchKeyword'),
  errorMessage: document.getElementById('errorMessage'),
  retryBtn: document.getElementById('retryBtn')
};

// State Management
let currentKeyword = '';
let isLoading = false;

/**
 * Shows a specific UI state and hides others
 * @param {string} state - The state to show ('loading', 'error', 'results', 'search')
 */
function showState(state) {
  // Hide all states first
  elements.loadingState.classList.add('hidden');
  elements.errorState.classList.add('hidden');
  elements.resultsSection.classList.add('hidden');
  elements.noResults.classList.add('hidden');

  // Show the requested state
  switch (state) {
    case 'loading':
      elements.loadingState.classList.remove('hidden');
      break;
    case 'error':
      elements.errorState.classList.remove('hidden');
      break;
    case 'results':
      elements.resultsSection.classList.remove('hidden');
      break;
    case 'search':
      // Default state - just hide other states
      break;
  }
}

/**
 * Updates the search button state
 * @param {boolean} disabled - Whether to disable the button
 */
function updateSearchButton(disabled) {
  elements.searchBtn.disabled = disabled;
  isLoading = disabled;
}

/**
 * Formats a number with commas
 * @param {string|number} num - The number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  if (typeof num === 'string') {
    // Remove any non-numeric characters except commas and dots
    num = num.replace(/[^\d,.]/g, '');
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Creates a star rating display
 * @param {string} rating - The rating value
 * @returns {string} HTML for star rating
 */
function createStarRating(rating) {
  if (rating === 'No rating') return '<span>No rating</span>';

  const numRating = parseFloat(rating);
  if (isNaN(numRating)) return '<span>No rating</span>';

  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  // Half star
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return `${starsHTML} <span>${rating}</span>`;
}

/**
 * Creates a product card HTML element
 * @param {Object} product - Product data
 * @returns {string} HTML for product card
 */
function createProductCard(product) {
  const { id, title, rating, reviews, imageUrl } = product;

  return `
        <div class="product-card" data-product-id="${id}">
            <img
                src="${imageUrl !== 'No image' ? imageUrl : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEMjM5NDEiLz4KPHBhdGggZD0iTTEwMCAxMTBDMTA1LjUyMyAxMTAgMTEwIDEwNS41MjMgMTEwIDEwMEMxMTAgOTQuNDc3IDEwNS41MjMgOTAgMTAwIDkwQzk0LjQ3NyA5MCA5MCA5NC40NzcgOTAgMTAwQzkwIDEwNS41MjMgOTQuNDc3IDExMCAxMDAgMTEwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+'}"
                alt="${title}"
                class="product-image"
                onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEMjM5NDEiLz4KPHBhdGggZD0iTTEwMCAxMTBDMTA1LjUyMyAxMTAgMTEwIDEwNS41MjMgMTEwIDEwMEMxMTAgOTQuNDc3IDEwNS41MjMgOTAgMTAwIDkwQzk0LjQ3NyA5MCA5MCA5NC40NzcgOTAgMTAwQzkwIDEwNS41MjMgOTQuNDc3IDExMCAxMDAgMTEwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+'"
            >
            <h3 class="product-title">${title}</h3>
            <div class="product-meta">
                <div class="product-rating">
                    ${createStarRating(rating)}
                </div>
                <div class="product-reviews">
                    <i class="fas fa-comments"></i>
                    <span>${formatNumber(reviews)}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Displays search results
 * @param {Object} data - API response data
 */
function displayResults(data) {
  const { keyword, count, products, demo } = data;

  // Update header information
  let titleText = `Search Results for "${keyword}"`;
  if (demo) {
    titleText += ' (Demo Data)';
  }
  elements.resultsTitle.textContent = titleText;

  let countText = `${count} product${count !== 1 ? 's' : ''} found`;
  if (demo) {
    countText += ' (Demo Mode)';
  }
  elements.resultsCount.textContent = countText;
  elements.searchKeyword.textContent = `Keyword: "${keyword}"`;

  // Clear previous results
  elements.productsGrid.innerHTML = '';

  if (products && products.length > 0) {
    // Create and append product cards
    const productsHTML = products.map(createProductCard).join('');
    elements.productsGrid.innerHTML = productsHTML;

    // Show results
    showState('results');

    // Show demo notice if using demo data
    if (demo) {
      const demoNotice = document.createElement('div');
      demoNotice.className = 'demo-notice';
      demoNotice.innerHTML = `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; text-align: center;">
          <i class="fas fa-info-circle" style="color: #856404; margin-right: 0.5rem;"></i>
          <strong>Demo Mode:</strong> Amazon is currently blocking automated requests.
          This is sample data to demonstrate the application functionality.
        </div>
      `;
      elements.resultsSection.insertBefore(demoNotice, elements.resultsSection.firstChild);
    }
  } else {
    // Show no results message
    elements.noResults.classList.remove('hidden');
    showState('results');
  }
}

/**
 * Displays error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
  elements.errorMessage.textContent = message;
  showState('error');
}

/**
 * Makes API call to scrape Amazon products
 * @param {string} keyword - Search keyword
 * @returns {Promise} API response
 */
async function scrapeProducts(keyword) {
  try {
    // First try real scraping
    const response = await fetch(`${API_BASE_URL}/api/scrape?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Unknown error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please make sure the backend is running on port 3000.');
    }

    // If real scraping fails, try demo mode
    console.log('Real scraping failed, trying demo mode...');
    try {
      const demoResponse = await fetch(`${API_BASE_URL}/api/scrape?keyword=${encodeURIComponent(keyword)}&demo=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      if (demoResponse.ok) {
        const demoData = await demoResponse.json();
        if (demoData.success) {
          console.log('Using demo data');
          return demoData;
        }
      }
    } catch (demoError) {
      console.error('Demo mode also failed:', demoError);
    }

    throw new Error(error.message || 'Failed to scrape products. Please try again.');
  }
}

/**
 * Handles the search process
 * @param {string} keyword - Search keyword
 */
async function handleSearch(keyword) {
  if (isLoading) return;

  try {
    // Update UI state
    updateSearchButton(true);
    showState('loading');
    currentKeyword = keyword;

    // Make API call
    const data = await scrapeProducts(keyword);

    // Display results
    displayResults(data);

  } catch (error) {
    console.error('Search Error:', error);
    displayError(error.message);
  } finally {
    updateSearchButton(false);
  }
}

/**
 * Validates search input
 * @param {string} keyword - Search keyword
 * @returns {boolean} Whether the input is valid
 */
function validateInput(keyword) {
  if (!keyword || keyword.trim() === '') {
    displayError('Please enter a search keyword');
    return false;
  }

  if (keyword.trim().length < 2) {
    displayError('Search keyword must be at least 2 characters long');
    return false;
  }

  return true;
}

// Event Listeners

/**
 * Handles search button click
 */
function handleSearchClick() {
  const keyword = elements.keywordInput.value.trim();

  if (validateInput(keyword)) {
    handleSearch(keyword);
  }
}

/**
 * Handles Enter key press in search input
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyPress(event) {
  if (event.key === 'Enter' && !isLoading) {
    handleSearchClick();
  }
}

/**
 * Handles retry button click
 */
function handleRetryClick() {
  if (currentKeyword) {
    handleSearch(currentKeyword);
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Search button click
  elements.searchBtn.addEventListener('click', handleSearchClick);

  // Enter key press in search input
  elements.keywordInput.addEventListener('keypress', handleKeyPress);

  // Retry button click
  elements.retryBtn.addEventListener('click', handleRetryClick);

  // Focus on search input for better UX
  elements.keywordInput.focus();

  console.log('🚀 Amazon Scraper Frontend initialized');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
});

// Export functions for potential external use
window.AmazonScraper = {
  handleSearch,
  displayResults,
  displayError
};