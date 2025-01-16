// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active state to navigation links
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Simulate loading real data (you can replace this with actual API calls)
function updateStats() {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
        const currentValue = parseInt(number.textContent.replace(/[^0-9]/g, ''));
        const randomChange = Math.floor(Math.random() * 10) - 5; // Random number between -5 and 5
        if (number.textContent.includes('$')) {
            number.textContent = `$${currentValue + randomChange}`;
        } else {
            number.textContent = currentValue + randomChange;
        }
    });
}

// Update stats every 5 seconds
setInterval(updateStats, 5000);
