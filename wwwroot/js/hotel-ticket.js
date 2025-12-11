// Download button functionality
const downloadBtn = document.querySelector('.btn-download');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        alert('Downloading ticket...');
        // In a real app, this would trigger a PDF download
    });
}

// Share button functionality
const shareBtn = document.querySelector('.btn-icon');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Hotel Booking - CVK Park Bosphorus Hotel',
                text: 'Check out my hotel booking!',
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Share URL copied to clipboard!');
        }
    });
}
