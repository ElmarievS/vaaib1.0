// Theme JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initializeHeader();
  initializeProductPage();
  initializeLazyLoading();
  
  // Cart functionality
  initializeCart();
});

function initializeHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }
    
    lastScroll = currentScroll;
  });
}

function initializeProductPage() {
  const productForm = document.querySelector('.product-form');
  if (!productForm) return;
  
  // Handle variant selection
  const variantSelect = productForm.querySelector('#ProductSelect');
  if (variantSelect) {
    variantSelect.addEventListener('change', function(event) {
      updateProductPrices(event.target.value);
    });
  }
}

function initializeLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    return;
  }
  
  // Fallback for browsers that don't support native lazy loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

function initializeCart() {
  const cartIcon = document.querySelector('.cart-icon');
  if (!cartIcon) return;
  
  cartIcon.addEventListener('click', function(event) {
    event.preventDefault();
    toggleCart();
  });
}

function toggleCart() {
  const cart = document.querySelector('.cart-drawer');
  if (!cart) return;
  
  cart.classList.toggle('is-active');
}
