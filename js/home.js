// Add admin emails array and constants
const { ADMIN_EMAILS, HIDDEN_PRODUCTS_KEY, PRODUCT_CATEGORIES, CATEGORIES } = newFunction();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check login status and admin privileges
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    const saveButton = document.querySelector('.save-button');
    const editIcon = document.querySelector('.fa-edit')?.parentElement;

    // Show/hide edit icons based on admin status
    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.style.display = isAdmin ? 'flex' : 'none';
    });

    // Load hidden products from localStorage
    const hiddenProducts = JSON.parse(localStorage.getItem(HIDDEN_PRODUCTS_KEY) || '[]');
    
    // Apply hidden state to products
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.querySelector('.select-checkbox').id;
        // For non-admin users, hide the products
        if (!isAdmin && hiddenProducts.includes(productId)) {
            card.style.display = 'none';
        }
        // For admin users, pre-check the boxes of visible products
        else if (isAdmin && !hiddenProducts.includes(productId)) {
            const checkbox = card.querySelector('.select-checkbox');
            if (checkbox) checkbox.checked = true;
        }
    });

    // First handle visibility of admin controls
    if (editIcon) {
        editIcon.style.display = isAdmin ? 'block' : 'none';
    }
    if (saveButton) {
        saveButton.style.display = 'none';
    }

    // Hide cart icon if not logged in
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.parentElement.style.display = isLoggedIn ? 'block' : 'none';
        if (isLoggedIn) updateCartCount();
    }

    // Add edit mode toggle functionality
    if (isAdmin && editIcon) {
        editIcon.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('edit-mode');
            
            const icon = this.querySelector('.fa-edit');
            if (document.body.classList.contains('edit-mode')) {
                icon.style.color = 'var(--primary-color)';
                // Show checkboxes and edit icons
                document.querySelectorAll('.product-select, .product-edit').forEach(element => {
                    element.style.display = 'block';
                });
            } else {
                exitEditMode(icon);
            }
        });
    }

    // Add edit icon functionality
    document.querySelectorAll('.product-edit').forEach(editIcon => {
        editIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            // Remove ₹ symbol and any commas from price
            const productPrice = productCard.querySelector('.product-price').textContent
                .replace('₹', '')
                .replace(/,/g, '');
            const productId = productCard.querySelector('.select-checkbox').id;
            const productLink = productCard.querySelector('a').getAttribute('href');
            
            // Create edit overlay
            const overlay = document.createElement('div');
            overlay.className = 'product-edit-overlay';
            overlay.innerHTML = generateEditFormHTML(productTitle, productPrice, productLink, productCard.querySelector('.product-image').src);
            
            document.body.appendChild(overlay);
            overlay.style.display = 'flex';
            
            // Add drag and drop functionality
            const dropZone = overlay.querySelector('#dropZone');
            const previewImage = overlay.querySelector('.preview-image');
            const imageInput = overlay.querySelector('#edit-image');

            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, preventDefaults, false);
                document.body.addEventListener(eventName, preventDefaults, false);
            });

            // Handle drop zone highlighting
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, highlight, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, unhighlight, false);
            });

            // Handle dropped files
            dropZone.addEventListener('drop', handleDrop, false);

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            function highlight(e) {
                dropZone.classList.add('dragover');
            }

            function unhighlight(e) {
                dropZone.classList.remove('dragover');
            }

            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;

                handleFiles(files);
            }

            function handleFiles(files) {
                if (files.length > 0) {
                    const file = files[0];
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            previewImage.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        showSuccessMessage('Please upload an image file');
                    }
                }
            }

            // Update existing file input handler
            imageInput.addEventListener('change', function(e) {
                handleFiles(e.target.files);
            });

            // Add this after creating the overlay:
            const addLinkBtn = overlay.querySelector('.add-link-btn');
            const linkOptions = overlay.querySelector('.link-options');
            const linkInput = overlay.querySelector('#edit-link');

            // Updated click handler for link options
            addLinkBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                linkOptions.style.display = linkOptions.style.display === 'none' ? 'block' : 'none';
            });

            // Update the link option click handlers
            overlay.querySelectorAll('.link-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    const link = option.getAttribute('data-link');
                    linkInput.value = link;
                    linkOptions.style.display = 'none';
                });
            });

            // Close link options when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.link-input-group') && !e.target.closest('.link-options')) {
                    if (linkOptions) linkOptions.style.display = 'none';
                }
            });

            // Handle save
            overlay.querySelector('.save-edit-btn').addEventListener('click', function() {
                const newTitle = overlay.querySelector('#edit-title').value;
                const newPrice = overlay.querySelector('#edit-price').value;
                const newImage = previewImage.src;
                const newLink = overlay.querySelector('#edit-link').value;
                const newRating = overlay.querySelector('#edit-rating').value;
                
                // Update the product display
                productCard.querySelector('.product-title').textContent = newTitle;
                productCard.querySelector('.product-price').textContent = `₹${newPrice}`;
                productCard.querySelector('.product-image').src = newImage;
                productCard.querySelector('a').href = newLink;
                productCard.querySelector('.rating-count').textContent = `(${newRating})`;
                
                // Save changes to localStorage
                const productId = productCard.querySelector('.select-checkbox').id;
                const editedProducts = JSON.parse(localStorage.getItem('editedProducts_index') || '{}');
                editedProducts[productId] = {
                    title: newTitle,
                    price: newPrice,
                    image: newImage,
                    link: newLink,
                    rating: newRating,
                    timestamp: Date.now() // Add timestamp for tracking changes
                };
                localStorage.setItem('editedProducts_index', JSON.stringify(editedProducts));
                
                // Add modified class to product card
                productCard.classList.add('modified');
                
                // Close overlay and show success message
                overlay.remove();
                showSuccessMessage('Changes saved successfully!');
            });
            
            // Handle close and cancel
            const closeOverlay = () => overlay.remove();
            overlay.querySelector('.close-edit').addEventListener('click', closeOverlay);
            overlay.querySelector('.cancel-edit-btn').addEventListener('click', closeOverlay);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeOverlay();
            });

            // Add this to the edit overlay event listeners
            const categorySelect = overlay.querySelector('#edit-category');
            if (categorySelect) {
                categorySelect.addEventListener('change', (e) => {
                    updateLinkOptions(e.target.value);
                    
                    // Show link options after updating
                    if (linkOptions) {
                        linkOptions.style.display = 'block';
                    }
                });
            }

            // Add these new event listeners
            overlay.addEventListener('click', function(e) {
                const linkOption = e.target.closest('.link-option');
                if (linkOption) {
                    e.preventDefault();
                    e.stopPropagation();
                    const link = linkOption.getAttribute('data-link');
                    const linkInput = overlay.querySelector('#edit-link');
                    if (linkInput) {
                        linkInput.value = link;
                        // Hide the options after selection
                        overlay.querySelector('.link-options').style.display = 'none';
                    }
                }
            });

            // Close link options when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.link-input-group') && !e.target.closest('.link-options')) {
                    const linkOptions = document.querySelector('.link-options');
                    if (linkOptions) {
                        linkOptions.style.display = 'none';
                    }
                }
            });
        });
    });

    // Handle checkbox changes
    document.querySelectorAll('.select-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const productCard = e.target.closest('.product-card');
            if (e.target.checked) {
                productCard.classList.add('selected');
            } else {
                productCard.classList.remove('selected');
            }
            
            // Show/hide save button based on selections
            const hasSelectedProducts = document.querySelectorAll('.select-checkbox:checked').length > 0;
            if (saveButton) {
                saveButton.style.display = hasSelectedProducts ? 'inline-flex' : 'none';
            }
        });
    });

    // Save button functionality
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            const hiddenProducts = [];
            
            try {
                saveButton.disabled = true;
                saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

                // Collect IDs of unchecked products (these will be hidden)
                document.querySelectorAll('.select-checkbox').forEach(checkbox => {
                    if (!checkbox.checked) {
                        hiddenProducts.push(checkbox.id);
                    }
                });

                // Save to localStorage with index-specific key
                localStorage.setItem(HIDDEN_PRODUCTS_KEY, JSON.stringify(hiddenProducts));

                // Show success message
                showSuccessMessage('Changes saved successfully!');

                // For non-admin users, hide unselected products immediately
                if (!isAdmin) {
                    document.querySelectorAll('.product-card').forEach(card => {
                        const productId = card.querySelector('.select-checkbox').id;
                        if (hiddenProducts.includes(productId)) {
                            card.style.display = 'none';
                        } else {
                            card.style.display = 'block';
                        }
                    });
                }

                // Exit edit mode but maintain selections
                document.body.classList.remove('edit-mode');
                const icon = document.querySelector('.fa-edit');
                if (icon) icon.style.color = '';

                // Hide save button
                saveButton.style.display = 'none';

            } catch (error) {
                console.error('Error saving changes:', error);
                showSuccessMessage('Error saving changes. Please try again.');
            } finally {
                saveButton.disabled = false;
                saveButton.innerHTML = '<i class="fas fa-save"></i> Save';
            }
        });
    }

    // Call loadSavedChanges when the page loads
    loadSavedChanges();
    updateCartCount(); // Add this line

    // Add smooth scrolling for category links
    document.querySelectorAll('.hero-categories .category-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active category based on scroll position
    window.addEventListener('scroll', function() {
        const categoryLinks = document.querySelectorAll('.hero-categories .category-link');
        categoryLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const rect = targetSection.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    });

    // Add video play/pause functionality
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const blogVideo = document.querySelector('.blog-video');

    if (playPauseBtn && blogVideo) {
        playPauseBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (blogVideo.paused) {
                blogVideo.play();
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                blogVideo.pause();
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }
    
    // Add Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const grid = entry.target;
                grid.classList.add('active');
                
                // Activate individual features with delay
                grid.querySelectorAll('.feature').forEach(feature => {
                    feature.classList.add('active');
                });
            }
        });
    }, observerOptions);

    // Observe the feature grid
    const featureGrid = document.querySelector('.feature-grid');
    if (featureGrid) {
        featureObserver.observe(featureGrid);
    }

    // Add mobile preview functionality
    const mobileViewToggle = document.querySelector('.mobile-view-toggle');
    
    if (mobileViewToggle) {
        mobileViewToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create mobile preview elements if they don't exist
            let previewContainer = document.querySelector('.mobile-preview-container');
            let overlay = document.querySelector('.mobile-preview-overlay');
            
            if (!previewContainer) {
                // Create container
                previewContainer = document.createElement('div');
                previewContainer.className = 'mobile-preview-container';
                
                // Create frame header with notch
                const frameHeader = document.createElement('div');
                frameHeader.className = 'mobile-frame-header';
                const notch = document.createElement('div');
                notch.className = 'mobile-frame-notch';
                frameHeader.appendChild(notch);
                previewContainer.appendChild(frameHeader);
                
                // Create iframe
                const iframe = document.createElement('iframe');
                iframe.className = 'mobile-preview-frame';
                iframe.src = window.location.href;
                previewContainer.appendChild(iframe);
                
                // Create overlay
                overlay = document.createElement('div');
                overlay.className = 'mobile-preview-overlay';
                
                // Create close button
                const closeButton = document.createElement('button');
                closeButton.className = 'close-preview';
                closeButton.innerHTML = '×';
                overlay.appendChild(closeButton);
                
                // Add elements to body
                document.body.appendChild(overlay);
                document.body.appendChild(previewContainer);
                
                // Add close functionality
                closeButton.addEventListener('click', closeMobilePreview);
                overlay.addEventListener('click', closeMobilePreview);
            }
            
            // Show preview
            previewContainer.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeMobilePreview() {
        const previewContainer = document.querySelector('.mobile-preview-container');
        const overlay = document.querySelector('.mobile-preview-overlay');
        
        if (previewContainer && overlay) {
            previewContainer.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Image Template functionality
    function initializeImageTemplate() {
        const imageItems = document.querySelectorAll('.image-item');
        
        imageItems.forEach(item => {
            item.addEventListener('click', () => {
                const link = item.getAttribute('data-link');
                if (link) {
                    window.location.href = link;
                }
            });

            // Add hover effect for touch devices
            item.addEventListener('touchstart', function() {
                this.classList.add('hover');
            });

            item.addEventListener('touchend', function() {
                this.classList.remove('hover');
            });
        });

        // Add intersection observer for animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        imageItems.forEach(item => observer.observe(item));
    }

    // Call this function in the DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing code ...
        
        initializeImageTemplate();
    });

    function initializeStickyBackgrounds() {
        const imageItems = document.querySelectorAll('.image-item');
        const stickyBgs = document.querySelectorAll('.sticky-bg');
        
        function updateBackgrounds() {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            imageItems.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const absoluteTop = window.scrollY + rect.top;
                const absoluteBottom = absoluteTop + rect.height;
                
                if (scrollPosition >= absoluteTop && scrollPosition < absoluteBottom) {
                    // Remove active class from all backgrounds
                    stickyBgs.forEach(bg => bg.classList.remove('active'));
                    // Add active class to current background
                    stickyBgs[index]?.classList.add('active');
                }
            });
        }

        // Update backgrounds on scroll
        window.addEventListener('scroll', updateBackgrounds);
        // Initial update
        updateBackgrounds();

        // Clean up on section exit
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyBgs.forEach(bg => bg.classList.remove('active'));
                }
            });
        });

        const section = document.querySelector('.image-template-section');
        if (section) {
            observer.observe(section);
        }
    }

    // Add to your DOMContentLoaded event listener
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing code ...
        initializeStickyBackgrounds();
    });

    // Add this to your existing JavaScript file
    const categoryDescription = document.querySelector('.category-description');
    
    // Add shooting stars
    for (let i = 0; i < 3; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        categoryDescription.appendChild(shootingStar);
    }
    
    // Add twinkling stars
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        categoryDescription.appendChild(star);
    }

    initializeReels();
});

