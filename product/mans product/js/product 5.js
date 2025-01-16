import { auth, db } from '/js/firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function showLoading() {
    document.querySelector('.loading-overlay').style.opacity = '1';
    document.querySelector('.loading-overlay').style.visibility = 'visible';
}

function hideLoading() {
    document.querySelector('.loading-overlay').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.loading-overlay').style.visibility = 'hidden';
    }, 500);
}

function updateHeaderCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Toast notification function
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add this function at the top level
function checkUserRole() {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const productOwnerId = localStorage.getItem('productOwnerId');
    
    // Check if user is the admin or the product owner
    return userEmail === 'abufiyan8@gmail.com' || 
           userRole === 'admin' || 
           (userRole === 'owner' && userId === productOwnerId);
}

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Load product details (replace with your actual data fetching logic)
    loadProductDetails(productId);

    // Add click handlers for size buttons
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            // Remove active class from all buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Store selected size
            const selectedSize = button.dataset.size;
            // Optional: You can use this selectedSize value when adding to cart
        });
    });

    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    document.getElementById('decreaseQuantity').addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    document.getElementById('increaseQuantity').addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });

    // Add to Cart functionality
    document.getElementById('addToCart').addEventListener('click', async function() {
        const addToCartBtn = this;
        try {
            // Check if user is logged in
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                window.location.href = '/login.html';
                return;
            }

            // Check if size is selected
            const selectedSize = document.querySelector('.size-btn.selected');
            if (!selectedSize) {
                showToast('Please select a size');
                return;
            }

            // Add loading state
            addToCartBtn.classList.add('btn-loading');
            addToCartBtn.disabled = true;

            // Get product details
            const product = {
                id: productId,
                title: document.getElementById('productTitle').textContent,
                price: document.getElementById('productPrice').textContent,
                size: selectedSize.dataset.size,
                quantity: parseInt(document.getElementById('quantity').value),
                image: document.getElementById('mainImage').src,
                addedAt: new Date().toISOString()
            };

            // Simulate network delay (remove in production)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Save to localStorage
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push(product);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Save to Firebase
            const cartRef = doc(db, `users/${userEmail}/cart/data`);
            const cartDoc = await getDoc(cartRef);
            let firebaseCartItems = cartDoc.exists() ? cartDoc.data().items || [] : [];
            
            firebaseCartItems.push(product);
            
            await setDoc(cartRef, {
                items: firebaseCartItems,
                updatedAt: new Date().toISOString()
            });

            updateHeaderCartCount();
            showToast('Added to cart successfully!');

        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Failed to add to cart. Please try again.');
        } finally {
            // Remove loading state
            addToCartBtn.classList.remove('btn-loading');
            addToCartBtn.disabled = false;
        }
    });

    // Buy Now
    const buyNowBtn = document.getElementById('buyNow');
    buyNowBtn.addEventListener('click', handleBuyNow);

    // Specifications toggle
    const toggleSpecs = document.getElementById('toggleSpecs');
    const specsContent = document.getElementById('specsContent');
    
    document.querySelector('.product-specifications h3').addEventListener('click', function() {
        // Toggle the rotate class for the icon
        toggleSpecs.classList.toggle('rotate');
        
        // Toggle content visibility
        if (specsContent.style.display === 'none') {
            specsContent.style.display = 'block';
        } else {
            specsContent.style.display = 'none';
        }
    });

    // Help section toggle
    const toggleHelp = document.getElementById('toggleHelp');
    const helpContent = document.getElementById('helpContent');
    
    document.querySelector('.help-section h3').addEventListener('click', function() {
        // Toggle the rotate class for the icon
        toggleHelp.classList.toggle('rotate');
        
        // Toggle content visibility with animation
        if (helpContent.style.display === 'none') {
            helpContent.style.display = 'block';
            setTimeout(() => {
                helpContent.style.opacity = '1';
                helpContent.style.transform = 'translateY(0)';
            }, 10);
        } else {
            helpContent.style.opacity = '0';
            helpContent.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                helpContent.style.display = 'none';
            }, 300);
        }
    });

    // Optional: Add click handlers for help items
    const helpItems = document.querySelectorAll('.help-item');
    helpItems.forEach(item => {
        item.addEventListener('click', function() {
            const helpType = this.querySelector('.help-label').textContent.trim();
            handleHelpItemClick(helpType);
        });
    });

    // View all reviews button handler
    const viewAllBtn = document.querySelector('.view-all-reviews');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const reviewsOverlay = document.getElementById('reviewsOverlay');
            const reviewsList = reviewsOverlay.querySelector('.reviews-overlay-list');

            // Clear existing content
            reviewsList.innerHTML = '';

            // Clone existing reviews
            const existingReviews = document.querySelectorAll('.reviews-container .review-item');
            existingReviews.forEach(review => {
                reviewsList.appendChild(review.cloneNode(true));
            });

            // Add additional reviews
            additionalReviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-item';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <div class="review-user">
                            <div class="user-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-info">
                                <div class="user-name">${review.name}</div>
                                <div class="review-date">${review.date}</div>
                            </div>
                        </div>
                        <div class="review-rating">
                            ${getStarRating(review.rating)}
                        </div>
                    </div>
                    <div class="review-content" data-collapsed="true">
                        <p>${review.content}</p>
                        <button class="show-more-btn">
                            <span>Show more</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    ${review.verified ? `
                        <div class="verified-badge">
                            <i class="fas fa-check-circle"></i>
                            <span>Verified Purchase</span>
                        </div>
                    ` : ''}
                `;
                reviewsList.appendChild(reviewElement);
            });

            // Show overlay
            reviewsOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling

            // Initialize show more functionality for new reviews
            initializeReviewContent();
        });
    }

    // Add this helper function for star rating if not already present
    function getStarRating(rating) {
        return Array(5).fill().map((_, index) => 
            `<i class="fas fa-star${index + 1 <= rating ? '' : (index + 0.5 === rating ? '-half-alt' : '-empty')}"></i>`
        ).join('');
    }

    // Handle video functionality
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const video = item.querySelector('.product-video');
        const playButton = item.querySelector('.video-play-button');
        const durationDisplay = item.querySelector('.video-duration');

        // Update video duration once metadata is loaded
        video.addEventListener('loadedmetadata', function() {
            const minutes = Math.floor(video.duration / 60);
            const seconds = Math.floor(video.duration % 60);
            durationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        });

        // Handle play/pause
        playButton.addEventListener('click', function() {
            if (video.paused) {
                // Pause all other videos first
                document.querySelectorAll('.product-video').forEach(v => {
                    if (v !== video) {
                        v.pause();
                        v.parentElement.querySelector('.fa-pause')?.classList.replace('fa-pause', 'fa-play');
                    }
                });

                // Play this video
                video.play();
                playButton.querySelector('i').classList.replace('fa-play', 'fa-pause');
            } else {
                video.pause();
                playButton.querySelector('i').classList.replace('fa-pause', 'fa-play');
            }
        });

        // Update play button when video ends
        video.addEventListener('ended', function() {
            playButton.querySelector('i').classList.replace('fa-pause', 'fa-play');
            video.currentTime = 0;
        });

        // Optional: Add hover preview
        item.addEventListener('mouseenter', function() {
            if (video.paused) {
                video.currentTime = 0;
                video.play();
                setTimeout(() => {
                    video.pause();
                }, 2000); // Preview for 2 seconds
            }
        });
    });

    updateHeaderCartCount();

    initializeVideoPlayers();

    // Add overlay close functionality
    const closeReviewsOverlay = document.getElementById('closeReviewsOverlay');
    const reviewsOverlay = document.getElementById('reviewsOverlay');

    if (closeReviewsOverlay) {
        closeReviewsOverlay.addEventListener('click', () => {
            reviewsOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Close overlay when clicking outside content
    if (reviewsOverlay) {
        reviewsOverlay.addEventListener('click', (e) => {
            if (e.target === reviewsOverlay) {
                reviewsOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Close overlay with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reviewsOverlay.classList.contains('active')) {
            reviewsOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Add this after existing DOMContentLoaded code
    const headerEditIcon = document.querySelector('.nav-icon.edit-icon');
    const mainImageEditBtn = document.querySelector('.edit-image-btn');
    const specsEditBtn = document.querySelector('.edit-specs-btn');
    
    // Check user role and show/hide edit buttons accordingly
    if (checkUserRole()) {
        headerEditIcon.style.display = 'flex';
    } else {
        headerEditIcon.style.display = 'none';
        mainImageEditBtn.style.display = 'none';
        specsEditBtn.style.display = 'none';
    }
    
    headerEditIcon.addEventListener('click', function(e) {
        e.preventDefault();
        if (!checkUserRole()) {
            showToast('You do not have permission to edit this product');
            return;
        }
        
        const isActive = !this.classList.contains('active');
        
        // Toggle both edit buttons
        mainImageEditBtn.style.display = isActive ? 'flex' : 'none';
        specsEditBtn.style.display = isActive ? 'flex' : 'none';
        
        // Toggle active state
        this.classList.toggle('active');
    });

    // Hide edit buttons when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-icon.edit-icon') && 
            !e.target.closest('.edit-image-btn') && 
            !e.target.closest('.edit-specs-btn') &&
            !e.target.closest('.spec-edit-input') &&
            !e.target.closest('.spec-edit-save-btn')) {
            mainImageEditBtn.style.display = 'none';
            specsEditBtn.style.display = 'none';
            headerEditIcon.classList.remove('active');
        }
    });

    initializeProductEdit();

    // Initialize specifications editing
    initializeSpecsEdit();

    // Initialize carousel after loading product details
    initializeCarousel();

    initializeReviewsEdit();

    initializeReviewSelection();

    initializeReviewContent();

    // Add reviews toggle functionality
    const toggleReviews = document.querySelector('.toggle-reviews');
    const reviewsContent = document.querySelector('.reviews-content');
    
    if (toggleReviews && reviewsContent) {
        // Show content initially
        reviewsContent.style.display = 'block';
        
        toggleReviews.addEventListener('click', () => {
            toggleReviews.classList.toggle('active');
            
            if (reviewsContent.style.display === 'none') {
                reviewsContent.style.display = 'block';
                requestAnimationFrame(() => {
                    reviewsContent.style.opacity = '1';
                    reviewsContent.style.maxHeight = '2000px'; // Adjust based on content
                });
            } else {
                reviewsContent.style.opacity = '0';
                reviewsContent.style.maxHeight = '0';
                setTimeout(() => {
                    reviewsContent.style.display = 'none';
                }, 300);
            }
        });
    }

    // Initialize brand metrics animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const metrics = entry.target.querySelectorAll('.metric-fill');
                metrics.forEach(metric => {
                    const width = metric.style.width;
                    metric.style.width = '0';
                    setTimeout(() => {
                        metric.style.width = width;
                    }, 100);
                });
                metricsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const brandMetrics = document.querySelector('.brand-metrics');
    if (brandMetrics) {
        metricsObserver.observe(brandMetrics);
    }

    initializeReviewImages();

    initializeGalaxyAnimation();
});

// Add these new functions after the existing code
function saveProductToLocalStorage(productId, data) {
    const storageKey = `product_5_${productId}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function getProductFromLocalStorage(productId) {
    const storageKey = `product_5_${productId}`;
    const savedData = localStorage.getItem(storageKey);
    return savedData ? JSON.parse(savedData) : null;
}

