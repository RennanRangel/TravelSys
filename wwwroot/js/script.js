// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Get the tab type
        const tabType = button.dataset.tab;

        // Toggle forms
        const flightsForm = document.getElementById('flights-form');
        const staysForm = document.getElementById('stays-form');

        if (tabType === 'flights') {
            flightsForm.style.display = 'flex';
            staysForm.style.display = 'none';
        } else {
            flightsForm.style.display = 'none';
            staysForm.style.display = 'flex';
        }
    });
});

// Smooth Scrolling for Links - COMENTADO PORQUE ESTAVA BLOQUEANDO NAVEGAÇÃO
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         const target = document.querySelector(this.getAttribute('href'));
//         if (target) {
//             target.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start'
//             });
//         }
//     });
// });

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;

        if (email) {
            // Show success message
            alert(`Thank you for subscribing with ${email}!`);
            emailInput.value = '';
        }
    });
}

// Search Form Handling
const searchForm = document.querySelector('.search-form');

if (searchForm) {
    const showFlightsBtn = searchForm.querySelector('.btn-primary');

    showFlightsBtn?.addEventListener('click', (e) => {
        e.preventDefault();

        // Get form values
        const fromTo = document.getElementById('from')?.value;
        const trip = document.getElementById('trip')?.value;
        const depart = document.getElementById('depart')?.value;
        const passengers = document.getElementById('passengers')?.value;

        // Validate
        if (!fromTo || !depart || !passengers) {
            alert('Please fill in all required fields');
            return;
        }

        // In a real application, this would navigate to search results
        console.log('Search parameters:', {
            fromTo,
            trip,
            depart,
            passengers
        });

        alert('Search functionality would be implemented here!');
    });
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe destination cards and review cards
document.querySelectorAll('.destination-card, .review-card, .feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Feature Cards Click Handlers
document.querySelectorAll('.feature-card').forEach(card => {
    const button = card.querySelector('.btn-secondary');

    button?.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardType = card.classList.contains('flights-card') ? 'flights' : 'hotels';
        console.log(`Navigating to ${cardType} page`);

        if (cardType === 'flights') {
            window.location.href = 'flights-listing.html';
        } else {
            window.location.href = 'hotel-listing.html';
        }
    });
});

// Destination Card Click Handlers
document.querySelectorAll('.destination-card').forEach(card => {
    card.addEventListener('click', () => {
        const destination = card.querySelector('h3')?.textContent;
        console.log(`Clicked on destination: ${destination}`);
        alert(`Exploring ${destination}...`);
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