// Add this after DOMContentLoaded event listener
document.addEventListener('scroll', function() {
    const posterSection = document.querySelector('.poster-section');
    const stickyBackground = document.querySelector('.sticky-background');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (posterSection && stickyBackground) {
        const rect = posterSection.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        
        // Calculate opacity based on scroll position
        let opacity = 1;
        
        // Fade in when entering viewport
        if (rect.top > 0) {
            opacity = 1 - (rect.top / viewHeight);
        }
        // Fade out when leaving viewport
        else if (rect.bottom < viewHeight) {
            opacity = rect.bottom / viewHeight;
        }
        
        stickyBackground.style.opacity = Math.max(0, Math.min(1, opacity));
        
        // Hide scroll indicator when user starts scrolling
        if (scrollIndicator && window.scrollY > viewHeight * 0.1) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '0.8';
        }
    }
});

// Add this after DOMContentLoaded event listener
document.addEventListener('scroll', function() {
    const posterSection = document.querySelector('.poster-section');
    const stickyBackground = document.querySelector('.sticky-background');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (posterSection && stickyBackground) {
        const rect = posterSection.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        
        // Calculate opacity based on scroll position
        let opacity = 1;
        
        // Fade in when entering viewport
        if (rect.top > 0) {
            opacity = 1 - (rect.top / viewHeight);
        }
        // Fade out when leaving viewport
        else if (rect.bottom < viewHeight) {
            opacity = rect.bottom / viewHeight;
        }
        
        stickyBackground.style.opacity = Math.max(0, Math.min(1, opacity));
        
        // Hide scroll indicator when user starts scrolling
        if (scrollIndicator && window.scrollY > viewHeight * 0.1) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '0.8';
        }
    }
});

