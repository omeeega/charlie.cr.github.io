document.addEventListener("DOMContentLoaded", function () {
    console.log("Le site est chargé !");
    
    // Formulaire de contact
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Merci énormément ! Bonne continuation");
        form.reset();
    });

    
    // Carrousel automatique
    const carousel = new bootstrap.Carousel(document.querySelector("#carouselExample"), {
        interval: 3000,
        ride: "carousel"
    });
});



let anims = [...document.querySelectorAll("[anim]")];
console.log(anims);
let click = (el, cb) => el.addEventListener("click", cb);
let toggle = (el) => el.classList.toggle("toggled");
let clickTog = (el) => click(el, () => toggle(el));
anims.map(clickTog);



  window.addEventListener('scroll', function() {
    let images = document.querySelectorAll('.zoom-effect');

    images.forEach(img => {
        let rect = img.getBoundingClientRect();
        let windowHeight = window.innerHeight;

        if (rect.top > 75 && rect.top < windowHeight / 3) {
            img.classList.add('zoom');
        } else {
            img.classList.remove('zoom');
        }
    });
});










let panier = []; 
let total = 0;   

function ajouterAuPanier(nomPizza, prix) {
    panier.push({ nom: nomPizza, prix: prix });
    
    total += prix;
    document.getElementById('total-price').innerText = total.toFixed(2);

    afficherPanier();
}

function afficherPanier() {
    const panierItems = document.getElementById('panier-items');
    panierItems.innerHTML = ''; 

    panier.forEach((item, index) => {
  
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `${item.nom} - ${item.prix}€`;

        const retirerBtn = document.createElement('button');
        retirerBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-3');
        retirerBtn.innerText = 'Retirer';
        retirerBtn.onclick = () => retirerDuPanier(index, item.prix);

        li.appendChild(retirerBtn);

        panierItems.appendChild(li);
    });

    document.getElementById('panier-count').innerText = panier.length;
}

function retirerDuPanier(index, prix) {

    panier.splice(index, 1);

    total -= prix;
    document.getElementById('total-price').innerText = total.toFixed(2);

    afficherPanier();
}
let total2 = 0;
function validerCommande() {
    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    alert(`Votre commande a été validée pour un total de ${total.toFixed(2)}€`);
    panier = [];
    total2 = total;
    total = 0;
    document.getElementById('total-price').innerText = total.toFixed(2);
    afficherPanier();
}




function payer(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire automatique

    var response = grecaptcha.getResponse();

    if (response.length === 0) {
        alert("Veuillez cocher le reCAPTCHA avant de payer.");
        return false;
    }

    // Si le reCAPTCHA est validé, on peut soumettre le paiement
    alert("Paiement validé avec succès !");
    document.getElementById("paiement-form").submit();
}