// Modify the loadProductDetails function
async function loadProductDetails(productId) {
    showLoading();
    try {
        // First check localStorage for saved changes
        const savedProduct = getProductFromLocalStorage(productId);
        const productData = savedProduct || await fetchProductData(productId);
        
        if (!productData) {
            throw new Error('Product not found');
        }
        
        // Update UI with product details
        document.getElementById('productCategory').textContent = productData.category;
        document.getElementById('productTitle').textContent = productData.title;
        document.getElementById('productPrice').textContent = productData.price;
        document.getElementById('mainImage').src = productData.images[0];

        // Update stock status if available
        if (productData.stockStatus) {
            updateStockStatusDisplay(productData.stockStatus.status);
        }

        // Update size availability if available
        if (productData.sizes) {
            updateSizeButtonsAvailability(productData.stockStatus?.status || 'in-stock');
            Object.entries(productData.sizes).forEach(([size, data]) => {
                const sizeBtn = document.querySelector(`.size-btn[data-size="${size}"]`);
                if (sizeBtn) {
                    sizeBtn.disabled = !data.available || data.stock <= 0;
                    sizeBtn.classList.toggle('unavailable', !data.available || data.stock <= 0);
                }
            });
        }

        // Load thumbnails
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        thumbnailContainer.innerHTML = ''; // Clear existing thumbnails
        productData.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `Product thumbnail ${index + 1}`;
            thumbnail.classList.add('thumbnail');
            if (index === 0) thumbnail.classList.add('active');
            thumbnail.addEventListener('click', () => {
                document.getElementById('mainImage').src = image;
                document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
            });
            thumbnailContainer.appendChild(thumbnail);
        });

        // Load saved specifications
        if (productData.specifications) {
            document.querySelectorAll('.spec-item').forEach(item => {
                const specLabel = item.querySelector('.spec-label').textContent.trim();
                const specValue = item.querySelector('.spec-value');
                if (productData.specifications[specLabel]) {
                    specValue.textContent = productData.specifications[specLabel];
                }
            });
        }

        // After loading thumbnails
        initializeCarousel();

    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to load product details');
    } finally {
        hideLoading();
    }
}

