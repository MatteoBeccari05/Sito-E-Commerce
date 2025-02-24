async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Ottieni l'ID del prodotto dalla URL

    // Carica il file JSON con i dati dei prodotti
    const response = await fetch('../json/prodotti.json');
    const products = await response.json();

    // Trova il prodotto corrispondente all'ID
    const product = products.find(p => p.id == productId);

    if (product) {
        // Aggiungi i dettagli del prodotto alla pagina
        const productDetailsHTML = `
        <div class="row">
            <div class="col-md-6">
                <img id="product-image" src="${product.images[product.colors[0].toLowerCase()]}" alt="${product.name}" class="img-fluid rounded product-image">
            </div>
            <div class="col-md-6">
                <h2 class="product-title">${product.name}</h2>
                <p><strong>Processore:</strong> ${product.processor}</p>
                <p><strong>Display:</strong> ${product.display}</p>
                <p class="product-description"><strong>Descrizione:</strong> ${product.description}</p>
                
                <div class="form-group">
                    <label for="color-select">Scegli il colore:</label>
                    <select id="color-select" class="form-select color-select">
                        ${product.colors.map(color => `<option value="${color.toLowerCase()}">${color}</option>`).join('')}
                    </select>
                </div>

                <br>
                <div class="form-group">
                    <label for="storage-select">Scegli la capacità:</label>
                    <select id="storage-select" class="form-select storage-select">
                        ${product.storageOptions.map(storage => `<option value="${storage}">${storage}</option>`).join('')}
                    </select>
                </div>
    
                <div class="product-price-container">
                    <p class="product-price" id="product-price">€${product.price}</p>
                </div>
    
                <button class="btn btn-success mt-4" id="add-to-cart-btn">Aggiungi al carrello</button>
            </div>
        </div>
    `;
    
    document.getElementById('product-details').innerHTML = productDetailsHTML;

        // Aggiungere l'evento per cambiare l'immagine
        const colorSelect = document.getElementById('color-select');
        colorSelect.addEventListener('change', (event) => {
            const selectedColor = event.target.value.toLowerCase(); // Ottieni il colore selezionato
            const selectedImage = product.images[selectedColor];
            if (selectedImage) {
                document.getElementById('product-image').src = selectedImage;
            }
        });

        // Aggiungere l'evento per cambiare la memoria e il prezzo
        const storageSelect = document.getElementById('storage-select');
        storageSelect.addEventListener('change', (event) => {
            const selectedStorage = event.target.value;
            let updatedPrice = product.price;
            if (selectedStorage === "256GB") {
                updatedPrice = product.price + 100;
            } else if (selectedStorage === "512GB") {
                updatedPrice = product.price + 200;
            } else if (selectedStorage === "GPS + Cellular") {
                updatedPrice = product.price + 150;
            } else if (selectedStorage === "1TB") {
                updatedPrice = product.price + 300;
            } else if (selectedStorage === "2TB") {
                updatedPrice = product.price + 450;
            }
            document.getElementById('product-price').textContent = `€${updatedPrice}`;
        });

        // Aggiungi l'evento per il tasto "Aggiungi al carrello"
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            const selectedColor = colorSelect.value.toLowerCase();
            const selectedStorage = storageSelect.value;
            let updatedPrice = product.price;
            
            if (selectedStorage === "256GB") {
                updatedPrice = product.price + 100;
            } else if (selectedStorage === "512GB") {
                updatedPrice = product.price + 200;
            } else if (selectedStorage === "GPS + Cellular") {
                updatedPrice = product.price + 150;
            } else if (selectedStorage === "1TB") {
                updatedPrice = product.price + 300;
            } else if (selectedStorage === "2TB") {
                updatedPrice = product.price + 450;
            }

            // Oggetto prodotto da aggiungere al carrello
            const cartItem = {
                id: product.id,
                name: product.name,
                image: product.images[selectedColor],
                price: updatedPrice,
                storage: selectedStorage,
                color: selectedColor,
                description: product.description
            };

            // Ottieni il carrello dal localStorage (se esiste), altrimenti creane uno nuovo
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Aggiungi il prodotto al carrello
            cart.push(cartItem);

            // Salva il carrello nel localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            alert('Prodotto aggiunto al carrello!');
        });

    } else {
        document.getElementById('product-details').innerHTML = "<p>Prodotto non trovato.</p>";
    }
}

// Carica i dettagli del prodotto quando la pagina viene caricata
window.addEventListener('load', loadProductDetails);
