document.addEventListener('DOMContentLoaded', function () {
    // Download Button
    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            alert('Downloading boarding pass...');
            // In a real app, this would trigger a PDF download
        });
    }

    // Share Button
    const shareBtn = document.querySelector('.btn-icon');
    if (shareBtn) {
        shareBtn.addEventListener('click', function () {
            if (navigator.share) {
                navigator.share({
                    title: 'Flight Ticket - Golobe',
                    text: 'Check out my flight to Istanbul!',
                    url: window.location.href
                }).then(() => {
                    console.log('Thanks for sharing!');
                }).catch(console.error);
            } else {
                alert('Share URL copied to clipboard!');
                navigator.clipboard.writeText(window.location.href);
            }
        });
    }
});
