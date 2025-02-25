async function loadData() {
    const response = await fetch('../json/pagamento.json');
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

    const h1 = document.createElement('h1');
    h1.textContent = jsonData.body.h1;
    body.appendChild(h1);

    const paymentContainer = document.createElement('div');
    paymentContainer.className = "container my-5 d-flex justify-content-between";

    const formContainer = document.createElement('div');
    formContainer.className = "col-6";
    let formHTML = `<form id="payment-form">`;

    formHTML += '<h4 class="text-center"> <strong>Informazioni di fatturazione </strong></h4>';
    formHTML += '<div class="row">';
    
    jsonData.body.form.fields.slice(0, 6).forEach((field, index) => {
        formHTML += `
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    ${field.type === "select" ? 
                        `<select class="form-control" id="${field.id}" required>
                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>` :
                        `<input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`
                    }
                </div>
            </div>
        `;
    });
    formHTML += '</div>';  

    formHTML += '<BR> <hr> <BR>';

    formHTML += '<h4 class="text-center"> <strong>Informazioni di Pagamento </strong></h4>';
    formHTML += '<div class="row">';
    
    jsonData.body.form.fields.slice(6).forEach((field, index) => {
        formHTML += `
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    ${field.type === "select" ? 
                        `<select class="form-control" id="${field.id}" required>
                            ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>` :
                        `<input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`
                    }
                </div>
            </div>
        `;
    });
    formHTML += '</div>';  
    
    formHTML += `<button type="submit" class="btn btn-primary" id="pay-button">Paga</button></form>`;
    formContainer.innerHTML = formHTML;
    
    

    const summaryContainer = document.createElement('div');
    summaryContainer.className = "col-4 bg-light p-4 border rounded";
    const products = JSON.parse(localStorage.getItem('cart')) || [];
    let orderSummaryHTML = `
        <h4 class="text-center">Riepilogo ordine</h4>
        <br>
        <ul id="order-summary">
    `;

    let total = 0;

    if (products.length > 0) {
        products.forEach(product => {
            const quantity = product.quantity > 0 ? product.quantity : 1;
            const price = product.price && !isNaN(product.price) ? product.price : 0;
            orderSummaryHTML += `
                <li><strong>${product.name}</strong> - ${quantity} x €${price.toFixed(2)}</li>
            `;
            total += quantity * price;
        });
    } else {
        orderSummaryHTML += ` <li><em>Carrello vuoto</em></li>`;
    }
    orderSummaryHTML += `</ul><hr>`;

    orderSummaryHTML += `
        <h5 class="text-center"><strong>Totale: €<span id="total-price">${total.toFixed(2)}</span></strong></h5>
        <br> <br>
        <h5 class="text-center">Codice sconto</h5>
        <div class="mb-2 d-flex align-items-center">
            
            <input type="text" id="discount-code" class="form-control me-2" placeholder="Inserisci codice" style="width: 70%;">
            <button class="btn btn-success" id="apply-discount">Applica</button>
        </div>
        <p id="discount-message" class="text-danger mt-2 text-center"></p>
    `;
    summaryContainer.innerHTML = orderSummaryHTML;

    paymentContainer.appendChild(formContainer);
    paymentContainer.appendChild(summaryContainer);
    body.appendChild(paymentContainer);

    const footer = document.createElement('footer');
    footer.className = jsonData.body.footer.class;
    footer.innerHTML = `<p>${jsonData.body.footer.p}</p>`;
    body.appendChild(footer);

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

    document.getElementById('apply-discount').addEventListener('click', () => {
        const discountInput = document.getElementById('discount-code').value;
        const discountMessage = document.getElementById('discount-message');
        if (discountInput === 'BECKS') {
            const discountedTotal = total * 0.9;
            document.getElementById('total-price').textContent = discountedTotal.toFixed(2);
            discountMessage.textContent = "Codice sconto applicato!";
            discountMessage.classList.remove('text-danger');
            discountMessage.classList.add('text-success');
        } else {
            discountMessage.textContent = "Codice sconto non valido.";
            discountMessage.classList.remove('text-success');
            discountMessage.classList.add('text-danger');
        }
    });


    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', (e) => {
        e.preventDefault(); 

        localStorage.removeItem('cart');

        window.location.href = 'carrello.html'; 
    });
}

window.addEventListener('load', loadData);
