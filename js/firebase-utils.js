import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Save Cart with proper path
export async function saveCart(userId, cartItems) {
    if (!userId) return;
    const cartRef = doc(db, `users/${userId}/cart/data`);
    await setDoc(cartRef, { 
        items: cartItems,
        updatedAt: new Date().toISOString()
    });
}

// Load Cart
export async function loadCart(userId) {
    if (!userId) return [];
    const cartRef = doc(db, `users/${userId}/cart/data`);
    const cartDoc = await getDoc(cartRef);
    return cartDoc.exists() ? cartDoc.data().items : [];
}

// Add to Cart
export async function addToCart(userId, product) {
    if (!userId) return;
    
    try {
        const cartItems = await loadCart(userId);
        const existingItemIndex = cartItems.findIndex(item => 
            item.title === product.title && item.price === product.price
        );
        
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({
                ...product,
                quantity: 1
            });
        }
        
        await saveCart(userId, cartItems);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return cartItems;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

// Save Order
export async function saveOrder(userId, orderData) {
    if (!userId) throw new Error('User ID is required');
    
    try {
        // Create a reference to the orders collection
        const ordersCollectionRef = collection(db, 'users', userId, 'orders');
        
        // Create a new document with auto-generated ID
        const newOrderRef = doc(ordersCollectionRef);
        
        const orderToSave = {
            ...orderData,
            userId,
            orderId: newOrderRef.id, // Use Firestore's auto-generated ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('Saving order:', {
            userId,
            path: newOrderRef.path,
            data: orderToSave
        });
        
        // Save the document
        await setDoc(newOrderRef, orderToSave);
        
        return newOrderRef.id;
    } catch (error) {
        console.error('Error saving order:', error);
        throw error;
    }
}

// Add a function to test if orders are working
export async function testOrderSave(userId) {
    try {
        const testOrder = {
            items: [{
                name: "Test Product",
                price: "₹999",
                quantity: 1
            }],
            total: "₹999",
            status: "pending"
        };
        
        const orderId = await saveOrder(userId, testOrder);
        console.log('Test order saved successfully with ID:', orderId);
        return orderId;
    } catch (error) {
        console.error('Test order failed:', error);
        throw error;
    }
}

// Save Wishlist
export async function saveWishlist(userId, wishlistItems) {
    if (!userId) return;
    const wishlistRef = doc(db, `users/${userId}/wishlist/data`);
    await setDoc(wishlistRef, {
        items: wishlistItems,
        updatedAt: new Date().toISOString()
    });
}

// Save Address
export async function saveAddress(userId, addressData) {
    const addressRef = doc(db, `users/${userId}/address`);
    await setDoc(addressRef, addressData);
}

// Load Wishlist
export async function loadWishlist(userId) {
    if (!userId) return [];
    try {
        const wishlistRef = doc(db, `users/${userId}/wishlist/data`);
        const wishlistDoc = await getDoc(wishlistRef);
        return wishlistDoc.exists() ? wishlistDoc.data().items : [];
    } catch (error) {
        console.error('Error loading wishlist:', error);
        return [];
    }
}

