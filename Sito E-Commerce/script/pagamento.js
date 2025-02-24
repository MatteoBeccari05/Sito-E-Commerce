async function loadData() {
    const response = await fetch('../json/pagamento.json');
    const jsonData = await response.json();

    // Imposta il titolo della pagina
    document.title = jsonData.title;

    // Aggiungi il contenuto head
    const head = document.querySelector('head');

    // Meta tags
    jsonData.head.meta.forEach(metaTag => {
        const metaElement = document.createElement('meta');
        for (const key in metaTag) {
            metaElement.setAttribute(key, metaTag[key]);
        }
        head.appendChild(metaElement);
    });

    // Link CSS
    jsonData.head.links.forEach(link => {
        const linkElement = document.createElement('link');
        for (const key in link) {
            linkElement.setAttribute(key, link[key]);
        }
        head.appendChild(linkElement);
    });

    // Aggiungi il contenuto del body
    const body = document.querySelector('body');

    // Aggiungi la navbar
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

    // Aggiungi il titolo principale
    const h1 = document.createElement('h1');
    h1.textContent = jsonData.body.h1;
    body.appendChild(h1);

    // Crea la struttura a due colonne
    const paymentContainer = document.createElement('div');
    paymentContainer.className = "container my-5 d-flex justify-content-between";

    // Colonna Sinistra: Form di pagamento
    const formContainer = document.createElement('div');
    formContainer.className = "col-6";
    let formHTML = `<form id="payment-form">`;

    jsonData.body.form.fields.forEach(field => {
        if (field.type === "select") {
            formHTML += `
                <div class="mb-3">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    <select class="form-control" id="${field.id}" required>
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                </div>
            `;
        } else {
            formHTML += `
                <div class="mb-3">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    <input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
                </div>
            `;
        }
    });

    formHTML += ` 
        <button type="submit" class="btn btn-primary" id="pay-button">Paga</button>
    </form>`;
    formContainer.innerHTML = formHTML;

    // Colonna Destra: Riepilogo ordine
    const summaryContainer = document.createElement('div');
    summaryContainer.className = "col-4 bg-light p-4 border rounded";

    // Recupera i prodotti dal localStorage
    const products = JSON.parse(localStorage.getItem('cart')) || [];
    let orderSummaryHTML = `
        <h4 class="text-center">Riepilogo ordine</h4>
        <br>
        <ul id="order-summary">
    `;

    let total = 0;

    if (products.length > 0) {
        // Crea una lista di prodotti
        products.forEach(product => {
            const quantity = product.quantity > 0 ? product.quantity : 1;
            const price = product.price && !isNaN(product.price) ? product.price : 0;

            orderSummaryHTML += `
                <li><strong>${product.name}</strong> - ${quantity} x €${price.toFixed(2)}</li>
            `;
            total += quantity * price;
        });

        orderSummaryHTML += `
            </ul>
            <hr>
            <h5 class="text-center"><strong>Totale: €${total.toFixed(2)} </strong></h5>
        `;
    } else {
        orderSummaryHTML += ` <li><em>Carrello vuoto</em></li></ul> `;
    }

    summaryContainer.innerHTML = orderSummaryHTML;

    paymentContainer.appendChild(formContainer);
    paymentContainer.appendChild(summaryContainer);
    body.appendChild(paymentContainer);

    // Aggiungi il footer
    const footer = document.createElement('footer');
    footer.className = jsonData.body.footer.class;
    footer.innerHTML = `<p>${jsonData.body.footer.p}</p>`;
    body.appendChild(footer);

    // Aggiungi i file script
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

    // Aggiungi l'event listener al pulsante "Paga"
    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenire il comportamento di invio del form

        // Rimuovi tutti gli elementi dal localStorage
        localStorage.removeItem('cart');

        // Redirigi alla pagina del carrello
        window.location.href = 'carrello.html'; // Modifica con l'URL effettivo della tua pagina carrello
    });
}

window.addEventListener('load', loadData);
