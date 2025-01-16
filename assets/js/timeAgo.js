function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);

    const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                             date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    const seconds = Math.floor((nowUTC - dateUTC) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return `1 year ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return `1 month ago`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return `1 day ago`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return `1 hour ago`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return `1 minute ago`;

    return `${Math.floor(seconds)} seconds ago`;
}

document.addEventListener('DOMContentLoaded', function() {
    const lastUpdatedElements = document.querySelectorAll('[data-last-modified]');
    lastUpdatedElements.forEach(function(element) {
        const lastModifiedDate = element.getAttribute('data-last-modified');
        if (lastModifiedDate) {
            const lastModifiedDateUTC = new Date(lastModifiedDate).toISOString();
            element.textContent = timeAgo(lastModifiedDateUTC);
        }
    });
});