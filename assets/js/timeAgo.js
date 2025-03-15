function zeitVergangenheit(dateString) {
    if (!dateString) return "Datum nicht verfügbar";

    const jetzt = new Date();
    const datum = new Date(dateString.replace(" ", "T")); // Convert to ISO format for consistency

    if (isNaN(datum.getTime())) return "Ungültiges Datum";

    const sekunden = Math.floor((jetzt - datum) / 1000);

    if (sekunden < 0) return "In der Zukunft"; // Handle future dates

    let intervall = Math.floor(sekunden / 31536000); // Years
    if (intervall > 1) return `Vor ${intervall} Jahren`;
    if (intervall === 1) return `Vor 1 Jahr`;

    intervall = Math.floor(sekunden / 2592000); // Months
    if (intervall > 1) return `Vor ${intervall} Monaten`;
    if (intervall === 1) return `Vor 1 Monat`;

    intervall = Math.floor(sekunden / 86400); // Days
    if (intervall > 1) return `Vor ${intervall} Tagen`;
    if (intervall === 1) return `Vor 1 Tag`;

    intervall = Math.floor(sekunden / 3600); // Hours
    if (intervall > 1) return `Vor ${intervall} Stunden`;
    if (intervall === 1) return `Vor 1 Stunde`;

    intervall = Math.floor(sekunden / 60); // Minutes
    if (intervall > 1) return `Vor ${intervall} Minuten`;
    if (intervall === 1) return `Vor 1 Minute`;

    return `Vor ${Math.floor(sekunden)} Sekunden`;
}

// Update timeago elements dynamically
function updateTimeAgo() {
    document.querySelectorAll('time.timeago').forEach(function(element) {
        const dateString = element.getAttribute('datetime');
        if (dateString) {
            element.textContent = zeitVergangenheit(dateString);
        }
    });
}

// Initialize on load and set interval to update every minute
document.addEventListener('DOMContentLoaded', function() {
    updateTimeAgo(); // Initial update
    setInterval(updateTimeAgo, 60000); // Update every minute
});