// Add this to your existing scroll event listener
document.addEventListener('scroll', function() {
    const posterSection = document.querySelector('.poster-section');
    const stickyBackground = document.querySelector('.sticky-background');
    const posterContent = document.querySelector('.poster-content');
    
    if (posterSection && stickyBackground && posterContent) {
        const rect = posterSection.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        
        // Handle mobile devices differently
        if (window.innerWidth <= 768) {
            // Calculate opacity based on scroll position
            let opacity = 1;
            
            if (rect.top > 0) {
                opacity = 1 - (rect.top / viewHeight);
            } else if (rect.bottom < viewHeight) {
                opacity = rect.bottom / viewHeight;
            }
            
            // Apply opacity to background and content separately
            stickyBackground.style.opacity = Math.max(0, Math.min(1, opacity));
            posterContent.style.opacity = Math.max(0.5, Math.min(1, opacity)); // Keep content more visible
            
            // Add parallax effect for background on mobile
            if (rect.top <= 0 && rect.bottom >= 0) {
                const progress = -rect.top / (rect.height - viewHeight);
                stickyBackground.style.transform = `translateY(${progress * 50}px)`; // Subtle parallax
            }
        }
    }
});

// Add touch handling for mobile devices
let touchStartY = 0;
const posterSection = document.querySelector('.poster-section');

