// Password toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Here you would typically handle the form submission
            console.log('Search form submitted');
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing!');
            this.reset();
        });
    }

    // Location markers animation
    const markers = document.querySelectorAll('.location-marker');
    markers.forEach((marker, index) => {
        setTimeout(() => {
            marker.style.opacity = '0';
            marker.style.transform = 'scale(0)';
            setTimeout(() => {
                marker.style.transition = 'all 0.3s ease';
                marker.style.opacity = '1';
                marker.style.transform = 'scale(1)';
            }, 100);
        }, index * 200);
    });
});
