async function loadData() {
    const response = await fetch('../json/carrello.json');
    const jsonData = await response.json();

    document.title = jsonData.title;

    const head = document.querySelector('head');

    jsonData.head.meta.forEach(metaTag => {
        const metaElement = document.createElement('meta');
        for (const key in metaTag) {
            metaElement.setAttribute(key, metaTag[key]);
        }
        head.appendChild(metaElement);
    });

    jsonData.head.links.forEach(link => {
        const linkElement = document.createElement('link');
        for (const key in link) {
            linkElement.setAttribute(key, link[key]);
        }
        head.appendChild(linkElement);
    });

    const body = document.querySelector('body');
    const nav = document.createElement('nav');
    nav.className = jsonData.body.nav.class;

    const container = document.createElement('div');
    container.className = "container-fluid";
    container.innerHTML = ` 
        <a class="navbar-brand" href="${jsonData.body.nav.container.logo.href}">
            <img src="${jsonData.body.nav.container.logo.img.src}" alt="${jsonData.body.nav.container.logo.img.alt}" style="${jsonData.body.nav.container.logo.img.style}">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
                ${jsonData.body.nav.container.collapse.ul.items.map(item => `
                    <li class="nav-item">
                        <a class="${item.class}" href="${item.href}" ${item['aria-current'] ? 'aria-current="page"' : ''}>${item.text}</a>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    nav.appendChild(container);
    body.appendChild(nav);

    const footer = document.createElement('footer');
    footer.className = jsonData.body.footer.class;
    footer.innerHTML = `<p>${jsonData.body.footer.p}</p>`;
    body.appendChild(footer);

    // Carica i prodotti nel carrello
    displayCart();

    jsonData.scripts.forEach(script => {
        const scriptElement = document.createElement('script');
        scriptElement.src = script.src;
        if (script.integrity) {
            scriptElement.integrity = script.integrity;
        }
        if (script.crossorigin) {
            scriptElement.crossorigin = script.crossorigin;
        }
        document.body.appendChild(scriptElement);
    });
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';  // Pulisce il contenuto precedente

    if (cart.length === 0) {
        // Mostra il messaggio se il carrello è vuoto
        cartContainer.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
                <div class="alert alert-info text-center w-75">
                    <h4>Nessun prodotto nel carrello.</h4>
                    <p>Al momento il tuo carrello è vuoto. Aggiungi dei prodotti per continuare.</p>
                </div>
            </div>
        `;
        return;
    }

    let cartHTML = '<h2 class="mb-4">Prodotti nel carrello:</h2>';
    let total = 0;
    cart.forEach(item => {
        cartHTML += `
        <div class="card mb-4 p-3">
            <div class="row g-3 align-items-center">
                <div class="col-md-3">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded-3">
                </div>
                <div class="col-md-9">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h4>${item.name}</h4>
                            <p><strong>Colore:</strong> ${item.color}</p>
                            <p><strong>Capacità:</strong> ${item.storage}</p>
                            <p><strong>Prezzo:</strong> €${item.price}</p>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                <span class="mx-2">${item.quantity || 1}</span>
                                <button class="btn btn-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})" ${item.quantity >= 5 ? 'disabled' : ''}>+</button>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Rimuovi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        total += item.price * (item.quantity || 1); // Moltiplica per la quantità
    });

    // Aggiungi il saldo totale e il pulsante acquisto
    cartHTML += `
    <div class="card p-3 mt-4 text-center">
        <h3>Totale: <strong>€${total.toFixed(2)}</strong></h3>
        <button class="btn btn-success mt-3" onclick="purchase()">Vai al Pagamento</button>
    </div>
    `;

    cartContainer.innerHTML += cartHTML;
}

function updateQuantity(productId, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.map(item => {
        if (item.id === productId) {
            item.quantity = parseInt(quantity); // Aggiorna la quantità
        }
        return item;
    });

    // Aggiorna il carrello nel localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Ricarica i dettagli del carrello
    displayCart();
}

function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.id !== productId);

    // Aggiorna il carrello nel localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Ricarica i dettagli del carrello
    displayCart();
}

function purchase() {
    // Passa alla pagina di pagamento
    window.location.href = "pagamento.html";
}


window.addEventListener('load', loadData);
