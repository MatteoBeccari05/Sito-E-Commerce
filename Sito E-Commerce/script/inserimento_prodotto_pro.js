async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productIds = urlParams.get('id'); // Ottieni gli ID dei prodotti dalla URL
    if (productIds) {
        const idsArray = productIds.split(','); // Crea un array di ID separati da virgola

        // Carica il file JSON con i dati dei prodotti
        const response = await fetch('../json/prodotti.json');
        const products = await response.json();

        let productDetailsHTML = idsArray.map(id => {
            // Trova il prodotto corrispondente all'ID
            const product = products.find(p => p.id == id);

            if (product) 
            {
                return `
                    <div class="row product" id="product-${product.id}" style="margin-bottom: 30px;"> <!-- Aggiungi margine tra i prodotti -->
                        <div class="col-md-6">
                            <img id="product-image-${product.id}" src="${product.images[product.colors[0].toLowerCase()]}" alt="${product.name}" class="img-fluid rounded product-image">
                        </div>
                        <div class="col-md-6">
                            <h2 class="product-title">${product.name}</h2>
                            <p><strong>Processore:</strong> ${product.processor}</p>
                            <p><strong>Display:</strong> ${product.display}</p>
                            <p class="product-description"><strong>Descrizione:</strong> ${product.description}</p>
                            
                            <div class="form-group">
                                <label for="color-select-${product.id}">Scegli il colore:</label>
                                <select id="color-select-${product.id}" class="form-select color-select">
                                    ${product.colors.map(color => `<option value="${color.toLowerCase()}">${color}</option>`).join('')}
                                </select>
                            </div>

                            <br>
                            <div class="form-group">
                                <label for="storage-select-${product.id}">Scegli la capacità:</label>
                                <select id="storage-select-${product.id}" class="form-select storage-select">
                                    ${product.storageOptions.map(storage => `<option value="${storage}">${storage}</option>`).join('')}
                                </select>
                            </div>

                            <div class="product-price-container">
                                <p class="product-price" id="product-price-${product.id}">€${product.price}</p>
                            </div>
                        </div>
                    </div>
                    <hr style="border-top: 1px solid #ccc; margin: 20px 0;"> <!-- Linea di separazione tra i prodotti -->
                `;
            } else {
                return `<p>Prodotto con ID ${id} non trovato.</p>`;
            }
        }).join('');

        productDetailsHTML += `
            <div class="row">
                <div class="col-md-12">
                    <button class="add-to-cart-btn" id="add-all-to-cart-btn">Aggiungi al carrello</button>
                </div>
            </div>
        `;
        
        document.getElementById('product-details').innerHTML = productDetailsHTML;

        // Aggiungi gli eventi per ogni prodotto
        idsArray.forEach(id => {
            const product = products.find(p => p.id == id);
            if (product) {
                // Cambia l'immagine del prodotto in base al colore selezionato
                const colorSelect = document.getElementById(`color-select-${product.id}`);
                colorSelect.addEventListener('change', (event) => {
                    const selectedColor = event.target.value.toLowerCase();
                    const selectedImage = product.images[selectedColor];
                    if (selectedImage) {
                        document.getElementById(`product-image-${product.id}`).src = selectedImage;
                    }
                });

                // Cambia memoria e prezzo
                const storageSelect = document.getElementById(`storage-select-${product.id}`);
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
                    document.getElementById(`product-price-${product.id}`).textContent = `€${updatedPrice}`;
                });
            }
        });

        // Aggiungi l'evento per il tasto "Aggiungi tutti al carrello"
        const addAllToCartBtn = document.getElementById('add-all-to-cart-btn');
        addAllToCartBtn.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            idsArray.forEach(id => {
                const product = products.find(p => p.id == id);
                if (product) {
                    const colorSelect = document.getElementById(`color-select-${product.id}`);
                    const storageSelect = document.getElementById(`storage-select-${product.id}`);

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

                    // Controlla se il prodotto con lo stesso id, colore e capacità è già nel carrello
                    const existingProductIndex = cart.findIndex(item => 
                        item.id === product.id &&
                        item.color === selectedColor &&
                        item.storage === selectedStorage
                    );

                    if (existingProductIndex !== -1) {
                        // Se il prodotto esiste, aggiorna la quantità
                        cart[existingProductIndex].quantity += 1;
                    } else {
                        // Se il prodotto non esiste, aggiungilo con quantità 1
                        const cartItem = {
                            id: product.id,
                            name: product.name,
                            image: product.images[selectedColor],
                            price: updatedPrice,
                            storage: selectedStorage,
                            color: selectedColor,
                            description: product.description,
                            quantity: 1 // Inizializza la quantità a 1
                        };
                        cart.push(cartItem);
                    }
                }
            });

            // Salva tutti i prodotti nel carrello
            localStorage.setItem('cart', JSON.stringify(cart));

            alert('Tutti i prodotti sono stati aggiunti al carrello!');
        });

    } else {
        document.getElementById('product-details').innerHTML = "<p>Nessun prodotto selezionato.</p>";
    }
}

// Carica i dettagli dei prodotti quando la pagina viene caricata
window.addEventListener('load', loadProductDetails);
