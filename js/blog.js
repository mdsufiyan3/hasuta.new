document.addEventListener('DOMContentLoaded', function() {
    // Initialize category tabs functionality
    const categoryTabs = document.querySelectorAll('.category-tab');
    const blogCards = document.querySelectorAll('.blog-card');
    let currentPage = 1;
    const cardsPerPage = 6;

    // Category filtering
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            const category = this.dataset.category;
            filterPosts(category);
        });
    });

    function filterPosts(category) {
        blogCards.forEach(card => {
            const cardCategory = card.querySelector('.card-category').textContent.toLowerCase();
            if (category === 'all' || cardCategory === category.toLowerCase()) {
                card.style.display = 'block';
                // Add fade-in animation
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });
        currentPage = 1;
        updateLoadMoreButton();
    }

    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }

    function loadMorePosts() {
        const visibleCards = Array.from(blogCards).filter(card => 
            card.style.display !== 'none'
        );

        const startIndex = currentPage * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        
        visibleCards.slice(startIndex, endIndex).forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Trigger reflow
                card.offsetHeight;
                
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        currentPage++;
        updateLoadMoreButton();
    }

    function updateLoadMoreButton() {
        const visibleCards = Array.from(blogCards).filter(card => 
            card.style.display !== 'none'
        );
        
        const totalPages = Math.ceil(visibleCards.length / cardsPerPage);
        
        if (currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            // Simple email validation
            if (validateEmail(email)) {
                // Simulate API call
                submitNewsletter(email);
            } else {
                showMessage('Please enter a valid email address', 'error');
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    async function submitNewsletter(email) {
        const button = document.querySelector('.newsletter-form button');
        const originalText = button.textContent;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showMessage('Thank you for subscribing!', 'success');
            document.querySelector('.newsletter-form').reset();
        } catch (error) {
            showMessage('An error occurred. Please try again.', 'error');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    function showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;

        document.body.appendChild(messageDiv);

        // Add show class after a small delay to trigger animation
        setTimeout(() => messageDiv.classList.add('show'), 10);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe blog cards for animation
    blogCards.forEach(card => {
        observer.observe(card);
    });

    // Add dynamic background parallax effect
    const blogHero = document.querySelector('.blog-hero');
    if (blogHero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            blogHero.style.backgroundPosition = `center ${rate}px`;
        });
    }

    // Initialize review images
    const reviewImages = document.querySelectorAll('.review-image');
    reviewImages.forEach(image => {
        image.addEventListener('click', function() {
            this.classList.toggle('expanded');
            document.body.style.overflow = this.classList.contains('expanded') ? 'hidden' : '';
        });
    });

    // Close expanded image when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.closest('.review-image.expanded')) {
            const expandedImage = document.querySelector('.review-image.expanded');
            if (expandedImage) {
                expandedImage.classList.remove('expanded');
                document.body.style.overflow = '';
            }
        }
    });

    // Close expanded image with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const expandedImage = document.querySelector('.review-image.expanded');
            if (expandedImage) {
                expandedImage.classList.remove('expanded');
                document.body.style.overflow = '';
            }
        }
    });

    // Initialize on page load
    updateLoadMoreButton();
});

// Size Guide Interactions
document.addEventListener('DOMContentLoaded', function() {
    const measurementPoints = document.querySelectorAll('.measurement-points .point');
    
    measurementPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            const measurementType = this.getAttribute('data-label').toLowerCase();
            const relatedCells = document.querySelectorAll(`td:nth-child(${getColumnIndex(measurementType)})`);
            relatedCells.forEach(cell => cell.style.backgroundColor = 'rgba(107, 127, 215, 0.2)');
        });

        point.addEventListener('mouseleave', function() {
            const measurementType = this.getAttribute('data-label').toLowerCase();
            const relatedCells = document.querySelectorAll(`td:nth-child(${getColumnIndex(measurementType)})`);
            relatedCells.forEach(cell => cell.style.backgroundColor = '');
        });
    });

    function getColumnIndex(measurementType) {
        const headers = {
            'chest': 2,
            'waist': 3,
            'hips': 4,
            'length': 5
        };
        return headers[measurementType] || 1;
    }
});
