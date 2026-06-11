//js/certificate-controller.js
// Certificate Controller - Manages certificate data and modals
const certsData = [
    {
        img: 'assets/img/cert1.jpg',
        title: 'Certificate Title One',
        issuer: 'Issuer / Organization Name',
        date: 'Month Year',
        desc: 'Brief description of what this certificate covers, the skills it validates, and any notable details.'
    },
    {
        img: 'assets/img/cert2.jpg',
        title: 'Certificate Title Two',
        issuer: 'Issuer / Organization Name',
        date: 'Month Year',
        desc: 'Brief description of what this certificate covers.'
    },
    {
        img: 'assets/img/cert3.jpg',
        title: 'Certificate Title Three',
        issuer: 'Issuer / Organization Name',
        date: 'Month Year',
        desc: 'Brief description of what this certificate covers.'
    },
    {
        img: 'assets/img/cert4.jpg',
        title: 'Certificate Title Four',
        issuer: 'Issuer / Organization Name',
        date: 'Month Year',
        desc: 'Brief description of what this certificate covers.'
    },
];

window.certificateController = {
    openCertModal: function(index) {
        const c = certsData[index];
        if (!c) return;
        const imgEl = document.getElementById('cert-modal-img');
        const titleEl = document.getElementById('cert-modal-title');
        const issuerEl = document.getElementById('cert-modal-issuer');
        const dateEl = document.getElementById('cert-modal-date');
        const descEl = document.getElementById('cert-modal-desc');
        
        if (imgEl) imgEl.src = c.img;
        if (imgEl) imgEl.alt = c.title;
        if (titleEl) titleEl.textContent = c.title;
        if (issuerEl) issuerEl.textContent = c.issuer;
        if (dateEl) dateEl.textContent = c.date;
        if (descEl) descEl.textContent = c.desc;
        
        window.modalController.openModal('modal-cert-detail');
    }
};