async function handleAddToCart() {
    const addToCartBtn = document.getElementById('addToCart');
    try {
        const userId = localStorage.getItem('userEmail');
        if (!userId) {
            window.location.href = 'login.html';
            return;
        }

        const selectedSize = document.querySelector('.size-btn.selected');
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        // Add loading state to button
        addToCartBtn.classList.add('btn-loading');
        addToCartBtn.disabled = true;

        const product = {
            id: new URLSearchParams(window.location.search).get('id'),
            title: document.getElementById('productTitle').textContent,
            price: document.getElementById('productPrice').textContent,
            size: selectedSize.dataset.size,
            quantity: parseInt(document.getElementById('quantity').value),
            image: document.getElementById('mainImage').src
        };

        const button = document.getElementById('addToCart');
        button.disabled = true;
        button.textContent = 'Adding...';

        await addToCart(userId, product);
        updateHeaderCartCount();
        
        button.textContent = 'Added to Cart!';
        setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Add to Cart';
        }, 2000);

    } catch (error) {
        console.error('Error adding to cart:', error);
        const button = document.getElementById('addToCart');
        button.textContent = 'Error';
        setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Add to Cart';
        }, 2000);
    }
}

async function handleBuyNow() {
    const buyNowBtn = document.getElementById('buyNow');
    const selectedSize = document.querySelector('.size-btn.selected');
    
    try {
        // Check if user is logged in
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            window.location.href = '/login.html';
            return;
        }

        // Check if size is selected
        if (!selectedSize) {
            showToast('Please select a size');
            return;
        }

        // Add loading state
        buyNowBtn.classList.add('btn-loading');
        buyNowBtn.disabled = true;

        // Clear existing cart
        localStorage.removeItem('cartItems');

        // Create new cart with just this item
        const product = {
            id: new URLSearchParams(window.location.search).get('id'),
            title: document.getElementById('productTitle').textContent,
            price: document.getElementById('productPrice').textContent,
            size: selectedSize.dataset.size,
            quantity: parseInt(document.getElementById('quantity').value),
            image: document.getElementById('mainImage').src,
            addedAt: new Date().toISOString()
        };

        // Simulate network delay (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save single item to cart
        localStorage.setItem('cartItems', JSON.stringify([product]));

        // Redirect to checkout
        window.location.href = '/checkout.html';

    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to process. Please try again.');
        // Remove loading state if error occurs
        buyNowBtn.classList.remove('btn-loading');
        buyNowBtn.disabled = false;
    }
}

