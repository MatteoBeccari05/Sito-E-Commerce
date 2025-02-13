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
            <!-- Colonna per l'immagine del prodotto -->
            <div class="col-md-6">
                <img id="product-image" src="${product.images[product.colors[0].toLowerCase()]}" alt="${product.name}" class="img-fluid rounded product-image">
            </div>
            <!-- Colonna per le specifiche e descrizioni -->
            <div class="col-md-6">
                <h2 class="product-title">${product.name}</h2>
                <p><strong>Processore:</strong> ${product.processor}</p>
                <p><strong>Display:</strong> ${product.display}</p>
                <p class="product-description"><strong>Descrizione:</strong> ${product.description}</p>
                
                <!-- Selezione del colore -->
                <div class="form-group">
                    <label for="color-select">Scegli il colore:</label>
                    <select id="color-select" class="form-select color-select">
                        ${product.colors.map(color => `<option value="${color.toLowerCase()}">${color}</option>`).join('')}
                    </select>
                </div>

                <br>
                <!-- Selezione della memoria -->
                <div class="form-group">
                    <label for="storage-select">Scegli la capacità:</label>
                    <select id="storage-select" class="form-select storage-select">
                        ${product.storageOptions.map(storage => `<option value="${storage}">${storage}</option>`).join('')}
                    </select>
                </div>
    
                <!-- Prezzo in grande e verde -->
                <div class="product-price-container">
                    <p class="product-price" id="product-price">€${product.price}</p>
                </div>
    
                <!-- Aggiungi al carrello -->
                <button class="btn btn-success mt-4" id="add-to-cart-btn">Aggiungi al carrello</button>
            </div>
        </div>
    `;
    
    document.getElementById('product-details').innerHTML = productDetailsHTML;

        // Aggiungere l'evento per cambiare l'immagine
        const colorSelect = document.getElementById('color-select');
        colorSelect.addEventListener('change', (event) => {
            const selectedColor = event.target.value.toLowerCase(); // Ottieni il colore selezionato

            // Trova l'immagine corrispondente al colore selezionato
            const selectedImage = product.images[selectedColor];

            // Se l'immagine corrispondente è trovata, aggiorna l'elemento immagine
            if (selectedImage) {
                document.getElementById('product-image').src = selectedImage;
            }
        });

        // Aggiungere l'evento per cambiare la memoria e il prezzo
        const storageSelect = document.getElementById('storage-select');
        storageSelect.addEventListener('change', (event) => {
            const selectedStorage = event.target.value; // Ottieni la memoria selezionata

            let updatedPrice = product.price; // Prezzo base

            // Modifica il prezzo in base alla memoria selezionata
            if (selectedStorage === "256GB") {
                updatedPrice = product.price + 100; // Aumenta di 100 euro per 256GB
            } else if (selectedStorage === "512GB") {
                updatedPrice = product.price + 200; // Aumenta di 200 euro per 512GB
            } else if (selectedStorage === "GPS + Cellular") {
                updatedPrice = product.price + 150;   //per gli apple watch
            }else if (selectedStorage === "1TB") {
                updatedPrice = product.price + 300;   
            }else if (selectedStorage === "2TB") {
                updatedPrice = product.price + 450;   
            }
            

            

            // Aggiorna il prezzo sulla pagina
            document.getElementById('product-price').textContent = `€${updatedPrice}`;
        });

    } else {
        document.getElementById('product-details').innerHTML = "<p>Prodotto non trovato.</p>";
    }
}

// Carica i dettagli del prodotto quando la pagina viene caricata
window.addEventListener('load', loadProductDetails);
