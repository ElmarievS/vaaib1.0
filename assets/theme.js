// Predictive Search
const predictiveSearch = {
  init() {
    this.searchInput = document.querySelector('[data-predictive-search-input]');
    this.resultsContainer = document.querySelector('[data-predictive-search-results]');
    this.loadingContainer = document.querySelector('[data-predictive-search-loading]');
    
    if (!this.searchInput) return;
    
    this.setupEventListeners();
  },

  setupEventListeners() {
    this.searchInput.addEventListener('input', this.debounce(() => {
      this.performSearch();
    }, 300));

    document.querySelector('[data-predictive-search-close]')
      .addEventListener('click', () => this.closeSearch());
  },

  async performSearch() {
    const searchTerm = this.searchInput.value.trim();
    
    if (searchTerm.length < 3) {
      this.resultsContainer.innerHTML = '';
      return;
    }

    this.showLoading();

    try {
      const response = await fetch(`/search/suggest.json?q=${searchTerm}&resources[type]=product&resources[limit]=4`);
      const data = await response.json();
      
      this.renderResults(data);
    } catch (error) {
      console.error('Search error:', error);
      this.resultsContainer.innerHTML = '<p>An error occurred. Please try again.</p>';
    }

    this.hideLoading();
  },

  renderResults(data) {
    if (!data.resources.results.products.length) {
      this.resultsContainer.innerHTML = '<p>No results found</p>';
      return;
    }

    const products = data.resources.results.products;
    const html = `
      <div class="predictive-search__products">
        ${products.map(product => `
          <a href="${product.url}" class="predictive-search__item">
            <div class="predictive-search__image">
              <img src="${product.image || ''}" 
                   alt="${product.title}"
                   width="50"
                   height="50"
                   loading="lazy">
            </div>
            <div class="predictive-search__info">
              <div class="predictive-search__title">${product.title}</div>
              <div class="predictive-search__price">${this.formatMoney(product.price)}</div>
            </div>
          </a>
        `).join('')}
      </div>
      <a href="/search?q=${this.searchInput.value}" class="predictive-search__view-all">
        View all results
      </a>
    `;

    this.resultsContainer.innerHTML = html;
  },

  showLoading() {
    this.loadingContainer.style.display = 'flex';
  },

  hideLoading() {
    this.loadingContainer.style.display = 'none';
  },

  closeSearch() {
    this.searchInput.value = '';
    this.resultsContainer.innerHTML = '';
    document.querySelector('.predictive-search').classList.remove('is-active');
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  formatMoney(cents) {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  predictiveSearch.init();
});
