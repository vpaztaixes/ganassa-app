// TODO: Implement
// Tokyo Summit page: Registration form submission to backend API
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('summitRegistrationForm');
    if (!registrationForm) return;

    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const company = document.getElementById('company').value.trim();
        const position = document.getElementById('position').value.trim();
        const country = document.getElementById('country').value;
        const ticketType = document.getElementById('ticketType').value;
        const specialRequirements = document.getElementById('specialRequirements').value.trim();

        if (!firstName || !lastName || !email || !company || !position || !country || !ticketType) {
            alert('Please fill in all required fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const submitBtn = registrationForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;

        try {
            const res = await fetch('/api/summit-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName, lastName, email, phone, company,
                    position, country, ticketType, specialRequirements
                })
            });

            const data = await res.json();

            if (data.success) {
                alert(data.message);
                registrationForm.reset();
            } else {
                alert(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            alert('Network error. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});