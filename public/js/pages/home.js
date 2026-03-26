// TODO: Implement
// Home page: Partners marquee
// partnersData is injected by the EJS template as a global variable
(function() {
    const track = document.getElementById('partnersTrack');
    if (!track || typeof partnersData === 'undefined' || !partnersData.length) return;

    for (let i = 0; i < 2; i++) {
        const group = document.createElement('div');
        group.className = 'partners-group';

        partnersData.forEach(partner => {
            const wrapper = document.createElement('div');
            wrapper.className = 'partner-logo-wrapper';

            const img = document.createElement('img');
            img.src = partner.logo;
            img.alt = partner.name;
            img.className = 'partner-logo';
            img.title = partner.name;

            wrapper.appendChild(img);
            group.appendChild(wrapper);
        });

        track.appendChild(group);
    }
})();