export async function loadOrders(userId) {
    if (!userId) return [];
    
    try {
        const ordersRef = collection(db, 'users', userId, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        
        return ordersSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
}

export async function saveReview(orderId, reviewData) {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) throw new Error('User not authenticated');

    try {
        const orderRef = doc(db, `users/${userEmail}/orders/${orderId}`);
        
        // Update the order with review data
        await updateDoc(orderRef, {
            reviewed: true,
            rating: reviewData.rating,
            review: reviewData.review,
            reviewDate: reviewData.reviewDate,
            reviewedBy: userEmail
        });

        // Reload the updated order data
        const updatedOrder = await getDoc(orderRef);
        return updatedOrder.data();
    } catch (error) {
        console.error('Error saving review:', error);
        throw error;
    }
}

export async function getAllProductReviews(productId) {
    try {
        // Get product reviews from products collection
        const productReviewsRef = collection(db, `products/${productId}/reviews`);
        const reviewsSnapshot = await getDocs(productReviewsRef);
        
        const reviews = [];
        reviewsSnapshot.forEach(doc => {
            const reviewData = doc.data();
            reviews.push({
                id: doc.id,
                ...reviewData,
                date: reviewData.reviewDate,
                verified: true
            });
        });

        // Sort reviews by date
        return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

// Function to save a product review
export async function saveProductReview(productId, reviewData) {
    if (!productId || !reviewData.userId) {
        throw new Error('Missing required data for review');
    }

    try {
        // Save to products collection
        const reviewsRef = doc(db, `products/${productId}/reviews/${reviewData.userId}`);
        await setDoc(reviewsRef, {
            ...reviewData,
            createdAt: new Date().toISOString()
        });

        // Save to user's reviews collection
        const userReviewRef = doc(db, `users/${reviewData.userId}/reviews/${productId}`);
        await setDoc(userReviewRef, {
            ...reviewData,
            createdAt: new Date().toISOString()
        });

        // Also save to order review
        const orderRef = doc(db, `users/${reviewData.userId}/orders/${reviewData.orderId}`);
        await updateDoc(orderRef, {
            reviewed: true,
            rating: reviewData.rating,
            review: reviewData.review,
            reviewDate: new Date().toISOString(),
            reviewedBy: reviewData.userId
        });

        // Update product's average rating
        const productRef = doc(db, `products/${productId}`);
        const productDoc = await getDoc(productRef);
        
        if (productDoc.exists()) {
            const product = productDoc.data();
            const totalRatings = (product.totalRatings || 0) + 1;
            const totalStars = (product.totalStars || 0) + reviewData.rating;
            const averageRating = totalStars / totalRatings;

            await updateDoc(productRef, {
                totalRatings,
                totalStars,
                averageRating,
                lastReviewDate: new Date().toISOString()
            });
        }

        return true;
    } catch (error) {
        console.error('Error saving review:', error);
        throw new Error('Failed to save review: ' + error.message);
    }
}

// Function to fetch product reviews
export async function getProductReviews(productId) {
    if (!productId) {
        console.error('No product ID provided');
        return [];
    }

    try {
        console.log('Fetching reviews for product:', productId);
        const allReviews = [];

        // Get all users' orders with reviews for this product
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);

        for (const userDoc of usersSnap.docs) {
            const userId = userDoc.id;
            const ordersRef = collection(db, `users/${userId}/orders`);
            const ordersSnap = await getDocs(ordersRef);

            ordersSnap.docs.forEach(orderDoc => {
                const orderData = orderDoc.data();
                // Check if this order has a review and contains our product
                if (orderData.reviewed && 
                    orderData.items?.some(item => item.id === productId)) {
                    allReviews.push({
                        id: orderDoc.id,
                        userId: userId,
                        userName: orderData.reviewedBy || userId,
                        rating: orderData.rating,
                        review: orderData.review, // This is the review text
                        createdAt: orderData.reviewDate,
                        verified: true
                    });
                    console.log('Found review:', orderData.review); // Debug log
                }
            });
        }

        console.log('All reviews found:', allReviews); // Debug log
        return allReviews;

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

// Add this new function to fetch reviews from orders
export async function getAllOrderReviews(productId) {
    try {
        // Get all users' orders that contain this product and have reviews
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        const allReviews = [];
        
        // For each user
        for (const userDoc of usersSnapshot.docs) {
            const ordersRef = collection(db, `users/${userDoc.id}/orders`);
            const ordersSnapshot = await getDocs(ordersRef);
            
            // For each order
            ordersSnapshot.docs.forEach(orderDoc => {
                const orderData = orderDoc.data();
                // Check if order contains the product and has a review
                if (orderData.reviewed && 
                    orderData.items?.some(item => item.id === productId)) {
                    allReviews.push({
                        ...orderData,
                        userName: orderData.userName || 'Anonymous',
                        orderId: orderDoc.id,
                        userId: userDoc.id,
                        verified: true
                    });
                }
            });
        }

        return allReviews;
    } catch (error) {
        console.error('Error fetching order reviews:', error);
        return [];
    }
}