if (posterSection) {
    posterSection.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    posterSection.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;

        // Add smooth scroll indicator based on touch movement
        if (Math.abs(diff) > 50) {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '0';
            }
        }
    }, { passive: true });
}

function newFunction() {
    const ADMIN_EMAILS = [
        'abufiyan8@gmail.com',
        'owner@hasuta.com',
    ];

    const HIDDEN_PRODUCTS_KEY = 'hiddenProducts_index'; // Changed key to be collection-specific





    // Add this array at the top with other constants
    // Removed duplicate PRODUCT_PAGES declaration
    // Add this at the top with other constants
    const PRODUCT_CATEGORIES = {
        winter: {
            title: "Winter Collection",
            links: [
                { name: 'Winter Parka Jacket', link: '/wintar pd html and js&css file/H.Wpd1.html' },
                { name: 'Winter Sweater', link: '/All product ditails card/winter pd html file/H.Wpd2.html' },
                { name: 'Winter Thermal Set', link: '/All product ditails card/winter pd html file/H.Wpd3.html' },
                { name: 'Snow Boots Classic', link: '/All product ditails card/winter pd html file/H.Wpd4.html' },
                { name: 'Winter Gloves Pro', link: '/All product ditails card/winter pd html file/H.Wpd5.html' },
                { name: 'Winter Fleece Hoodie', link: '/All product ditails card/winter pd html file/H.Wpd6.html' },
                { name: 'Winter Down Vest', link: '/All product ditails card/winter pd html file/H.Wpd7.html' },
                { name: 'Winter Scarf Set', link: '/All product ditails card/winter pd html file/H.Wpd8.html' },
                { name: 'Thermal Base Layer', link: '/All product ditails card/winter pd html file/H.Wpd9.html' },
                { name: 'Winter Beanie Cap', link: '/All product ditails card/winter pd html file/H.Wpd10.html' },
                { name: 'Snow Pants Pro', link: '/All product ditails card/winter pd html file/H.Wpd11.html' },
                { name: 'Winter Socks Set', link: '/All product ditails card/winter pd html file/H.Wpd12.html' },
                { name: 'Insulated Jacket', link: '/All product ditails card/winter pd html file/H.Wpd13.html' },
                { name: 'Winter Mittens', link: '/All product ditails card/winter pd html file/H.Wpd14.html' },
                { name: 'Neck Warmer Pro', link: '/All product ditails card/winter pd html file/H.Wpd15.html' }
            ]
        },
        street: {
            title: "Street Collection",
            links: [
                { name: 'Street Cargo Pants', link: '/All product ditails card/street pd html file/H.Spd1.html' },
                { name: 'Street Bomber Jacket', link: '/All product ditails card/street pd html file/H.Spd2.html' },
                { name: 'Urban Hoodie', link: '/All product ditails card/street pd html file/H.Spd3.html' },
                { name: 'Graffiti Tee', link: '/All product ditails card/street pd html file/H.Spd4.html' },
                { name: 'Hip Hop Cap', link: '/All product ditails card/street pd html file/H.Spd5.html' },
                { name: 'Street Chain', link: '/All product ditails card/street pd html file/H.Spd6.html' },
                { name: 'Urban Sneakers', link: '/All product ditails card/street pd html file/H.Spd7.html' },
                { name: 'Street Backpack', link: '/All product ditails card/street pd html file/H.Spd8.html' },
                { name: 'Baggy Jeans', link: '/All product ditails card/street pd html file/H.Spd9.html' },
                { name: 'Urban Vest', link: '/All product ditails card/street pd html file/H.Spd10.html' },
                { name: 'Street Bandana', link: '/All product ditails card/street pd html file/H.Spd11.html' },
                { name: 'Urban Beanie', link: '/All product ditails card/street pd html file/H.Spd12.html' },
                { name: 'Hip Hop Shorts', link: '/All product ditails card/street pd html file/H.Spd13.html' },
                { name: 'Street Joggers', link: '/All product ditails card/street pd html file/H.Spd14.html' },
                { name: 'Urban Ring Set', link: '/All product ditails card/street pd html file/H.Spd15.html' }
            ]
        },
        summer: {
            title: "Summer Collection",
            links: [
                { name: 'Summer Tank Top', link: '/All product ditails card/summer pd html file/H.SUpd1.html' },
                { name: 'Beach Shorts', link: '/All product ditails card/summer pd html file/H.SUpd2.html' },
                { name: 'Tropical Shirt', link: '/All product ditails card/summer pd html file/H.SUpd3.html' },
                { name: 'Summer Hat', link: '/All product ditails card/summer pd html file/H.SUpd4.html' },
                { name: 'Beach Sandals', link: '/All product ditails card/summer pd html file/H.SUpd5.html' },
                { name: 'Swim Trunks', link: '/All product ditails card/summer pd html file/H.SUpd6.html' },
                { name: 'Summer Shades', link: '/All product ditails card/summer pd html file/H.SUpd7.html' },
                { name: 'Light Tee', link: '/All product ditails card/summer pd html file/H.SUpd8.html' },
                { name: 'Beach Bag', link: '/All product ditails card/summer pd html file/H.SUpd9.html' },
                { name: 'Summer Bracelet', link: '/All product ditails card/summer pd html file/H.SUpd10.html' },
                { name: 'Beach Towel', link: '/All product ditails card/summer pd html file/H.SUpd11.html' },
                { name: 'Light Hoodie', link: '/All product ditails card/summer pd html file/H.SUpd12.html' },
                { name: 'Summer Socks', link: '/All product ditails card/summer pd html file/H.SUpd13.html' },
                { name: 'Beach Cap', link: '/All product ditails card/summer pd html file/H.SUpd14.html' },
                { name: 'Summer Chain', link: '/All product ditails card/summer pd html file/H.SUpd15.html' }
            ]
        },
        surfer: {
            title: "Surfer Collection",
            links: [
                { name: 'Surf Board Shorts', link: '/All product ditails card/surfer pd html file/H.SRpd1.html' },
                { name: 'Rash Guard', link: '/All product ditails card/surfer pd html file/H.SRpd2.html' },
                { name: 'Beach Hoodie', link: '/All product ditails card/surfer pd html file/H.SRpd3.html' },
                { name: 'Surf Tee', link: '/All product ditails card/surfer pd html file/H.SRpd4.html' },
                { name: 'Wave Cap', link: '/All product ditails card/surfer pd html file/H.SRpd5.html' },
                { name: 'Beach Slides', link: '/All product ditails card/surfer pd html file/H.SRpd6.html' },
                { name: 'Surf Watch', link: '/All product ditails card/surfer pd html file/H.SRpd7.html' },
                { name: 'Beach Vest', link: '/All product ditails card/surfer pd html file/H.SRpd8.html' },
                { name: 'Surf Backpack', link: '/All product ditails card/surfer pd html file/H.SRpd9.html' },
                { name: 'Wave Necklace', link: '/All product ditails card/surfer pd html file/H.SRpd10.html' },
                { name: 'Beach Towel Pro', link: '/All product ditails card/surfer pd html file/H.SRpd11.html' },
                { name: 'Surf Jacket', link: '/All product ditails card/surfer pd html file/H.SRpd12.html' },
                { name: 'Wave Socks', link: '/All product ditails card/surfer pd html file/H.SRpd13.html' },
                { name: 'Beach Hat', link: '/All product ditails card/surfer pd html file/H.SRpd14.html' },
                { name: 'Surf Bracelet', link: '/All product ditails card/surfer pd html file/H.SRpd15.html' }
            ]
        },
        daily: {
            title: "Daily Use Collection",
            links: [
                { name: 'Daily Tee', link: '/All product ditails card/daily pd html file/H.Dpd1.html' },
                { name: 'Casual Pants', link: '/All product ditails card/daily pd html file/H.Dpd2.html' },
                { name: 'Basic Hoodie', link: '/All product ditails card/daily pd html file/H.Dpd3.html' },
                { name: 'Daily Cap', link: '/All product ditails card/daily pd html file/H.Dpd4.html' },
                { name: 'Basic Shoes', link: '/All product ditails card/daily pd html file/H.Dpd5.html' },
                { name: 'Daily Shorts', link: '/All product ditails card/daily pd html file/H.Dpd6.html' },
                { name: 'Basic Watch', link: '/All product ditails card/daily pd html file/H.Dpd7.html' },
                { name: 'Daily Jacket', link: '/All product ditails card/daily pd html file/H.Dpd8.html' },
                { name: 'Basic Backpack', link: '/All product ditails card/daily pd html file/H.Dpd9.html' },
                { name: 'Daily Chain', link: '/All product ditails card/daily pd html file/H.Dpd10.html' },
                { name: 'Basic Socks', link: '/All product ditails card/daily pd html file/H.Dpd11.html' },
                { name: 'Daily Vest', link: '/All product ditails card/daily pd html file/H.Dpd12.html' },
                { name: 'Basic Belt', link: '/All product ditails card/daily pd html file/H.Dpd13.html' },
                { name: 'Daily Beanie', link: '/All product ditails card/daily pd html file/H.Dpd14.html' },
                { name: 'Basic Bracelet', link: '/All product ditails card/daily pd html file/H.Dpd15.html' }
            ]
        }
    };

    // Add this after PRODUCT_CATEGORIES
    const CATEGORIES = [
        { id: 'winter', name: 'Winter Collection' },
        { id: 'street', name: 'Street Collection' },
        { id: 'summer', name: 'Summer Collection' },
        { id: 'surfer', name: 'Surfer Collection' },
        { id: 'daily', name: 'Daily Use Collection' }
    ];
    return { ADMIN_EMAILS, HIDDEN_PRODUCTS_KEY, PRODUCT_CATEGORIES, CATEGORIES };
}

