import { loadOrders, saveReview, saveProductReview } from './firebase-utils.js';

document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userEmail');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    // Show loading spinner
    const ordersContainer = document.querySelector('.orders-container');
    const loadingSpinner = document.getElementById('loadingSpinner');
    ordersContainer.classList.add('loading');
    loadingSpinner.classList.add('active');

    // Load orders from Firebase
    let orders = [];
    try {
        orders = await loadOrders(userId);
        console.log('Loaded orders:', orders);
    } catch (error) {
        console.error('Error loading orders:', error);
    } finally {
        // Hide loading spinner
        ordersContainer.classList.remove('loading');
        loadingSpinner.classList.remove('active');
    }

    // Function to display orders
    function displayOrders(status = 'all') {
        const ordersList = document.getElementById('ordersList');
        
        // Add validation to filter out invalid orders
        const validOrders = orders.filter(order => {
            return order.orderId && 
                   order.createdAt && 
                   order.items && 
                   Array.isArray(order.items) &&
                   order.total &&
                   order.status;
        });

        const filteredOrders = status === 'all' 
            ? validOrders 
            : validOrders.filter(order => order.status === status);

        if (filteredOrders.length === 0) {
            ordersList.innerHTML = '<div class="no-orders">No orders found</div>';
            return;
        }

        ordersList.innerHTML = filteredOrders.map(order => `
            <div class="order-card">
                <div class="order-id-section">
                    <div class="order-id-label">
                        <i class="fas fa-hashtag"></i>
                        <span class="order-id">${order.orderId}</span>
                    </div>
                    <div class="order-date">
                        <i class="far fa-calendar-alt"></i>
                        <span>${formatDate(order.createdAt)}</span>
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image || ''}" alt="${item.name}" class="item-image">
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-specs">
                                    <span class="item-size">${item.size || 'M'}</span>
                                </div>
                                <div class="item-quantity">Qty: ${item.quantity}</div>
                                <div class="item-price">${item.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: ${order.total}</div>
                    <div class="status-controls">
                        <span class="status-indicator status-${order.status}">
                            <i class="fas fa-circle"></i>
                            ${order.status}
                        </span>
                    </div>
                </div>
                ${order.status === 'delivered' ? `
                    <div class="review-section ${order.reviewed ? 'reviewed' : ''}">
                        ${order.reviewed ? `
                            <div class="review-content">
                                <div class="review-rating">
                                    ${generateStars(order.rating)}
                                </div>
                                <p class="review-text">${order.review}</p>
                                <span class="review-date">Reviewed on ${formatDate(order.reviewDate)}</span>
                            </div>
                        ` : `
                            <div class="review-form" data-order-id="${order.orderId}" data-product-id="${order.items[0].id}">
                                <h4>Write a Review for ${order.items[0].title}</h4>
                                <input type="hidden" class="product-info" 
                                    data-product-title="${order.items[0].title}"
                                    data-product-id="${order.items[0].id}">
                                <div class="rating-input">
                                    <span>Rating:</span>
                                    <div class="star-rating" data-order-id="${order.orderId}">
                                        <i class="far fa-star" data-rating="1"></i>
                                        <i class="far fa-star" data-rating="2"></i>
                                        <i class="far fa-star" data-rating="3"></i>
                                        <i class="far fa-star" data-rating="4"></i>
                                        <i class="far fa-star" data-rating="5"></i>
                                    </div>
                                </div>
                                <textarea 
                                    placeholder="Share your experience with this product..." 
                                    class="review-textarea"
                                    data-order-id="${order.orderId}"
                                ></textarea>
                                <button class="submit-review-btn" data-order-id="${order.orderId}">
                                    Submit Review
                                </button>
                            </div>
                        `}
                    </div>
                ` : ''}
            </div>
        `).join('');

        // Add event listeners for review functionality
        document.querySelectorAll('.star-rating').forEach(ratingContainer => {
            const stars = ratingContainer.querySelectorAll('i');
            stars.forEach(star => {
                star.addEventListener('click', () => handleStarClick(star, stars));
                star.addEventListener('mouseover', () => handleStarHover(star, stars));
                star.addEventListener('mouseout', () => resetStars(stars, ratingContainer.dataset.rating));
            });
        });

        document.querySelectorAll('.submit-review-btn').forEach(btn => {
            btn.addEventListener('click', handleReviewSubmit);
        });

        // Update order count
        document.querySelector('.order-count span').textContent = filteredOrders.length;
    }

    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    function generateStars(rating) {
        return Array(5).fill().map((_, index) => 
            `<i class="${index < rating ? 'fas' : 'far'} fa-star"></i>`
        ).join('');
    }

    function handleStarClick(clickedStar, stars) {
        const rating = clickedStar.dataset.rating;
        const container = clickedStar.closest('.star-rating');
        container.dataset.rating = rating;
        updateStars(stars, rating);
    }

    function handleStarHover(hoveredStar, stars) {
        const rating = hoveredStar.dataset.rating;
        updateStars(stars, rating);
    }

    function resetStars(stars, savedRating) {
        updateStars(stars, savedRating || 0);
    }

    function updateStars(stars, rating) {
        stars.forEach(star => {
            const starRating = star.dataset.rating;
            star.classList.toggle('fas', starRating <= rating);
            star.classList.toggle('far', starRating > rating);
        });
    }

    async function handleReviewSubmit(event) {
        const btn = event.target;
        btn.disabled = true;

        try {
            const reviewForm = btn.closest('.review-form');
            // Get product ID from the order's first item
            const productId = reviewForm.dataset.productId;
            const orderId = reviewForm.dataset.orderId;
            const userId = localStorage.getItem('userEmail');

            // Get rating and review text
            const rating = parseInt(reviewForm.querySelector('.star-rating').dataset.rating);
            const reviewText = reviewForm.querySelector('.review-textarea').value.trim();

            // Validate inputs
            if (!rating || !reviewText) {
                throw new Error('Please provide both rating and review text');
            }

            // Create review data
            const reviewData = {
                userId,
                orderId,
                productId,
                rating,
                review: reviewText,
                userName: localStorage.getItem('userName') || 'Anonymous',
                verified: true,
                createdAt: new Date().toISOString()
            };

            console.log('Submitting review:', reviewData); // Debug log

            // Save review data
            await saveProductReview(productId, reviewData);

            // Show success message
            reviewForm.innerHTML = `
                <div class="review-success">
                    <i class="fas fa-check-circle"></i>
                    <p>Review submitted successfully!</p>
                </div>`;

        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.message || 'Failed to submit review');
            btn.disabled = false;
        }
    }

    // Track current tab
    let currentTab = 'all';

    // Add tab functionality
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.status;
            displayOrders(currentTab);
        });
    });

    // Initialize display
    displayOrders();

    // Update cart count when page loads
    updateCartCount();
    
    // Listen for storage changes to update cart count
    window.addEventListener('storage', function(e) {
        if (e.key === 'cartItems') {
            updateCartCount();
        }
    });
});

// Add this function after the existing DOMContentLoaded event listener

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.length;
        cartCount.style.display = cartItems.length > 0 ? 'flex' : 'none';
    }
}