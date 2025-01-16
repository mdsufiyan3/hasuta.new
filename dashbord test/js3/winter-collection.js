import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Stock status constants
const STOCK_STATUS = {
    IN_STOCK: 'in-stock',
    LOW_STOCK: 'low-stock',
    OUT_OF_STOCK: 'out-of-stock'
};

// Initialize products state
let currentProducts = JSON.parse(localStorage.getItem('stockStatus')) || {};

// DOM Elements
const stockEditOverlay = document.getElementById('stockEditOverlay');
const stockSelect = document.getElementById('editStockStatus');
const statusCounters = {
    inStock: document.getElementById('inStockCount'),
    lowStock: document.getElementById('lowStockCount'),
    outStock: document.getElementById('outStockCount'),
    total: document.getElementById('totalCount')
};

// Save stock status to localStorage
function saveStockStatus(productId, status) {
    currentProducts[productId] = status;
    localStorage.setItem('stockStatus', JSON.stringify(currentProducts));
    updateStatusCounters();
}

// Load saved stock statuses
function loadStockStatus() {
    const savedStatus = JSON.parse(localStorage.getItem('stockStatus')) || {};
    Object.entries(savedStatus).forEach(([productId, status]) => {
        updateProductStatus(productId, status);
    });
    updateStatusCounters();
}

// Update product status in the DOM
function updateProductStatus(productId, status) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        const stockStatus = productCard.querySelector('.stock-status');
        stockStatus.className = `stock-status ${status}`;
        stockStatus.textContent = getStatusText(status);
    }
}

// Get human-readable status text
function getStatusText(status) {
    switch(status) {
        case STOCK_STATUS.IN_STOCK:
            return 'In Stock';
        case STOCK_STATUS.LOW_STOCK:
            return 'Low Stock';
        case STOCK_STATUS.OUT_OF_STOCK:
            return 'Out of Stock';
        default:
            return 'Unknown';
    }
}

// Update status counters in the UI
function updateStatusCounters() {
    // Initialize counters
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const totalCount = document.querySelectorAll('.product-card').length;

    // Query all product cards and count by status
    document.querySelectorAll('.product-card').forEach(product => {
        const statusElement = product.querySelector('.stock-status');
        if (statusElement.classList.contains('in-stock')) {
            inStockCount++;
        } else if (statusElement.classList.contains('low-stock')) {
            lowStockCount++;
        } else if (statusElement.classList.contains('out-of-stock')) {
            outOfStockCount++;
        }
    });

    // Update the counter displays
    if (statusCounters.inStock) {
        statusCounters.inStock.textContent = inStockCount;
    }
    if (statusCounters.lowStock) {
        statusCounters.lowStock.textContent = lowStockCount;
    }
    if (statusCounters.outStock) {
        statusCounters.outStock.textContent = outOfStockCount;
    }
    if (statusCounters.total) {
        statusCounters.total.textContent = totalCount;
    }

    // Store counts in localStorage
    const stockCounts = {
        inStock: inStockCount,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        total: totalCount
    };
    localStorage.setItem('stockCounts', JSON.stringify(stockCounts));
}

// Handle stock edit modal
function handleStockEdit(productId) {
    const overlay = stockEditOverlay;
    const closeBtn = overlay.querySelector('.close-modal');
    const updateBtn = overlay.querySelector('.update-stock-btn');
    
    // Show overlay
    overlay.classList.add('active');
    
    // Pre-select current status if exists
    if (currentProducts[productId]) {
        stockSelect.value = currentProducts[productId];
    }
    
    // Update stock handler
    const updateHandler = () => {
        const newStatus = stockSelect.value;
        updateProductStatus(productId, newStatus);
        saveStockStatus(productId, newStatus);
        updateStatusCounters(); // Add this line
        closeOverlay();
    };
    
    // Close overlay handler
    const closeOverlay = () => {
        overlay.classList.remove('active');
        cleanup();
    };
    
    // Event listeners
    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });
    updateBtn.addEventListener('click', updateHandler);
    
    // Cleanup function
    const cleanup = () => {
        closeBtn.removeEventListener('click', closeOverlay);
        updateBtn.removeEventListener('click', updateHandler);
        overlay.removeEventListener('click', closeOverlay);
    };
}

// Reset product data
function resetProductData() {
    if (confirm('Are you sure you want to reset all product data?')) {
        localStorage.removeItem('stockStatus');
        currentProducts = {};
        location.reload();
    }
}

// Add new function for filtering products
function filterProductsByStatus(status) {
    const allProducts = document.querySelectorAll('.product-card');
    const filterCards = document.querySelectorAll('.filter-card');
    
    // Remove active class from all filter cards
    filterCards.forEach(card => card.classList.remove('active-filter'));
    
    if (status === 'total' || status === 'all') {
        // Show all products
        allProducts.forEach(product => product.style.display = 'flex');
        const totalFilter = document.querySelector('[data-status="total"]');
        if (totalFilter) totalFilter.classList.add('active-filter');
        return;
    }
    
    // Add active class to selected filter
    const selectedFilter = document.querySelector(`[data-status="${status}"]`);
    if (selectedFilter) {
        selectedFilter.classList.add('active-filter');
    }
    
    // Filter products
    allProducts.forEach(product => {
        const productStatus = product.querySelector('.stock-status').classList.contains(status);
        product.style.display = productStatus ? 'flex' : 'none';
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load saved stock statuses
    loadStockStatus();
    
    // Add stock edit button handlers
    document.querySelectorAll('.stock-edit-icon').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = button.dataset.productId;
            handleStockEdit(productId);
        });
    });
    // Add reset button handler
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetProductData);
    }

    // Add click handlers to filter cards
    document.querySelectorAll('.filter-card').forEach(card => {
        card.addEventListener('click', () => {
            const status = card.dataset.status;
            filterProductsByStatus(status || 'all');
        });
    });
    
    // Add reset filter functionality to logo click
    document.querySelector('.logo').addEventListener('click', (e) => {
        e.preventDefault();
        filterProductsByStatus('all');
    });

    // Initial counter update
    updateStatusCounters();
    
    // Update counters after any stock status change
    const observer = new MutationObserver(() => {
        updateStatusCounters();
    });
    
    // Observe stock status changes
    document.querySelectorAll('.stock-status').forEach(status => {
        observer.observe(status, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    });
});

// Export necessary functions if needed
export {
    handleStockEdit,
    resetProductData,
    updateStatusCounters
};
