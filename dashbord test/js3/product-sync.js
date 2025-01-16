const ProductSync = {
    getProductData(productId) {
        const savedStatus = localStorage.getItem(`pd${productId}_stockStatus`);
        const savedSizes = localStorage.getItem(`pd${productId}_productSizes`);
        
        return {
            stockStatus: savedStatus || 'in-stock',
            sizes: savedSizes ? JSON.parse(savedSizes) : ['M', 'L', 'XL']
        };
    },

    async updateProductData(productId, data) {
        try {
            // Save stock status
            if (data.stockStatus) {
                localStorage.setItem(`pd${productId}_stockStatus`, data.stockStatus);
                
                // If out of stock, mark all sizes as sold out
                if (data.stockStatus === 'out-of-stock') {
                    const allSizes = ['M', 'L', 'XL'];
                    localStorage.setItem(`pd${productId}_soldOutSizes`, JSON.stringify(allSizes));
                    localStorage.setItem(`pd${productId}_productSizes`, JSON.stringify([]));
                } else {
                    // Otherwise, use the selected sizes
                    const availableSizes = data.sizes || [];
                    const soldOutSizes = ['M', 'L', 'XL'].filter(size => !availableSizes.includes(size));
                    localStorage.setItem(`pd${productId}_productSizes`, JSON.stringify(availableSizes));
                    localStorage.setItem(`pd${productId}_soldOutSizes`, JSON.stringify(soldOutSizes));
                }
            }

            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('product-updated', { 
                detail: { productId, ...data } 
            }));

            return true;
        } catch (error) {
            console.error('Error saving product data:', error);
            throw error;
        }
    },

    // Add method to clear saved data
    clearSavedData(productId) {
        localStorage.removeItem(`pd${productId}_stockStatus`);
        localStorage.removeItem(`pd${productId}_productSizes`);
        localStorage.removeItem(`pd${productId}_soldOutSizes`);
    }
};

export default ProductSync;