// Helper Functions
function exitEditMode(icon) {
    if (icon) icon.style.color = '';
    // Hide checkboxes and edit icons
    document.querySelectorAll('.product-select, .product-edit').forEach(element => {
        element.style.display = 'none';
    });
    // Hide checkboxes and reset selections
    document.querySelectorAll('.product-select').forEach(select => {
        select.style.display = 'none';
    });
    document.querySelectorAll('.select-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
    // Hide save button
    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
        saveButton.style.display = 'none';
    }
}

export function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    document.body.appendChild(messageElement);

    setTimeout(() => messageElement.classList.add('show'), 10);
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => messageElement.remove(), 300);
    }, 3000);
}

// Update the cart count function to show total items
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        // Calculate total quantity of all items in cart
        const totalItems = cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
        
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems > 99 ? '99+' : totalItems;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Listen for cart updates
window.addEventListener('storage', (e) => {
    if (e.key === 'cartItems') {
        updateCartCount();
    }
});

// Call updateCartCount when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Add this function at the end to load saved changes:
function loadSavedChanges() {
    const editedProducts = JSON.parse(localStorage.getItem('editedProducts_index') || '{}');
    
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.querySelector('.select-checkbox').id;
        const savedData = editedProducts[productId];
        
        if (savedData) {
            card.querySelector('.product-title').textContent = savedData.title;
            card.querySelector('.product-price').textContent = `₹${savedData.price}`;
            card.querySelector('.product-image').src = savedData.image;
            card.querySelector('a').href = savedData.link;
            if (savedData.rating) {
                card.querySelector('.rating-count').textContent = `(${savedData.rating})`;
            }
            card.classList.add('modified');
        }
    });
}

