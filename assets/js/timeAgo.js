function zeitVergangenheit(dateString) {
    const jetzt = new Date();
    const datum = new Date(dateString);

    const jetztUTC = Date.UTC(jetzt.getUTCFullYear(), jetzt.getUTCMonth(), jetzt.getUTCDate(),
                            jetzt.getUTCHours(), jetzt.getUTCMinutes(), jetzt.getUTCSeconds());
    const datumUTC = Date.UTC(datum.getUTCFullYear(), datum.getUTCMonth(), datum.getUTCDate(),
                             datum.getUTCHours(), datum.getUTCMinutes(), datum.getUTCSeconds());

    const sekunden = Math.floor((jetztUTC - datumUTC) / 1000);
    let intervall = Math.floor(sekunden / 31536000);

    if (intervall > 1) return `${intervall} Jahre her`;
    if (intervall === 1) return `Vor 1 Jahr`;

    intervall = Math.floor(sekunden / 2592000);
    if (intervall > 1) return `${intervall} Monate her`;
    if (intervall === 1) return `Vor 1 Monat`;

    intervall = Math.floor(sekunden / 86400);
    if (intervall > 1) return `${intervall} Tage her`;
    if (intervall === 1) return `Vor 1 Tag`;

    intervall = Math.floor(sekunden / 3600);
    if (intervall > 1) return `${intervall} Stunden her`;
    if (intervall === 1) return `Vor 1 Stunde`;

    intervall = Math.floor(sekunden / 60);
    if (intervall > 1) return `${intervall} Minuten her`;
    if (intervall === 1) return `Vor 1 Minute`;

    return `${Math.floor(sekunden)} Sekunden her`;
}

document.addEventListener('DOMContentLoaded', function() {
    const lastUpdatedElements = document.querySelectorAll('[data-last-modified]');
    lastUpdatedElements.forEach(function(element) {
        const lastModifiedDate = element.getAttribute('data-last-modified');
        if (lastModifiedDate) {
            const lastModifiedDateUTC = new Date(lastModifiedDate).toISOString();
            element.textContent = zeitVergangenheit(lastModifiedDateUTC);
        }
    });
});