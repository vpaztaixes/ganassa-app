// Contact page: Form submission to backend API
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all required fields dynamically
        const requiredInputs = contactForm.querySelectorAll('[required]');
        for (const input of requiredInputs) {
            if (!input.value.trim()) {
                alert('Please fill in all required fields.');
                input.focus();
                return;
            }
        }

        // Basic email validation — find the email field by type
        const emailInput = contactForm.querySelector('input[type="email"]');
        if (emailInput) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                alert('Please enter a valid email address.');
                emailInput.focus();
                return;
            }
        }

        // Collect all form field values into a flat object
        const formData = new FormData(contactForm);
        const body = {};
        for (const [key, value] of formData.entries()) {
            body[key] = typeof value === 'string' ? value.trim() : value;
        }

        // Normalize common field names regardless of whether static or dynamic form is used
        // Dynamic fields use name="firstName" etc. directly, so FormData already captures them correctly.
        // The mailing checkbox value comes as 'on' when checked — convert to boolean
        if ('mailingListOptIn' in body) {
            body.mailingListOptIn = true;
        } else {
            body.mailingListOptIn = false;
        }

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) { submitBtn.textContent = 'SENDING...'; submitBtn.disabled = true; }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.success) {
                alert(data.message);
                contactForm.reset();
                // Hide mailing extra fields after reset
                const mailingExtraFields = document.getElementById('mailingExtraFields');
                if (mailingExtraFields) mailingExtraFields.classList.remove('active');
            } else {
                alert(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            alert('Network error. Please try again.');
        } finally {
            if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
        }
    });

    // Mailing list checkbox toggle
    const mailingCheckbox = document.getElementById('mailingListOptIn');
    const mailingExtraFields = document.getElementById('mailingExtraFields');
    if (mailingCheckbox && mailingExtraFields) {
        mailingCheckbox.addEventListener('change', function() {
            mailingExtraFields.classList.toggle('active', this.checked);
        });
    }

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon i');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherIcon = otherItem.querySelector('.faq-icon i');
                        if (otherIcon) { otherIcon.classList.remove('fa-minus'); otherIcon.classList.add('fa-plus'); }
                    }
                });
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    if (icon) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
                } else {
                    if (icon) { icon.classList.remove('fa-minus'); icon.classList.add('fa-plus'); }
                }
            });
        }
    });
});
