function zeitVergangenheit(dateString) {
    if (!dateString) return "Datum nicht verfügbar"; 

    const jetzt = new Date();
    const datum = new Date(dateString);

    if (isNaN(datum.getTime())) return "Ungültiges Datum";

    const sekunden = Math.floor((jetzt - datum) / 1000);
    let intervall = Math.floor(sekunden / 31536000);

    if (intervall > 1) return `Vor ${intervall} Jahren`;
    if (intervall === 1) return `Vor 1 Jahr`;

    intervall = Math.floor(sekunden / 2592000);
    if (intervall > 1) return `Vor ${intervall} Monaten`;
    if (intervall === 1) return `Vor 1 Monat`;

    intervall = Math.floor(sekunden / 86400);
    if (intervall > 1) return `Vor ${intervall} Tagen`;
    if (intervall === 1) return `Vor 1 Tag`;

    intervall = Math.floor(sekunden / 3600);
    if (intervall > 1) return `Vor ${intervall} Stunden`;
    if (intervall === 1) return `Vor 1 Stunde`;

    intervall = Math.floor(sekunden / 60);
    if (intervall > 1) return `Vor ${intervall} Minuten`;
    if (intervall === 1) return `Vor 1 Minute`;

    return `Vor ${Math.floor(sekunden)} Sekunden`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-last-modified]').forEach(function(element) {
        const lastModifiedDate = element.getAttribute('data-last-modified');
        if (lastModifiedDate) {
            element.textContent = zeitVergangenheit(lastModifiedDate);
        }
    });
});