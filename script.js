const menu = document.querySelector('#menu');
const cartBtn = document.querySelector('#cart-btn');
const cartModal = document.querySelector('#cart-modal');
const cartItemsContainer = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const checkoutBtn = document.querySelector('#checkout-btn');
const closeModalBtn = document.querySelector('#close-modal-btn');
const cartCounter = document.querySelector('#cart-count');
const addressInput = document.querySelector('#address');
const addressObsInput = document.querySelector('#address-obs');
const addressWarn = document.querySelector('#address-warn');

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'flex';
});

// Fechar o modal quando clicar fora dele
cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
});

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
});

// função para adicionar ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCartModal();
}

// Atualiza Carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between border-b border-gray-500 border-solid">
            <div>
               <p class="font-medium">${item.name}</p>
               <p>Qtd: ${item.quantity}</p>
               <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

               <button class="remove-from-cart-btn" data-name="${item.name}">
                   Remover
               </button> 
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // Atualiza contador de itens no carrinho
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCounter.textContent = totalItems;
}

// função para remover item do carrinho
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden");
    }

})

addressObsInput.addEventListener("input", (event) => {
    let inputObsValue = event.target.value;

    return inputObsValue;
})

checkoutBtn.addEventListener("click", () => {
    let inputObs = addressObsInput.value;
    const isOpen = checkRestauranteOpen();

    if (!isOpen) {
        alert("BRUTOS BURGUER ESTA FECHADO NO MOMENTO!");
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === '') {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            ` ${item.name}, Quantidade: (${item.quantity}), Preço: R$${item.price}. | `
        )
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "34998897373"

    window.open(`https://wa.me/${phone}?text=Boa noite Brutos bruguer🍔, meu pedido é: ${message}, Observação: ${inputObs}, Endereço: ${addressInput.value}`, "_blank");

    cart.length = 0;
});

function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    // Calcula o horário atual em minutos desde a meia-noite
    const minutosDesdeMeiaNoite = hora * 60 + minutos;
    // Define os limites de tempo em minutos desde a meia-noite
    const aberturaEmMinutos = 18 * 60 + 30; // 18:30
    const fechamentoEmMinutos = 23 * 60 + 45; // 23:45
    // Verifica se o horário atual está dentro do intervalo de funcionamento
    return minutosDesdeMeiaNoite >= aberturaEmMinutos && minutosDesdeMeiaNoite <= fechamentoEmMinutos;
}

const spanItem = document.querySelector("#date-span");
const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
