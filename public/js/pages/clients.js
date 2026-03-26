// TODO: Implement
// Clients page: Testimonial carousel
// testimonialsData is injected by the EJS template as a global variable
document.addEventListener('DOMContentLoaded', () => {
    if (typeof testimonialsData === 'undefined' || !testimonialsData.length) return;

    let currentTestimonial = 0;

    function updateTestimonial(index) {
        const t = testimonialsData[index];
        document.getElementById('testimonialQuote').textContent = t.quote;
        document.getElementById('authorName').textContent = t.author_name;
        document.getElementById('authorPosition').textContent = t.author_position;

        const avatarDiv = document.getElementById('authorAvatar');
        if (t.author_avatar_url) {
            avatarDiv.innerHTML = `<img src="${t.author_avatar_url}" alt="${t.author_name}">`;
        }

        const logoDiv = document.getElementById('teamLogo');
        if (t.team_logo_url) {
            logoDiv.innerHTML = `<img src="${t.team_logo_url}" alt="">`;
        }

        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    const navContainer = document.getElementById('testimonialNav');
    if (navContainer) {
        testimonialsData.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            dot.addEventListener('click', () => {
                currentTestimonial = i;
                updateTestimonial(i);
            });
            navContainer.appendChild(dot);
        });
    }

    updateTestimonial(0);

    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialsData.length;
        updateTestimonial(currentTestimonial);
    }, 8000);
});