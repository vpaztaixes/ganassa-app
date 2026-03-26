// TODO: Implement
// Services page: Gallery hover effect
document.querySelectorAll('.gallery-item-modern').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    item.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});