function generateCategoryOptions() {
    return Object.entries(PRODUCT_CATEGORIES)
        .map(([key, category]) => `
            <div class="link-category" data-category="${key}">
                <h3 class="category-title">${category.title}</h3>
                ${category.links.map(page => `
                    <div class="link-option" data-link="${page.link}" data-name="${page.name}">
                        ${page.name}
                    </div>
                `).join('')}
            </div>
        `).join('');

}

// Update the edit form HTML generation to include category selection
function generateEditFormHTML(productTitle, productPrice, productLink, productImage) {
    // ...existing code...
    
    // Add this rating control section before the edit-actions div
    const currentRating = document.querySelector('.rating-count')?.textContent.replace(/[()]/g, '') || '4.5';
    
    return `
        <div class="product-edit-form">
            <button class="close-edit">&times;</button>
            <h2>Edit Product</h2>
            <div class="form-group">
                <label for="edit-category">Category</label>
                <select id="edit-category" class="category-select">
                    ${CATEGORIES.map(cat => 
                        `<option value="${cat.id}">${cat.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="edit-title">Product Title</label>
                <input type="text" id="edit-title" value="${productTitle}">
            </div>
            <div class="form-group">
                <label for="edit-price">Price (₹)</label>
                <input type="number" id="edit-price" value="${parseFloat(productPrice)}" min="0" step="0.01">
            </div>
            <div class="form-group">
                <label for="edit-link">Product View Page Link</label>
                <div class="link-input-group">
                    <input type="text" id="edit-link" value="${productLink || '#'}" placeholder="Enter product page URL">
                    <button type="button" class="add-link-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="link-options" style="display: none;">
                    ${generateCategoryOptions()}
                </div>
            </div>
            <div class="form-group">
                <label>Product Image</label>
                <div class="image-upload-container">
                    <div class="drag-drop-zone" id="dropZone">
                        <img src="${productImage}" alt="Product" class="preview-image">
                        <p class="drag-drop-text">Drag & drop an image here or</p>
                        <input type="file" id="edit-image" accept="image/*">
                        <label for="edit-image" class="upload-label">Choose File</label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="edit-rating">Rating (0.0 - 5.0)</label>
                <input type="number" 
                       id="edit-rating" 
                       value="${currentRating}" 
                       min="0" 
                       max="5" 
                       step="0.1" 
                       placeholder="Enter rating (e.g., 4.5)">
            </div>
            <div class="edit-actions">
                <button class="cancel-edit-btn">Cancel</button>
                <button class="save-edit-btn">Save Changes</button>
            </div>
        </div>
    `;
}

// Update the link options generation based on selected category
function updateLinkOptions(selectedCategory) {
    const linkOptions = document.querySelector('.link-options');
    if (!linkOptions) return;

    const category = PRODUCT_CATEGORIES[selectedCategory];
    if (!category) return;

    const linksHTML = category.links.map(page => `
        <div class="link-option" data-link="${page.link}">
            ${page.name}
        </div>
    `).join('');

    linkOptions.innerHTML = `
        <div class="link-category">
            <h3 class="category-title">${category.title}</h3>
            ${linksHTML}
        </div>
    `;
}

// ...existing code...

// Update the mobile preview creation
function createMobilePreview() {
    const container = document.createElement('div');
    container.className = 'mobile-preview-container';
    
    // Add status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'mobile-frame-status';
    statusBar.innerHTML = `
        <div class="status-left">
            <span class="status-time">${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
        </div>
        <div class="status-right">
            <i class="fas fa-signal"></i>
            <i class="fas fa-wifi"></i>
            <div class="status-battery">
                <div class="battery-level"></div>
            </div>
        </div>
    `;
    
    // Add device buttons
    const buttons = document.createElement('div');
    buttons.className = 'mobile-frame-buttons';
    buttons.innerHTML = `
        <div class="volume-button"></div>
        <div class="volume-button"></div>
        <div class="power-button"></div>
    `;
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'mobile-preview-frame';
    iframe.src = window.location.href;
    
    // Add home indicator
    const homeIndicator = document.createElement('div');
    homeIndicator.className = 'mobile-frame-home';
    
    // Assemble preview
    container.appendChild(statusBar);
    container.appendChild(buttons);
    container.appendChild(iframe);
    container.appendChild(homeIndicator);
    
    return container;
}

// Update mobile view toggle handler
if (mobileViewToggle) {
    mobileViewToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        let previewContainer = document.querySelector('.mobile-preview-container');
        let overlay = document.querySelector('.mobile-preview-overlay');
        
        if (!previewContainer) {
            previewContainer = createMobilePreview();
            overlay = document.createElement('div');
            overlay.className = 'mobile-preview-overlay';
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.className = 'close-preview';
            closeButton.innerHTML = '×';
            overlay.appendChild(closeButton);
            
            // Add elements to body
            document.body.appendChild(overlay);
            document.body.appendChild(previewContainer);
            
            // Add close functionality
            closeButton.addEventListener('click', closeMobilePreview);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeMobilePreview();
            });
            
            // Update time periodically
            setInterval(() => {
                const timeEl = previewContainer.querySelector('.status-time');
                if (timeEl) {
                    timeEl.textContent = new Date().toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                    });
                }
            }, 1000);
        }
        
        // Show preview with animation
        previewContainer.style.display = 'block';
        overlay.style.display = 'block';
        setTimeout(() => previewContainer.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    });
}

function closeMobilePreview() {
    const previewContainer = document.querySelector('.mobile-preview-container');
    const overlay = document.querySelector('.mobile-preview-overlay');
    
    if (previewContainer && overlay) {
        previewContainer.classList.remove('show');
        setTimeout(() => {
            previewContainer.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// Handle Reels Functionality
function initializeReels() {
    document.querySelectorAll('.reel-card').forEach(card => {
        const video = card.querySelector('.reel-video');
        const playBtn = card.querySelector('.play-btn');
        const soundBtn = card.querySelector('.sound-btn');
        let isPlaying = false;

        // Function to handle play/pause
        function togglePlay() {
            if (video.paused) {
                // Pause all other videos first
                document.querySelectorAll('.reel-video').forEach(v => {
                    if (v !== video) {
                        v.pause();
                        const otherPlayBtn = v.closest('.reel-card').querySelector('.play-btn');
                        otherPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                });

                // Play this video
                video.play().then(() => {
                    isPlaying = true;
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(err => {
                    console.log("Video playback error:", err);
                });
            } else {
                video.pause();
                isPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }

        // Play/Pause button click
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });

        // Card click to play/pause
        card.addEventListener('click', () => {
            togglePlay();
        });

        // Mute/Unmute button click
        soundBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            soundBtn.innerHTML = video.muted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        });

        // Pause when out of view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && isPlaying) {
                    video.pause();
                    isPlaying = false;
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(card);
    });
}

// Call the initialization function when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    /* ...existing code... */
    initializeReels();
});

/* ...existing code... */
