import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Function to navigate to the dashboard
function goToDashboard() {
    window.location.href = 'dashboard.html'; // Redirect to the dashboard page
}

// Event listener for the home icon
document.querySelector('.nav-icon').addEventListener('click', goToDashboard);

// When saving an order, make sure to include the order date
