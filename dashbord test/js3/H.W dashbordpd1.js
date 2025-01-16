import ProductSync from '/js/product-sync.js';

document.addEventListener('DOMContentLoaded', function() {
    const editOverlay = document.getElementById('editOverlay');
    const closeOverlay = document.querySelector('.close-overlay');
    const editForm = document.getElementById('editProductForm');
    const editIcon = document.querySelector('.edit-icon');

    // Load initial state
    loadSavedState();

    // Edit icon click handler
    if (editIcon) {
        editIcon.addEventListener('click', function() {
            if (editOverlay) {
                editOverlay.style.display = 'flex';
                
                // Get current state from localStorage and product name
                const { stockStatus, sizes } = ProductSync.getProductData(1);
                const productName = document.querySelector('.product-title').textContent;
                
                // Update form fields including product name
                document.getElementById('editName').value = productName;
                document.getElementById('editStockStatus').value = stockStatus;
                
                // Update checkboxes
                document.querySelectorAll('.edit-size-options input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = sizes.includes(checkbox.value);
                });
            }
        });
    }

    // Update close overlay handler
    function closeEditOverlay() {
        if (editOverlay) {
            editOverlay.style.display = 'none';
        }
    }

    if (closeOverlay) {
        closeOverlay.addEventListener('click', closeEditOverlay);
    }

    // Update overlay outside click handler
    editOverlay.addEventListener('click', function(e) {
        if (e.target === editOverlay) {
            closeEditOverlay();
        }
    });

    // Update Escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && editOverlay.style.display === 'flex') {
            closeEditOverlay();
        }
    });

    // Form submission handler
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const saveBtn = this.querySelector('.save-btn');
        
        try {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            const formData = {
                stockStatus: document.getElementById('editStockStatus').value,
                sizes: Array.from(document.querySelectorAll('.edit-size-options input:checked')).map(cb => cb.value)
            };

            // Save data using ProductSync
            await ProductSync.updateProductData(1, formData);

            // Update UI
            updateStockStatus(formData.stockStatus);
            updateSizeButtonsDisplay();

            // Close overlay after successful save
            editOverlay.style.display = 'none';
            
            showMessage('success', 'Changes saved successfully!');

        } catch (error) {
            console.error('Error saving:', error);
            showMessage('error', 'Failed to save changes');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        }
    });

    // Helper function to show messages
    function showMessage(type, text) {
        const message = document.createElement('div');
        message.className = `message ${type}-message`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'times'}-circle"></i>
            ${text}
        `;
        document.body.appendChild(message);
        setTimeout(() => message.classList.add('show'), 10);
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // Helper function to update stock status
    function updateStockStatus(status) {
        const stockStatus = document.querySelector('.stock-status');
        stockStatus.className = `stock-status ${status}`;
        
        const icon = stockStatus.querySelector('i');
        const text = stockStatus.querySelector('span');
        
        if (status === 'in-stock') {
            icon.className = 'fas fa-check-circle';
            text.textContent = 'In Stock';
        } else if (status === 'out-of-stock') {
            icon.className = 'fas fa-times-circle';
            text.textContent = 'Out of Stock';
        } else if (status === 'low-stock') {
            icon.className = 'fas fa-exclamation-circle';
            text.textContent = 'Low Stock';
        }
    }

    // Function to update size buttons display
    function updateSizeButtonsDisplay() {
        const savedSizes = JSON.parse(localStorage.getItem('pd1_productSizes')) || ['M', 'L', 'XL']; // Changed from pd3 to pd6
        const sizeButtons = document.querySelectorAll('.size-btn');
        
        sizeButtons.forEach(btn => {
            const size = btn.getAttribute('data-size');
            if (savedSizes.includes(size)) {
                btn.classList.add('available');
                btn.classList.remove('unavailable');
            } else {
                btn.classList.remove('available');
                btn.classList.add('unavailable');
            }
        });
    }

    // Add this new function to load saved state
    function loadSavedState() {
        const productId = 1; // For pd6, changed from pd3
        const { stockStatus, sizes } = ProductSync.getProductData(productId);
        
        // Update stock status display
        const stockStatusEl = document.querySelector('.stock-status');
        const statusIcon = stockStatusEl.querySelector('i');
        const statusText = stockStatusEl.querySelector('span');

        stockStatusEl.className = `stock-status ${stockStatus}`;
        
        if (stockStatus === 'in-stock') {
            statusIcon.className = 'fas fa-check-circle';
            statusText.textContent = 'In Stock';
        } else if (stockStatus === 'out-of-stock') {
            statusIcon.className = 'fas fa-times-circle';
            statusText.textContent = 'Out of Stock';
        } else if (stockStatus === 'low-stock') {
            statusIcon.className = 'fas fa-exclamation-circle';
            statusText.textContent = 'Low Stock';
        }

        // Update size buttons
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(btn => {
            const size = btn.getAttribute('data-size');
            btn.classList.toggle('available', sizes.includes(size));
            btn.classList.toggle('unavailable', !sizes.includes(size));
        });
    }

    // Call loadSavedState when page loads
    loadSavedState();

    // Initialize size buttons display
    updateSizeButtonsDisplay();

    // Update view details button functionality
    const viewDetailsBtn = document.querySelector('.view-details-btn');
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function() {
            const productId = document.querySelector('.product-card-large').dataset.productId;
            window.location.href = `/All product ditails card/wintar pd html file/H.Wpd1.html?id=${productId}`; // Changed from pd3 to pd6
        });
    }

    // Update the loadSavedState call
    try {
        loadSavedState();
    } catch (error) {
        console.error('Error loading saved state:', error);
        handleLoadError();
    }
});
