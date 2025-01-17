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
        viewAllBtn.addEventListener('click', handleViewAllReviews);
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

    // Edit overlay functionality
    const editButton = document.querySelector('.edit-image-btn');
    const editOverlay = document.getElementById('editOverlay');
    const closeEditOverlay = document.getElementById('closeEditOverlay');
    const cancelEdit = document.getElementById('cancelEdit');
    const editForm = document.getElementById('editProductForm');

    editButton.addEventListener('click', () => {
        // Populate form with current product details
        document.getElementById('editTitle').value = document.getElementById('productTitle').textContent;
        document.getElementById('editPrice').value = document.getElementById('productPrice').textContent.replace(/[^0-9]/g, '');
        document.getElementById('editCategory').value = document.getElementById('productCategory').textContent.toLowerCase();
        
        // Show overlay
        editOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeEditOverlay.addEventListener('click', closeEditOverlayHandler);
    cancelEdit.addEventListener('click', closeEditOverlayHandler);

    function closeEditOverlayHandler() {
        editOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(editForm);
            const data = Object.fromEntries(formData.entries());
            
            // Add loading state
            const saveBtn = editForm.querySelector('.save-btn');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            // Simulate API call - replace with your actual update logic
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update UI with new values
            document.getElementById('productTitle').textContent = data.title;
            document.getElementById('productPrice').textContent = `₹${data.price}`;
            document.getElementById('productCategory').textContent = data.category;

            // Show success message
            showToast('Product details updated successfully!');
            closeEditOverlayHandler();

        } catch (error) {
            console.error('Error updating product:', error);
            showToast('Failed to update product details');
        } finally {
            const saveBtn = editForm.querySelector('.save-btn');
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Changes';
        }
    });

    // Close overlay when clicking outside
    editOverlay.addEventListener('click', (e) => {
        if (e.target === editOverlay) {
            closeEditOverlayHandler();
        }
    });

    // Close overlay with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editOverlay.classList.contains('active')) {
            closeEditOverlayHandler();
        }
    });
});

async function loadProductDetails(productId) {
    showLoading();
    try {
        const productData = await fetchProductData(productId);
        if (!productData) {
            throw new Error('Product not found');
        }
        
        // Update UI with product details
        document.getElementById('productCategory').textContent = productData.category;
        document.getElementById('productTitle').textContent = productData.title;
        document.getElementById('productPrice').textContent = productData.price;
        document.getElementById('mainImage').src = productData.images[0];

        // Load thumbnails
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        productData.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `Product thumbnail ${index + 1}`;
            thumbnail.classList.add('thumbnail');
            thumbnail.addEventListener('click', () => {
                document.getElementById('mainImage').src = image;
                document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
            });
            thumbnailContainer.appendChild(thumbnail);
        });
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Failed to load product details');
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

    // Clone existing reviews to the overlay
    const existingReviews = document.querySelectorAll('.reviews-container .review-item');
    reviewsList.innerHTML = ''; // Clear existing content

    existingReviews.forEach(review => {
        reviewsList.appendChild(review.cloneNode(true));
    });

    // Add more mock reviews
    const mockReviews = [
        {
            name: "Emma Wilson",
            date: "1 week ago",
            rating: 5,
            content: "Perfect fit and great quality material. Would definitely recommend!",
            verified: true
        },
        {
            name: "James Brown",
            date: "2 weeks ago",
            rating: 4,
            content: "Good product but delivery took longer than expected.",
            verified: true
        },
        {
            name: "Alex Chen",
            date: "3 weeks ago",
            rating: 5,
            content: "Incredible quality and style. Worth every penny!",
            verified: true
        }
    ];

    mockReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsList.appendChild(reviewElement);
    });

    // Show overlay
    reviewsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';
    reviewDiv.innerHTML = `
        <div class="review-header">
            <div class="review-user">
                <div class="user-icon">
                    <i class="fas fa-user-circle"></i>
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
        </div>
        ${review.verified ? `
            <div class="verified-badge">
                <i class="fas fa-check-circle"></i>
                <span>Verified Purchase</span>
            </div>
        ` : ''}
    `;
    return reviewDiv;
}

function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Mock function - replace with actual data fetching
async function fetchProductData(productId) {
    // This is a mock implementation
    return {
        id: productId,
        category: 'winter collection ',
        title: 'teen hoodie',
        price: '₹1500',
        images: [
            'image/download (1).jfif',
            'image/download.jfif',
            'image/download.jfif',
            'image/download.jfif',
            'image/download.jfif'
        ],
        reviewCount: 127
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