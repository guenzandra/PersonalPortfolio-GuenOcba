// Modal Controller - Handles all modal operations
window.modalController = {
    openModal: function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeModal: function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    },
    
    closeModalOutside: function(e, id) {
        if (e.target.id === id) {
            this.closeModal(id);
        }
    }
};

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.show').forEach(m => {
            m.classList.remove('show');
            document.body.style.overflow = '';
        });
    }
});