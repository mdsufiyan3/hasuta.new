// Add admin emails array and constants
const ADMIN_EMAILS = [
    'abufiyan8@gmail.com',   // Admin email
    'owner@hasuta.com',      // Owner email
];

const HIDDEN_PRODUCTS_KEY = 'hiddenProducts_HIM-HAR'; // Changed key to be collection-specific

// Add this array at the top with other constants
// Removed duplicate PRODUCT_PAGES declaration

// Add this at the top with other constants
const PRODUCT_CATEGORIES = {
    ACCESSORIES: {
        title: "HIM-HAR Collection",
        links: [
            { name: 'ACCESSORIES Parka Jacket', link: '/wintar pd html and js&css file/H.Wpd1.html' },
            { name: 'ACCESSORIES Sweater', link: '/All product ditails card/HIM-HAR product/product 2.html' },
            { name: 'ACCESSORIES Thermal Set', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd3.html' },
            { name: 'Snow Boots Classic', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd4.html' },
            { name: 'ACCESSORIES Gloves Pro', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd5.html' },
            { name: 'ACCESSORIES Fleece Hoodie', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd6.html' },
            { name: 'ACCESSORIES Down Vest', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd7.html' },
            { name: 'ACCESSORIES Scarf Set', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd8.html' },
            { name: 'Thermal Base Layer', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd9.html' },
            { name: 'ACCESSORIES Beanie Cap', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd10.html' },
            { name: 'Snow Pants Pro', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd11.html' },
            { name: 'ACCESSORIES Socks Set', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd12.html' },
            { name: 'Insulated Jacket', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd13.html' },
            { name: 'ACCESSORIES Mittens', link: '/All product ditails card/ACCESSORIES pd html file/H.Wpd14.html' },
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

// Add this after the PRODUCT_CATEGORIES constant
function generateLinkOptions() {
    let html = '';
    for (const [category, data] of Object.entries(PRODUCT_CATEGORIES)) {
        html += `
            <div class="link-category">
                <h3 class="category-title">${data.title}</h3>
                ${data.links.map(link => `
                    <div class="link-option" data-link="${link.link}">
                        ${link.name}
                    </div>
                `).join('')}
            </div>
        `;
    }
    return html;
}

// Add this function after other constants
function loadSavedPosterChanges() {
    try {
        const editedPosters = JSON.parse(localStorage.getItem('editedPosters') || '{}');
        
        document.querySelectorAll('.category-poster').forEach(poster => {
            const sectionId = poster.closest('section').id;
            const savedData = editedPosters[sectionId];
            
            if (savedData) {
                const posterImage = poster.querySelector('.poster-image');
                const posterTitle = poster.querySelector('.poster-title');
                const posterDescription = poster.querySelector('.poster-description');
                
                if (posterImage && savedData.image) {
                    posterImage.src = savedData.image;
                }
                if (posterTitle && savedData.title) {
                    posterTitle.textContent = savedData.title;
                }
                if (posterDescription && savedData.description) {
                    posterDescription.textContent = savedData.description;
                }
            }
        });
    } catch (error) {
        console.error('Error loading saved poster changes:', error);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check login status and admin privileges
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    const saveButton = document.querySelector('.save-button');
    const editIcon = document.querySelector('.fa-edit')?.parentElement;

    // Get the edit icon element
    const navEditIcon = document.querySelector('.nav-icon.admin-only');

    // Hide edit icon by default
    if (navEditIcon) {
        navEditIcon.style.display = 'none';
    }

    // Only show edit icon if user is logged in and is an admin
    if (isLoggedIn && isAdmin && navEditIcon) {
        navEditIcon.style.display = 'block';
    }

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
                const editedProducts = JSON.parse(localStorage.getItem('editedProducts_HIM-HAR') || '{}');
                editedProducts[productId] = {
                    title: newTitle,
                    price: newPrice,
                    image: newImage,
                    link: newLink,
                    rating: newRating,
                    timestamp: Date.now() // Add timestamp for tracking changes
                };
                localStorage.setItem('editedProducts_HIM-HAR', JSON.stringify(editedProducts));
                
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

                // Save to localStorage with HIM-HAR-specific key
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
    loadSavedPosterChanges(); // Add this line
    loadSavedChanges();
    updateCartCount(); // Add this line

    // Add product numbers to all product cards
    document.querySelectorAll('.category-row').forEach((row, categoryIndex) => {
        row.querySelectorAll('.product-card').forEach((card, productIndex) => {
            // Create product number element
            const productNumber = document.createElement('div');
            productNumber.className = 'product-number';
            productNumber.textContent = `#${(categoryIndex + 1).toString().padStart(2, '0')}-${(productIndex + 1).toString().padStart(2, '0')}`;
            card.appendChild(productNumber);
            
            // Store number as data attribute
            card.dataset.productNumber = productNumber.textContent;
        });
    });

    // Update the edit overlay generation
    function generateEditFormHTML(productTitle, productPrice, productLink, primaryImage, secondaryImage, productNumber) {
        return `
            <div class="product-edit-form">
                <button class="close-edit">&times;</button>
                <div class="product-number-display">${productNumber}</div>
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
                    <label>Primary Product Image</label>
                    <div class="image-upload-container">
                        <div class="drag-drop-zone" id="primaryDropZone">
                            <img src="${primaryImage}" alt="Product Primary" class="preview-image primary-preview">
                            <p class="drag-drop-text">Drag & drop primary image here or</p>
                            <input type="file" id="edit-primary-image" accept="image/*">
                            <label for="edit-primary-image" class="upload-label">Choose Primary Image</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Secondary Product Image (Hover)</label>
                    <div class="image-upload-container">
                        <div class="drag-drop-zone" id="secondaryDropZone">
                            <img src="${secondaryImage}" alt="Product Secondary" class="preview-image secondary-preview">
                            <p class="drag-drop-text">Drag & drop secondary image here or</p>
                            <input type="file" id="edit-secondary-image" accept="image/*">
                            <label for="edit-secondary-image" class="upload-label">Choose Secondary Image</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="edit-rating">Rating (0.0 - 5.0)</label>
                    <input type="number" 
                           id="edit-rating" 
                           value="${document.querySelector('.rating-count')?.textContent.replace(/[()]/g, '') || '4.5'}" 
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

    // Update the edit icon click handler
    document.querySelectorAll('.product-edit').forEach(editIcon => {
        editIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const productNumber = productCard.dataset.productNumber;
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent
                .replace('₹', '')
                .replace(/,/g, '');
            const productId = productCard.querySelector('.select-checkbox').id;
            const productLink = productCard.querySelector('a').getAttribute('href');
            const primaryImage = productCard.querySelector('.product-image-primary').src;
            const secondaryImage = productCard.querySelector('.product-image-secondary').src;
            const productRating = productCard.querySelector('.rating-count').textContent.replace(/[()]/g, '');
            
            const overlay = document.createElement('div');
            overlay.className = 'product-edit-overlay';
            overlay.style.display = 'flex'; // Force display flex
            overlay.innerHTML = generateEditFormHTML(
                productTitle,
                productPrice,
                productLink,
                primaryImage,
                secondaryImage,
                productNumber // Add product number to parameters
            );
            
            document.body.appendChild(overlay);

            // Set the current values
            const editForm = overlay.querySelector('.product-edit-form');
            editForm.querySelector('#edit-title').value = productTitle;
            editForm.querySelector('#edit-price').value = productPrice;
            editForm.querySelector('#edit-link').value = productLink;
            editForm.querySelector('#edit-rating').value = productRating;
            editForm.querySelector('.primary-preview').src = primaryImage;
            editForm.querySelector('.secondary-preview').src = secondaryImage;

            // Add drag and drop functionality
            initializeDragAndDrop(overlay);

            // Initialize close handlers
            initializeCloseHandlers(overlay);
            
            // Initialize save functionality
            initializeSaveHandler(overlay, productCard);
        });
    });

});

// Helper Functions
function exitEditMode(icon) {
    if (icon) icon.style.color = '';
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

function showSuccessMessage(message) {
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

// Update the cart count function
function updateCartCount() {
    try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartStickers = document.querySelectorAll('.cart-sticker');
        
        cartStickers.forEach(cartSticker => {
            // Remove existing cart count
            const existingCount = cartSticker.nextElementSibling;
            if (existingCount && existingCount.classList.contains('cart-count')) {
                existingCount.remove();
            }

            // Calculate total items
            const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
            
            // Only show count if there are items
            if (totalItems > 0) {
                const cartCount = document.createElement('span');
                cartCount.className = 'cart-count';
                cartCount.textContent = totalItems;
                cartSticker.insertAdjacentElement('afterend', cartCount);
            }
        });
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Call updateCartCount on page load
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    updateCartCount(); // Make sure this is called
});

// Update cart count when localStorage changes
window.addEventListener('storage', function(e) {
    if (e.key === 'cartItems') {
        updateCartCount();
    }
});

// Add this function at the end to load saved changes:
function loadSavedChanges() {
    try {
        const editedProducts = JSON.parse(localStorage.getItem('editedProducts_HIM-HAR') || '{}');
        
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.querySelector('.select-checkbox').id;
            const savedData = editedProducts[productId];
            
            if (savedData) {
                // Update all elements with proper error checking
                const elements = {
                    title: card.querySelector('.product-title'),
                    price: card.querySelector('.product-price'),
                    primaryImage: card.querySelector('.product-image-primary'),
                    secondaryImage: card.querySelector('.product-image-secondary'),
                    link: card.querySelector('a'),
                    rating: card.querySelector('.rating-count')
                };

                // Update each element if it exists and has saved data
                if (elements.title && savedData.title) {
                    elements.title.textContent = savedData.title;
                }
                
                if (elements.price && savedData.price) {
                    elements.price.textContent = `₹${savedData.price}`;
                }
                
                if (elements.primaryImage && savedData.primaryImage) {
                    elements.primaryImage.src = savedData.primaryImage;
                }
                
                if (elements.secondaryImage && savedData.secondaryImage) {
                    elements.secondaryImage.src = savedData.secondaryImage;
                }
                
                if (elements.link && savedData.link) {
                    elements.link.href = savedData.link;
                }
                
                if (elements.rating) {
                    elements.rating.textContent = savedData.rating ? `(${savedData.rating})` : '';
                }

                // Mark card as modified
                card.classList.add('modified');
            }
        });
    } catch (error) {
        console.error('Error loading saved changes:', error);
    }
}

// Update the save functionality in initializeSaveHandler
function initializeSaveHandler(overlay, productCard) {
    const saveButton = overlay.querySelector('.save-edit-btn');
    
    saveButton.addEventListener('click', function() {
        try {
            const formData = {
                title: overlay.querySelector('#edit-title').value,
                price: overlay.querySelector('#edit-price').value,
                primaryImage: overlay.querySelector('.primary-preview').src,
                secondaryImage: overlay.querySelector('.secondary-preview').src,
                link: overlay.querySelector('#edit-link').value,
                rating: overlay.querySelector('#edit-rating').value
            };
            
            // Update the product card display
            const updateElements = {
                title: productCard.querySelector('.product-title'),
                price: productCard.querySelector('.product-price'),
                primaryImage: productCard.querySelector('.product-image-primary'),
                secondaryImage: productCard.querySelector('.product-image-secondary'),
                link: productCard.querySelector('a'),
                rating: productCard.querySelector('.rating-count')
            };

            // Update DOM elements
            if (updateElements.title) updateElements.title.textContent = formData.title;
            if (updateElements.price) updateElements.price.textContent = `₹${formData.price}`;
            if (updateElements.primaryImage) updateElements.primaryImage.src = formData.primaryImage;
            if (updateElements.secondaryImage) updateElements.secondaryImage.src = formData.secondaryImage;
            if (updateElements.link) updateElements.link.href = formData.link;
            if (updateElements.rating) updateElements.rating.textContent = formData.rating ? `(${formData.rating})` : '';
            
            // Save to localStorage
            const productId = productCard.querySelector('.select-checkbox').id;
            const editedProducts = JSON.parse(localStorage.getItem('editedProducts_HIM-HAR') || '{}');
            
            editedProducts[productId] = {
                ...formData,
                timestamp: Date.now()
            };
            
            localStorage.setItem('editedProducts_HIM-HAR', JSON.stringify(editedProducts));
            
            // Add modified class
            productCard.classList.add('modified');
            
            // Close overlay and show success message
            overlay.remove();
            showSuccessMessage('Changes saved successfully!');
            
        } catch (error) {
            console.error('Error saving changes:', error);
            showSuccessMessage('Error saving changes. Please try again.');
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
function generateEditFormHTML(productTitle, productPrice, productLink, primaryImage, secondaryImage) {
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
                <label>Primary Product Image</label>
                <div class="image-upload-container">
                    <div class="drag-drop-zone" id="primaryDropZone">
                        <img src="${primaryImage}" alt="Product Primary" class="preview-image primary-preview">
                        <p class="drag-drop-text">Drag & drop primary image here or</p>
                        <input type="file" id="edit-primary-image" accept="image/*">
                        <label for="edit-primary-image" class="upload-label">Choose Primary Image</label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Secondary Product Image (Hover)</label>
                <div class="image-upload-container">
                    <div class="drag-drop-zone" id="secondaryDropZone">
                        <img src="${secondaryImage}" alt="Product Secondary" class="preview-image secondary-preview">
                        <p class="drag-drop-text">Drag & drop secondary image here or</p>
                        <input type="file" id="edit-secondary-image" accept="image/*">
                        <label for="edit-secondary-image" class="upload-label">Choose Secondary Image</label>
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

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    // Update the edit icon click event handlers
    document.querySelectorAll('.product-edit').forEach(editIcon => {
        editIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent
                .replace('₹', '')
                .replace(/,/g, '');
            const productId = productCard.querySelector('.select-checkbox').id;
            const productLink = productCard.querySelector('a').getAttribute('href');
            const primaryImage = productCard.querySelector('.product-image-primary').src;
            const secondaryImage = productCard.querySelector('.product-image-secondary').src;
            const productRating = productCard.querySelector('.rating-count').textContent.replace(/[()]/g, '');
            
            const overlay = document.createElement('div');
            overlay.className = 'product-edit-overlay';
            overlay.style.display = 'flex'; // Force display flex
            overlay.innerHTML = generateEditFormHTML(productTitle, productPrice, productLink, primaryImage, secondaryImage);
            
            document.body.appendChild(overlay);

            // Set the current values
            const editForm = overlay.querySelector('.product-edit-form');
            editForm.querySelector('#edit-title').value = productTitle;
            editForm.querySelector('#edit-price').value = productPrice;
            editForm.querySelector('#edit-link').value = productLink;
            editForm.querySelector('#edit-rating').value = productRating;
            editForm.querySelector('.primary-preview').src = primaryImage;
            editForm.querySelector('.secondary-preview').src = secondaryImage;

            // Add drag and drop functionality
            initializeDragAndDrop(overlay);

            // Initialize close handlers
            initializeCloseHandlers(overlay);
            
            // Initialize save functionality
            initializeSaveHandler(overlay, productCard);
        });
    });
});

function initializeDragAndDrop(overlay) {
    const dropZones = {
        primary: overlay.querySelector('#primaryDropZone'),
        secondary: overlay.querySelector('#secondaryDropZone')
    };
    
    const previews = {
        primary: overlay.querySelector('.primary-preview'),
        secondary: overlay.querySelector('.secondary-preview')
    };
    
    const inputs = {
        primary: overlay.querySelector('#edit-primary-image'),
        secondary: overlay.querySelector('#edit-secondary-image')
    };

    // Handle both drop zones
    ['primary', 'secondary'].forEach(type => {
        const dropZone = dropZones[type];
        const preview = previews[type];
        const input = inputs[type];

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => highlight(dropZone));
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => unhighlight(dropZone));
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            handleFiles(dt.files, preview);
        });

        input.addEventListener('change', (e) => {
            handleFiles(e.target.files, preview);
        });
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(element) {
        element.classList.add('dragover');
    }

    function unhighlight(element) {
        element.classList.remove('dragover');
    }

    function handleFiles(files, previewElement) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewElement.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }
}

function initializeCloseHandlers(overlay) {
    const closeButton = overlay.querySelector('.close-edit');
    const cancelButton = overlay.querySelector('.cancel-edit-btn');

    const closeOverlay = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    };

    closeButton.addEventListener('click', closeOverlay);
    cancelButton.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });
}

// Add Intersection Observer for poster animations
document.addEventListener('DOMContentLoaded', function() {
    const posters = document.querySelectorAll('.category-poster');
    
    const posterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the poster is visible
    };
    
    const posterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optionally stop observing after animation
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class when poster is out of view
                // entry.target.classList.remove('in-view');
            }
        });
    }, posterObserverOptions);

    posters.forEach(poster => {
        posterObserver.observe(poster);
    });
});

// Add Intersection Observer for poster animations
document.addEventListener('DOMContentLoaded', function() {
    const posters = document.querySelectorAll('.category-poster');
    
    const posterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.2
    });

    posters.forEach(poster => {
        posterObserver.observe(poster);
    });
});

/* ...existing code... */

// Add this after your existing click handlers
document.querySelectorAll('.poster-edit').forEach(editButton => {
    editButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const poster = this.closest('.category-poster');
        const posterTitle = poster.querySelector('.poster-title').textContent;
        const posterDescription = poster.querySelector('.poster-description').textContent;
        const posterImage = poster.querySelector('.poster-image').src;
        
        // Create edit overlay
        const overlay = document.createElement('div');
        overlay.className = 'poster-edit-overlay';
        overlay.innerHTML = `
            <div class="poster-edit-form">
                <button class="close-edit">&times;</button>
                <h2>Edit Poster</h2>
                
                <div class="poster-form-group">
                    <label for="poster-title">Poster Title</label>
                    <input type="text" id="poster-title" value="${posterTitle}">
                </div>
                
                <div class="poster-form-group">
                    <label for="poster-description">Poster Description</label>
                    <textarea id="poster-description">${posterDescription}</textarea>
                </div>
                
                <div class="poster-form-group">
                    <label for="poster-image">Poster Image</label>
                    <div class="image-upload-container">
                        <img src="${posterImage}" alt="Poster Preview" class="poster-image-preview">
                        <input type="file" id="poster-image" accept="image/*">
                        <label for="poster-image" class="upload-label">Choose New Image</label>
                    </div>
                </div>
                
                <div class="poster-edit-actions">
                    <button class="poster-cancel-btn">Cancel</button>
                    <button class="poster-save-btn">Save Changes</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';
        
        // Handle image upload
        const imageInput = overlay.querySelector('#poster-image');
        const imagePreview = overlay.querySelector('.poster-image-preview');
        
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagePreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Handle save
        overlay.querySelector('.poster-save-btn').addEventListener('click', function() {
            const newTitle = overlay.querySelector('#poster-title').value;
            const newDescription = overlay.querySelector('#poster-description').value;
            const newImage = imagePreview.src;
            
            // Update the poster content
            poster.querySelector('.poster-title').textContent = newTitle;
            poster.querySelector('.poster-description').textContent = newDescription;
            poster.querySelector('.poster-image').src = newImage;
            
            // Save to localStorage
            const sectionId = poster.closest('section').id;
            const editedPosters = JSON.parse(localStorage.getItem('editedPosters') || '{}');
            editedPosters[sectionId] = {
                title: newTitle,
                description: newDescription,
                image: newImage,
                timestamp: Date.now()
            };
            localStorage.setItem('editedPosters', JSON.stringify(editedPosters));
            
            // Close overlay and show success message
            overlay.remove();
            showSuccessMessage('Poster updated successfully!');
        });
        
        // Handle close
        const closeOverlay = () => overlay.remove();
        overlay.querySelector('.close-edit').addEventListener('click', closeOverlay);
        overlay.querySelector('.poster-cancel-btn').addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });
    });
});

/* ...existing code... */

// Update the product edit click handler
document.addEventListener('click', function(e) {
    // Handle link options toggle
    if (e.target.closest('.add-link-btn')) {
        const linkOptions = e.target.closest('.form-group').querySelector('.link-options');
        linkOptions.style.display = linkOptions.style.display === 'none' ? 'block' : 'none';
    }

    // Handle link option selection
    if (e.target.closest('.link-option')) {
        const option = e.target.closest('.link-option');
        const link = option.dataset.link;
        const input = option.closest('.form-group').querySelector('#edit-link');
        const linkOptions = option.closest('.link-options');
        
        input.value = link;
        linkOptions.style.display = 'none';
    }

    // Close link options when clicking outside
    if (!e.target.closest('.link-input-group') && !e.target.closest('.link-options')) {
        document.querySelectorAll('.link-options').forEach(el => {
            el.style.display = 'none';
        });
    }
});

/* ...existing code... */