function handleViewAllReviews() {
    const reviewsOverlay = document.getElementById('reviewsOverlay');
    const reviewsList = document.querySelector('.reviews-overlay-list');

    // Clear existing content
    reviewsList.innerHTML = '';

    // Clone existing reviews
    const existingReviews = document.querySelectorAll('.reviews-container .review-item');
    existingReviews.forEach(review => {
        reviewsList.appendChild(review.cloneNode(true));
    });

    // Add additional reviews
    additionalReviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="review-user">
                    <div class="user-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <div class="user-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${getStarRating(review.rating)}
                </div>
            </div>
            <div class="review-content" data-collapsed="true">
                <p>${review.content}</p>
                <button class="show-more-btn">
                    <span>Show more</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            ${review.verified ? `
                <div class="verified-badge">
                    <i class="fas fa-check-circle"></i>
                    <span>Verified Purchase</span>
                </div>
            ` : ''}
        `;
        reviewsList.appendChild(reviewElement);
    });

    // Show overlay
    reviewsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Initialize show more functionality for new reviews
    initializeReviewContent();
}

// Add these review data
const additionalReviews = [
    {
        name: "Emily Johnson",
        date: "3 days ago",
        rating: 5,
        content: "The fabric quality is exceptional! This has become my go-to piece for both casual and semi-formal occasions. Definitely worth the investment.",
        verified: true
    },
    {
        name: "Michael Rodriguez",
        date: "1 week ago",
        rating: 4,
        content: "Great fit and style. The only reason it's not 5 stars is because the delivery took a bit longer than expected. Still, very satisfied with the purchase.",
        verified: true
    },
    {
        name: "Sophie Chen",
        date: "1 week ago",
        rating: 5,
        content: "Love how versatile this piece is! The attention to detail in the stitching and design is remarkable. Will definitely buy more from this brand.",
        verified: true
    },
    {
        name: "David Kim",
        date: "2 weeks ago",
        rating: 5,
        content: "Perfect streetwear aesthetic. The quality matches the price point, and the sizing is spot on. Really impressed with the overall look and feel.",
        verified: true
    },
    {
        name: "Anna Williams",
        date: "2 weeks ago",
        rating: 4,
        content: "Beautiful design and great material. Fits as expected and the color is exactly as shown in the pictures. Would recommend sizing up if you prefer a looser fit.",
        verified: true
    },
    {
        name: "James Thompson",
        date: "3 weeks ago",
        rating: 5,
        content: "This is my third purchase from HASUTA and they never disappoint. The quality is consistent and the style is always on point. Highly recommend!",
        verified: true
    },
    {
        name: "Lily Zhang",
        date: "3 weeks ago",
        rating: 4,
        content: "Really happy with this purchase. The material is breathable and comfortable. The design is unique and gets lots of compliments.",
        verified: true
    },
    {
        name: "Ryan Patel",
        date: "1 month ago",
        rating: 5,
        content: "Exceeded my expectations! The fit is perfect and the material quality is superior to many other brands I've tried. Will be ordering more colors.",
        verified: true
    },
    {
        name: "Olivia Brown",
        date: "1 month ago",
        rating: 5,
        content: "Absolutely love everything about this! The design is trendy yet timeless, and the comfort level is amazing. Worth every penny.",
        verified: true
    },
    {
        name: "Marcus Lee",
        date: "1 month ago",
        rating: 4,
        content: "Great addition to my wardrobe. The style is versatile and the quality feels premium. Just wish there were more color options available.",
        verified: true
    },
    {
        name: "Isabella Garcia",
        date: "2 months ago",
        rating: 5,
        content: "Perfect fit and amazing quality! The attention to detail is impressive, and the style is exactly what I was looking for. Highly recommended!",
        verified: true
    },
    {
        name: "Thomas Wilson",
        date: "2 months ago",
        rating: 5,
        content: "Outstanding quality and design. The material is durable yet comfortable, and the fit is exactly as described. Will definitely buy more from HASUTA.",
        verified: true
    },
    {
        name: "Hannah Mitchell",
        date: "2 months ago",
        rating: 4,
        content: "Really pleased with this purchase. The style is unique and the quality is excellent. Shipping was quick and packaging was great.",
        verified: true
    },
    {
        name: "Kevin Wang",
        date: "3 months ago",
        rating: 5,
        content: "Best streetwear purchase I've made this year! The quality is outstanding and the design is so unique. Gets lots of compliments every time I wear it.",
        verified: true
    },
    {
        name: "Rachel Cooper",
        date: "3 months ago",
        rating: 5,
        content: "Love everything about this piece! The material is premium quality and the fit is perfect. Definitely becoming a regular HASUTA customer!",
        verified: true
    }
];

// Mock function - replace with actual data fetching
async function fetchProductData(productId) {
    const savedProduct = getProductFromLocalStorage(productId);
    if (savedProduct) {
        return savedProduct;
    }

    // Default data for product 3 (T-Shirt)
    return {
        id: productId,
        category: 'summer collection',
        title: 'Classic T-Shirt',
        price: '₹899',
        images: [
            'image/tshirt1.jpg',
            'image/tshirt2.jpg',
            'image/tshirt3.jpg',
            'image/tshirt4.jpg',
            'image/tshirt5.jpg'
        ],
        reviewCount: 85,
        sizes: {
            'S': { available: true, stock: 15 },
            'M': { available: true, stock: 35 },
            'L': { available: true, stock: 25 },
            'XL': { available: false, stock: 0 }
        },
        stockStatus: {
            status: 'low-stock',
            threshold: 20,
            notifications: true
        },
        specifications: {
            'Fabric': 'Premium Wool Blend',
            'Weight': 'Heavy Winter Weight',
            'Color': 'Charcoal Grey',
            'Fit': 'Regular Fit',
            'Wash Care': 'Machine Wash Cold'
        }
    };
}

// Add this function to handle video initialization and playback
function initializeVideoPlayers() {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const video = item.querySelector('.product-video');
        
        // Set default poster image if not already set
        if (!video.hasAttribute('poster')) {
            video.setAttribute('poster', 'image/dress2.jfif'); // Use your default thumbnail image
        }
        
        // Set video attributes for continuous autoplay
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        
        // Remove play button if it exists
        const playButton = item.querySelector('.video-play-button');
        if (playButton) {
            playButton.remove();
        }

        // Force video play on load
        const playVideo = () => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented:", error);
                    // Try playing again after a short delay
                    setTimeout(() => video.play(), 100);
                });
            }
        };

        // Play video as soon as possible
        playVideo();
        
        // Also play when metadata is loaded
        video.addEventListener('loadedmetadata', function() {
            playVideo();
            
            // Update duration display
            const minutes = Math.floor(video.duration / 60);
            const seconds = Math.floor(video.duration % 60);
            const durationDisplay = item.querySelector('.video-duration');
            if (durationDisplay) {
                durationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        });

        // Ensure video keeps playing
        video.addEventListener('pause', playVideo);
        video.addEventListener('ended', () => {
            video.currentTime = 0;
            playVideo();
        });

        // Handle visibility changes
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    playVideo();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(video);
    });
}

// Add these functions after the existing code

function initializeProductEdit() {
    if (!checkUserRole()) {
        return; // Exit if user doesn't have permission
    }
    
    const editBtn = document.querySelector('.edit-image-btn');
    const editOverlay = document.getElementById('productEditOverlay');
    const closeBtn = document.querySelector('.close-edit-overlay');
    const cancelBtn = document.querySelector('.cancel-edit');
    const saveBtn = document.querySelector('.save-edit');
    const mainImageUpload = document.getElementById('mainImageUpload');
    const mainImageInput = document.getElementById('mainImageInput');
    const thumbnailInput = document.getElementById('thumbnailInput');
    const addThumbnailBtn = document.querySelector('.add-thumbnail');

    // Initialize form with current values
    function populateEditForm() {
        const mainImage = document.getElementById('mainImage');
        const editMainImage = document.getElementById('editMainImage');
        const titleInput = document.getElementById('editTitle');
        const priceInput = document.getElementById('editPrice');

        editMainImage.src = mainImage.src;
        titleInput.value = document.getElementById('productTitle').textContent;
        priceInput.value = document.getElementById('productPrice').textContent.replace('₹', '');

        // Load thumbnails
        const thumbnailContainer = document.getElementById('thumbnailContainer');
        const existingThumbnails = document.querySelectorAll('.thumbnail');
        thumbnailContainer.innerHTML = ''; // Clear existing thumbnails
        existingThumbnails.forEach(thumb => {
            const thumbItem = createThumbnailItem(thumb.src);
            thumbnailContainer.appendChild(thumbItem);
        });
        thumbnailContainer.appendChild(addThumbnailBtn);

        // Add this new code for size and stock
        const sizeData = {
            'S': { available: false, stock: 0 },
            'M': { available: true, stock: 50 },
            'L': { available: true, stock: 30 },
            'XL': { available: true, stock: 20 }
        };

        // Populate size and stock data
        Object.entries(sizeData).forEach(([size, data]) => {
            const toggle = document.querySelector(`.size-toggle[data-size="${size}"]`);
            const stockInput = document.querySelector(`.stock-input[data-size="${size}"]`);
            
            if (toggle && stockInput) {
                toggle.checked = data.available;
                stockInput.value = data.stock;
                stockInput.disabled = !data.available;
            }
        });

        // Add this code to populate stock status
        const stockStatus = {
            status: 'in-stock',
            threshold: 10,
            notifications: true
        };

        const statusSelect = document.getElementById('stockStatusSelect');
        const thresholdInput = document.getElementById('stockAlertThreshold');
        const notificationToggle = document.getElementById('stockNotificationToggle');

        if (statusSelect && thresholdInput && notificationToggle) {
            statusSelect.value = stockStatus.status;
            thresholdInput.value = stockStatus.threshold;
            notificationToggle.checked = stockStatus.notifications;

            // Update select styling based on status
            statusSelect.dataset.status = stockStatus.status;
        }
    }

    function createThumbnailItem(src) {
        const div = document.createElement('div');
        div.className = 'thumbnail-item';
        div.innerHTML = `
            <img src="${src}" alt="Thumbnail" class="edit-thumbnail">
            <button class="remove-thumbnail">
                <i class="fas fa-times"></i>
            </button>
            <div class="thumbnail-change-overlay">
                <label class="thumbnail-change-icon" role="button" tabindex="0">
                    <i class="fas fa-plus"></i>
                    <input type="file" class="thumbnail-file-input" accept="image/*" style="display: none;">
                </label>
            </div>
        `;

        // Handle file input change
        const fileInput = div.querySelector('.thumbnail-file-input');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const thumbnailImg = div.querySelector('img');
                    thumbnailImg.src = e.target.result;
                    
                    // Update corresponding thumbnail in main view
                    const mainThumbnails = document.querySelector('.thumbnail-container');
                    const mainThumbnailIndex = Array.from(thumbnailContainer.children).indexOf(div);
                    if (mainThumbnailIndex !== -1 && mainThumbnails.children[mainThumbnailIndex]) {
                        mainThumbnails.children[mainThumbnailIndex].src = e.target.result;
                    }
                    
                    showToast('Thumbnail updated successfully!');
                };
                reader.readAsDataURL(file);
            }
        });

        // Add click event to update main image when thumbnail is clicked
        const thumbnailImg = div.querySelector('img');
        thumbnailImg.addEventListener('click', () => {
            document.getElementById('editMainImage').src = thumbnailImg.src;
            
            // Remove active class from all thumbnails
            div.parentElement.querySelectorAll('.thumbnail-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Add active class to clicked thumbnail
            div.classList.add('selected');
        });

        // Handle remove functionality
        const removeBtn = div.querySelector('.remove-thumbnail');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            div.remove();
            showToast('Thumbnail removed');
        });

        return div;
    }

    // Event Listeners
    editBtn.addEventListener('click', () => {
        editOverlay.classList.add('active');
        populateEditForm();
    });

    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            editOverlay.classList.remove('active');
        });
    });

    mainImageUpload.addEventListener('click', () => {
        mainImageInput.click();
    });

    mainImageInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('editMainImage').src = e.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    addThumbnailBtn.addEventListener('click', () => {
        thumbnailInput.click();
    });

    thumbnailInput.addEventListener('change', (e) => {
        handleThumbnailUpload(e.target.files);
    });

    saveBtn.addEventListener('click', async () => {
        const productId = new URLSearchParams(window.location.search).get('id');
        const updatedData = {
            mainImage: document.getElementById('editMainImage').src,
            title: document.getElementById('editTitle').value,
            price: document.getElementById('editPrice').value,
            category: document.getElementById('productCategory').textContent,
            images: Array.from(document.querySelectorAll('.edit-thumbnail')).map(img => img.src),
            sizes: Array.from(document.querySelectorAll('.size-stock-item')).reduce((acc, item) => {
                const size = item.querySelector('.size-label').textContent;
                const available = item.querySelector('.size-toggle').checked;
                const stock = parseInt(item.querySelector('.stock-input').value) || 0;
                
                acc[size] = { available, stock };
                return acc;
            }, {}),
            stockStatus: {
                status: document.getElementById('stockStatusSelect').value,
                threshold: parseInt(document.getElementById('stockAlertThreshold').value) || 0,
                notifications: document.getElementById('stockNotificationToggle').checked
            }
        };

        try {
            // Save to localStorage
            saveProductToLocalStorage(productId, updatedData);

            // Update UI
            document.getElementById('mainImage').src = updatedData.mainImage;
            document.getElementById('productTitle').textContent = updatedData.title;
            document.getElementById('productPrice').textContent = `₹${updatedData.price}`;
            
            // Update size buttons availability immediately after saving
            updateSizeButtonsAvailability(updatedData.stockStatus.status);
            
            // ...rest of the existing update UI code...

            editOverlay.classList.remove('active');
            showToast('Product updated successfully!');
        } catch (error) {
            console.error('Error updating product:', error);
            showToast('Failed to update product');
        }
    });

    // Add this new function for handling thumbnail uploads
    function handleThumbnailUpload(files) {
        const thumbnailContainer = document.getElementById('thumbnailContainer');
        const maxThumbnails = 5; // Maximum number of thumbnails allowed
        const currentThumbnails = thumbnailContainer.querySelectorAll('.thumbnail-item:not(.add-thumbnail)').length;
        const remainingSlots = maxThumbnails - currentThumbnails;
        
        // Convert FileList to Array and limit to remaining slots
        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        filesToProcess.forEach(file => {
            if (!file.type.startsWith('image/')) {
                showToast('Please upload only image files');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const thumbItem = document.createElement('div');
                thumbItem.className = 'thumbnail-item';
                thumbItem.innerHTML = `
                    <img src="${e.target.result}" alt="Thumbnail">
                    <button class="remove-thumbnail">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="thumbnail-overlay">
                        <i class="fas fa-check"></i>
                    </div>
                `;

                // Add remove functionality
                const removeBtn = thumbItem.querySelector('.remove-thumbnail');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    thumbItem.remove();
                });

                // Insert before the add button
                const addButton = thumbnailContainer.querySelector('.add-thumbnail');
                thumbnailContainer.insertBefore(thumbItem, addButton);

                // Hide add button if max thumbnails reached
                if (thumbnailContainer.querySelectorAll('.thumbnail-item:not(.add-thumbnail)').length >= maxThumbnails) {
                    addButton.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        });

        if (currentThumbnails + filesToProcess.length >= maxThumbnails) {
            showToast(`Maximum ${maxThumbnails} thumbnails allowed`);
        }
    }

    // Add drag and drop functionality for thumbnails
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        thumbnailContainer.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    thumbnailContainer.addEventListener('dragenter', () => {
        thumbnailContainer.classList.add('drag-active');
    });

    thumbnailContainer.addEventListener('dragleave', () => {
        thumbnailContainer.classList.remove('drag-active');
    });

    thumbnailContainer.addEventListener('drop', (e) => {
        thumbnailContainer.classList.remove('drag-active');
        const files = e.dataTransfer.files;
        handleThumbnailUpload(files);
    });

    // Add event listeners for size toggles
    document.querySelectorAll('.size-toggle').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const size = e.target.dataset.size;
            const stockInput = document.querySelector(`.stock-input[data-size="${size}"]`);
            
            if (stockInput) {
                stockInput.disabled = !e.target.checked;
                if (!e.target.checked) {
                    stockInput.value = '0';
                }
            }
        });
    });

    // Add validation for stock inputs
    document.querySelectorAll('.stock-input').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 0) {
                e.target.value = '0';
            }
        });
    });

    // Add event listeners for stock status controls
    const statusSelect = document.getElementById('stockStatusSelect');
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            e.target.dataset.status = e.target.value;
            updateStockStatusDisplay(e.target.value);
        });
    }

    const thresholdInput = document.getElementById('stockAlertThreshold');
    if (thresholdInput) {
        thresholdInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (isNaN(value) || value < 0) {
                e.target.value = '0';
            }
        });
    }

    function updateStockStatusDisplay(status) {
        const stockStatus = document.querySelector('.stock-status');
        const totalStock = calculateTotalStock();
        const addToCartBtn = document.getElementById('addToCart');
        const buyNowBtn = document.getElementById('buyNow');
        
        if (stockStatus) {
            let statusClass, statusText, iconClass;
            
            switch (status) {
                case 'out-of-stock':
                    statusClass = 'out-of-stock';
                    statusText = 'Out of Stock';
                    iconClass = 'fa-times-circle';
                    // Hide buttons when out of stock
                    addToCartBtn.style.display = 'none';
                    buyNowBtn.style.display = 'none';
                    break;
                case 'low-stock':
                    statusClass = 'low-stock';
                    statusText = 'Low Stock';
                    iconClass = 'fa-exclamation-circle';
                    // Show buttons
                    addToCartBtn.style.display = 'flex';
                    buyNowBtn.style.display = 'flex';
                    break;
                case 'pre-order':
                    statusClass = 'pre-order';
                    statusText = 'Pre Order';
                    iconClass = 'fa-clock';
                    // Show buttons
                    addToCartBtn.style.display = 'flex';
                    buyNowBtn.style.display = 'flex';
                    break;
                default:
                    statusClass = 'in-stock';
                    statusText = 'In Stock';
                    iconClass = 'fa-check-circle';
                    // Show buttons
                    addToCartBtn.style.display = 'flex';
                    buyNowBtn.style.display = 'flex';
                    break;
            }

            stockStatus.className = `stock-status ${statusClass}`;
            stockStatus.innerHTML = `
                <i class="fas ${iconClass}"></i>
                <span>${statusText}</span>
                ${status === 'low-stock' ? `<span class="stock-count">(${totalStock} left)</span>` : ''}
            `;

            // Update size buttons availability
            updateSizeButtonsAvailability(status);
        }
    }

    function calculateTotalStock() {
        return Array.from(document.querySelectorAll('.stock-input'))
            .reduce((total, input) => {
                const isAvailable = input.closest('.size-stock-item')
                    .querySelector('.size-toggle').checked;
                return total + (isAvailable ? parseInt(input.value) || 0 : 0);
            }, 0);
    }

    function updateSizeButtonsAvailability(status) {
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(button => {
            const size = button.dataset.size;
            const sizeStockInput = document.querySelector(`.stock-input[data-size="${size}"]`);
            const sizeToggle = document.querySelector(`.size-toggle[data-size="${size}"]`);
            
            // Check if size is available and has stock
            const isAvailable = status !== 'out-of-stock' && 
                sizeToggle?.checked &&
                parseInt(sizeStockInput?.value || 0) > 0;

            // Update button state
            button.disabled = !isAvailable;
            button.classList.toggle('unavailable', !isAvailable);
            
            if (!isAvailable) {
                button.classList.remove('selected', 'active');
            }
        });
    }
}

function updateStockStatusDisplay(status) {
    const stockStatus = document.querySelector('.stock-status');
    const totalStock = calculateTotalStock();
    const addToCartBtn = document.getElementById('addToCart');
    const buyNowBtn = document.getElementById('buyNow');
    
    if (stockStatus) {
        let statusClass, statusText, iconClass;
        
        switch (status) {
            case 'out-of-stock':
                statusClass = 'out-of-stock';
                statusText = 'Out of Stock';
                iconClass = 'fa-times-circle';
                // Hide buttons when out of stock
                addToCartBtn.style.display = 'none';
                buyNowBtn.style.display = 'none';
                break;
            case 'low-stock':
                statusClass = 'low-stock';
                statusText = 'Low Stock';
                iconClass = 'fa-exclamation-circle';
                // Show buttons
                addToCartBtn.style.display = 'flex';
                buyNowBtn.style.display = 'flex';
                break;
            case 'pre-order':
                statusClass = 'pre-order';
                statusText = 'Pre Order';
                iconClass = 'fa-clock';
                // Show buttons
                addToCartBtn.style.display = 'flex';
                buyNowBtn.style.display = 'flex';
                break;
            default:
                statusClass = 'in-stock';
                statusText = 'In Stock';
                iconClass = 'fa-check-circle';
                // Show buttons
                addToCartBtn.style.display = 'flex';
                buyNowBtn.style.display = 'flex';
                break;
        }

        stockStatus.className = `stock-status ${statusClass}`;
        stockStatus.innerHTML = `
            <i class="fas ${iconClass}"></i>
            <span>${statusText}</span>
            ${status === 'low-stock' ? `<span class="stock-count">(${totalStock} left)</span>` : ''}
        `;

        // Update size buttons availability
        updateSizeButtonsAvailability(status);
    }
}

function calculateTotalStock() {
    return Array.from(document.querySelectorAll('.stock-input'))
        .reduce((total, input) => {
            const isAvailable = input.closest('.size-stock-item')
                .querySelector('.size-toggle').checked;
            return total + (isAvailable ? parseInt(input.value) || 0 : 0);
        }, 0);
}

function updateSizeButtonsAvailability(status) {
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        const size = button.dataset.size;
        const sizeStockInput = document.querySelector(`.stock-input[data-size="${size}"]`);
        const sizeToggle = document.querySelector(`.size-toggle[data-size="${size}"]`);
        
        // Check if size is available and has stock
        const isAvailable = status !== 'out-of-stock' && 
            sizeToggle?.checked &&
            parseInt(sizeStockInput?.value || 0) > 0;

        // Update button state
        button.disabled = !isAvailable;
        button.classList.toggle('unavailable', !isAvailable);
        
        if (!isAvailable) {
            button.classList.remove('selected', 'active');
        }
    });
}

function initializeSpecsEdit() {
    const editSpecsBtn = document.querySelector('.edit-specs-btn');
    const specItems = document.querySelectorAll('.spec-item');
    
    // Show edit button only if user has permission
    if (checkUserRole()) {
        editSpecsBtn.style.display = 'flex';
    }

    editSpecsBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const isEditing = this.classList.contains('active');
        
        specItems.forEach(item => {
            if (isEditing) {
                const value = item.querySelector('.spec-value');
                const currentText = value.textContent;
                item.classList.add('editing');
                
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'spec-edit-input';
                input.value = currentText;
                
                const saveBtn = document.createElement('button');
                saveBtn.className = 'spec-edit-save-btn';
                saveBtn.innerHTML = '<i class="fas fa-check"></i> Save';
                saveBtn.style.display = 'none'; // Initially hidden
                
                // Show save button when input changes
                input.addEventListener('input', () => {
                    if (input.value !== currentText) {
                        saveBtn.style.display = 'flex';
                        setTimeout(() => saveBtn.classList.add('visible'), 10);
                    } else {
                        saveBtn.classList.remove('visible');
                        setTimeout(() => saveBtn.style.display = 'none', 300);
                    }
                });

                // Add save functionality
                saveBtn.addEventListener('click', () => saveSpecValue(item, input));
                
                item.appendChild(input);
                item.appendChild(saveBtn);
                input.focus();
            } else {
                const input = item.querySelector('.spec-edit-input');
                const saveBtn = item.querySelector('.spec-edit-save-btn');
                if (input && saveBtn) {
                    saveSpecValue(item, input);
                    saveBtn.remove();
                }
            }
        });
    });
}

function saveSpecValue(item, input) {
    const value = item.querySelector('.spec-value');
    const newText = input.value.trim();
    const saveBtn = item.querySelector('.spec-edit-save-btn');
    
    if (newText && newText !== value.textContent) {
        value.textContent = newText;
        
        // Save to localStorage with product data
        const productId = new URLSearchParams(window.location.search).get('id');
        const productData = getProductFromLocalStorage(productId) || {};
        
        // Initialize specifications object if it doesn't exist
        if (!productData.specifications) {
            productData.specifications = {};
        }
        
        // Save specification with label as key
        const specLabel = item.querySelector('.spec-label').textContent.trim();
        productData.specifications[specLabel] = newText;
        
        // Save back to localStorage
        saveProductToLocalStorage(productId, productData);
        
        showToast('Specification updated successfully!');
    }
    
    item.classList.remove('editing');
    input.remove();
    if (saveBtn) saveBtn.remove();
    
    const remainingEditingItems = document.querySelectorAll('.spec-item.editing');
    if (remainingEditingItems.length === 0) {
        document.querySelector('.edit-specs-btn').classList.remove('active');
    }
}

function initializeCarousel() {
    const mainImage = document.getElementById('mainImage');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const thumbnails = Array.from(document.querySelectorAll('.thumbnail'));
    let currentIndex = 0;

    function updateImage(index) {
        // Remove active class from all thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Add active class to current thumbnail
        thumbnails[index].classList.add('active');
        
        // Update main image with smooth transition
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = thumbnails[index].src;
            mainImage.style.opacity = '1';
        }, 200);
        
        currentIndex = index;
    }

    function nextImage() {
        const nextIndex = (currentIndex + 1) % thumbnails.length;
        updateImage(nextIndex);
    }

    function prevImage() {
        const prevIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateImage(prevIndex);
    }

    // Add click handlers for navigation buttons
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    });

    // Add swipe functionality for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    mainImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    mainImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swipe left
                nextImage();
            } else {
                // Swipe right
                prevImage();
            }
        }
    }

    // Add sweep functionality
    const mainImageContainer = document.querySelector('.main-image');
    let startX = 0;
    let currentTranslateX = 0;
    let isDragging = false;
    let initialTouchX = 0;

    // Mouse events
    mainImageContainer.addEventListener('mousedown', startDragging);
    mainImageContainer.addEventListener('mousemove', drag);
    mainImageContainer.addEventListener('mouseup', endDragging);
    mainImageContainer.addEventListener('mouseleave', endDragging);

    // Touch events
    mainImageContainer.addEventListener('touchstart', startDragging);
    mainImageContainer.addEventListener('touchmove', drag);
    mainImageContainer.addEventListener('touchend', endDragging);

    function startDragging(e) {
        isDragging = true;
        mainImageContainer.classList.add('swiping');
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].clientX;
        initialTouchX = startX;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslateX = diff;

        // Apply the transform with some resistance
        const resistance = 0.3;
        mainImage.style.transform = `translateX(${diff * resistance}px)`;
    }

    function endDragging() {
        if (!isDragging) return;
        
        isDragging = false;
        mainImageContainer.classList.remove('swiping');
        mainImage.style.transform = '';

        const endX = currentTranslateX;
        const swipeThreshold = 50; // Minimum distance for swipe

        if (Math.abs(endX) > swipeThreshold) {
            if (endX > 0) {
                prevImage();
            } else {
                nextImage();
            }
        }

        currentTranslateX = 0;
    }

    // Add transition end listener to remove transform
    mainImage.addEventListener('transitionend', () => {
        mainImage.style.transform = '';
    });

    // Prevent default touch behaviors
    mainImageContainer.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Auto-advance slideshow (optional)
    let slideshowInterval;
    
    function startSlideshow() {
        slideshowInterval = setInterval(nextImage, 5000); // Change image every 5 seconds
    }

    function stopSlideshow() {
        clearInterval(slideshowInterval);
    }

    // Stop slideshow on user interaction
    mainImage.addEventListener('mouseenter', stopSlideshow);
    mainImage.addEventListener('touchstart', stopSlideshow);

    // Start slideshow initially (optional)
    // startSlideshow();
}

// Add this after initializeSpecsEdit function
function initializeReviewsEdit() {
    const editBtn = document.querySelector('.edit-reviews-btn');
    const editOverlay = document.getElementById('reviewsEditOverlay');
    const closeBtn = editOverlay.querySelector('.close-edit-overlay');
    const cancelBtn = editOverlay.querySelector('.cancel-edit');
    const saveBtn = editOverlay.querySelector('.save-edit');
    const addReviewBtn = editOverlay.querySelector('.add-review-btn');
    const reviewsList = editOverlay.querySelector('.reviews-list-editor');

    // Show edit button only if user has permission
    if (checkUserRole()) {
        editBtn.style.display = 'inline-flex';
    }

    function populateReviewsEditor() {
        const reviews = Array.from(document.querySelectorAll('.review-item')).map(review => ({
            name: review.querySelector('.user-name').textContent,
            date: review.querySelector('.review-date').textContent,
            content: review.querySelector('.review-content p').textContent,
            rating: review.querySelector('.review-rating').children.length,
            verified: review.querySelector('.verified-badge') !== null
        }));

        reviewsList.innerHTML = reviews.map((review, index) => `
            <div class="review-edit-item" data-index="${index}">
                <div class="review-edit-actions">
                    <button class="edit-review-btn">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="delete-review-btn">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="review-preview">
                    <div class="review-header">
                        <strong>${review.name}</strong>
                        <div class="review-rating">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                        </div>
                    </div>
                    <p>${review.content}</p>
                </div>
            </div>
        `).join('');

        // Update overall rating and total reviews
        document.getElementById('editOverallRating').value = '4.5'; // Replace with actual value
        document.getElementById('editTotalReviews').value = reviews.length;
    }

    function handleReviewEdit(reviewItem) {
        const preview = reviewItem.querySelector('.review-preview');
        const name = preview.querySelector('strong').textContent;
        const content = preview.querySelector('p').textContent;
        const rating = preview.querySelector('.review-rating').textContent.split('★').length - 1;

        reviewItem.innerHTML = `
            <form class="review-edit-form">
                <input type="text" name="name" value="${name}" placeholder="Reviewer Name">
                <div class="rating-input">
                    ${Array(5).fill().map((_, i) => `
                        <input type="radio" name="rating" value="${i+1}" ${rating === i+1 ? 'checked' : ''}>
                    `).join('')}
                </div>
                <textarea name="content" placeholder="Review Content">${content}</textarea>
                <div class="form-actions">
                    <button type="button" class="cancel-review-edit">Cancel</button>
                    <button type="submit" class="save-review-edit">Save</button>
                </div>
            </form>
        `;
    }

    // Event Listeners
    editBtn.addEventListener('click', () => {
        editOverlay.classList.add('active');
        populateReviewsEditor();
    });

    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            editOverlay.classList.remove('active');
        });
    });

    reviewsList.addEventListener('click', (e) => {
        const reviewItem = e.target.closest('.review-edit-item');
        if (!reviewItem) return;

        if (e.target.closest('.edit-review-btn')) {
            handleReviewEdit(reviewItem);
        } else if (e.target.closest('.delete-review-btn')) {
            if (confirm('Are you sure you want to delete this review?')) {
                reviewItem.remove();
            }
        }
    });

    addReviewBtn.addEventListener('click', () => {
        const newReview = document.createElement('div');
        newReview.className = 'review-edit-item';
        newReview.dataset.index = reviewsList.children.length;
        newReview.innerHTML = `
            <form class="review-edit-form">
                <input type="text" name="name" placeholder="Reviewer Name">
                <div class="rating-input">
                    ${Array(5).fill().map((_, i) => `
                        <input type="radio" name="rating" value="${i+1}">
                    `).join('')}
                </div>
                <textarea name="content" placeholder="Review Content"></textarea>
                <div class="form-actions">
                    <button type="button" class="cancel-review-edit">Cancel</button>
                    <button type="submit" class="save-review-edit">Save</button>
                </div>
            </form>
        `;
        reviewsList.appendChild(newReview);
    });

    saveBtn.addEventListener('click', async () => {
        try {
            // Here you would typically save the changes to your backend
            // For now, we'll just update the UI
            showToast('Reviews updated successfully!');
            editOverlay.classList.remove('active');
        } catch (error) {
            console.error('Error saving reviews:', error);
            showToast('Failed to update reviews');
        }
    });
}

function initializeReviewSelection() {
    const reviewsOverlay = document.getElementById('reviewsOverlay');

    // Add checkbox to each review
    function addSelectionToReviews() {
        const reviews = reviewsOverlay.querySelectorAll('.review-item');
        reviews.forEach((review, index) => {
            if (!review.querySelector('.review-select-box')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'review-select-box';
                checkbox.id = `review-${index}`;

                const indicator = document.createElement('div');
                indicator.className = 'review-select-indicator';

                review.insertBefore(indicator, review.firstChild);
                review.insertBefore(checkbox, review.firstChild);
            }
        });
    }

    // Initialize when reviews are loaded
    const observer = new MutationObserver(() => {
        addSelectionToReviews();
    });

    observer.observe(reviewsOverlay.querySelector('.reviews-overlay-list'), {
        childList: true,
        subtree: true
    });

    // Initial setup
    addSelectionToReviews();
}

// Replace the initializeReviewContent function
function initializeReviewContent() {
    document.querySelectorAll('.review-content').forEach(content => {
        // Remove the truncation logic
        const text = content.querySelector('p').textContent;
        content.querySelector('p').textContent = text;
    });
}

function initializeReviewImages() {
    // Create modal container if it doesn't exist
    if (!document.querySelector('.review-image-modal')) {
        const modal = document.createElement('div');
        modal.className = 'review-image-modal';
        modal.innerHTML = '<img src="" alt="Review photo preview">';
        document.body.appendChild(modal);
    }

    // Add click handlers to review photos
    document.querySelectorAll('.review-photo').forEach(photo => {
        photo.addEventListener('click', function() {
            const modal = document.querySelector('.review-image-modal');
            const modalImg = modal.querySelector('img');
            modalImg.src = this.src;
            modal.classList.add('active');
        });
    });

    // Close modal when clicking outside the image
    document.querySelector('.review-image-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelector('.review-image-modal').classList.remove('active');
        }
    });
}

// ...existing code...

document.querySelector('.view-more-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    // You can add any additional tracking or analytics here before navigation
    window.location.href = '/reviews-page.html';
});

// Update createReviewElement function
function createReviewElement(review) {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    reviewElement.innerHTML = `
        <div class="review-header">
            <div class="review-user">
                <div class="user-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-info">
                    <div class="user-name">${review.name}</div>
                    <div class="review-date">${review.date}</div>
                </div>
            </div>
            <div class="review-rating">
                ${getStarRating(review.rating)}
            </div>
        </div>
        <div class="review-content">
            <p>${review.content}</p>
            ${review.images ? `
                <div class="review-images">
                    ${review.images.map(img => `
                        <img src="${img}" alt="Review photo" class="review-photo">
                    `).join('')}
                </div>
            ` : ''}
        </div>
        ${review.verified ? `
            <div class="verified-badge">
                <i class="fas fa-check-circle"></i>
                <span>Verified Purchase</span>
            </div>
        ` : ''}
    `;
    
    return reviewElement;
}

// Add this function to initialize the galaxy animation
function initializeGalaxyAnimation() {
    const galaxyBackground = document.querySelector('.galaxy-background');
    if (!galaxyBackground) return;

    // Create more stars with varying sizes
    const createStars = (count) => {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            
            // Random size class with adjusted probabilities for more medium and large stars
            const size = Math.random();
            if (size < 0.5) {
                star.className = 'star small';
            } else if (size < 0.8) {
                star.className = 'star medium';
            } else {
                star.className = 'star large';
            }

            // Improved random position distribution
            star.style.left = `${Math.random() * 120 - 10}%`; // Allow some stars to overflow
            star.style.top = `${Math.random() * 120 - 10}%`;
            
            // Random twinkle duration and delay
            star.style.setProperty('--twinkle-duration', `${2 + Math.random() * 4}s`);
            star.style.animationDelay = `${Math.random() * 3}s`;

            galaxyBackground.appendChild(star);
        }
    };

    // Create shooting stars more frequently
    const createShootingStars = () => {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // Random position and angle
        const startY = Math.random() * 100;
        shootingStar.style.left = '0';
        shootingStar.style.top = `${startY}%`;
        shootingStar.style.transform = `rotate(${45 + Math.random() * 15}deg)`;
        
        galaxyBackground.appendChild(shootingStar);

        // Remove shooting star after animation
        shootingStar.addEventListener('animationend', () => {
            shootingStar.remove();
        });
    };

    // Initialize more stars
    createStars(10000); // Increased from 150 to 300 stars

    // Create shooting stars more frequently
    setInterval(() => {
        if (Math.random() < 0.4) { // Increased probability from 0.3 to 0.4
            createShootingStars();
        }
    }, 1500); // Reduced interval from 2000 to 1500ms

    // Add more interactive star creation on mousemove
    let lastMove = 0;
    galaxyBackground.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMove > 30) { // Reduced from 50ms to 30ms for more responsive creation
            const rect = galaxyBackground.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Create multiple stars per movement
            for (let i = 0; i < 3; i++) { // Create 3 stars per movement
                const star = document.createElement('div');
                star.className = 'star small';
                star.style.left = `${x + (Math.random() * 10 - 5)}%`;
                star.style.top = `${y + (Math.random() * 10 - 5)}%`;
                star.style.setProperty('--twinkle-duration', '1s');
                
                galaxyBackground.appendChild(star);
                
                setTimeout(() => {
                    star.remove();
                }, 1000);
            }
            
            lastMove = now;
        }
    });
}

// ...existing code...