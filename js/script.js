let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosGlobales = [];

const contadorCarrito = document.getElementById('cart-counter');
const precioTotal = document.getElementById('precio-total');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const modalCarrito = document.getElementById('modal-carrito');

document.addEventListener('DOMContentLoaded', () => {
    actualizarDOMCarrito();

    const contenedorProductos = document.getElementById('productos-container');
    if (contenedorProductos) {
        obtenerProductos();
    }

    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', validarFormulario);
    }

    // MENU HAMBURGUESA
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            const icono = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icono.classList.remove('fa-bars');
                icono.classList.add('fa-xmark');
            } else {
                icono.classList.remove('fa-xmark');
                icono.classList.add('fa-bars');
            }
        });

        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const icono = menuToggle.querySelector('i');
                icono.classList.remove('fa-xmark');
                icono.classList.add('fa-bars');
            });
        });
    }
});

    // API (Solo en tienda.html) 
async function obtenerProductos() {
    const contenedorProductos = document.getElementById('productos-container');
    try {
        // 1. Llamado a la API para obtener los productos
        const response = await fetch('https://fakestoreapi.com/products');
        let data = await response.json();
        
        // 2. Mezcla de los productos para que no siempre sean los mismos
        data = data.sort(() => Math.random() - 0.5);

        // 3. Solo los primeros 10 productos
        data = data.slice(0, 10);
        
        productosGlobales = data.map((producto) => {
            return {
                id: producto.id,
                titulo: producto.title,
                precio: Math.round(producto.price * 1000), 
                imagen: producto.image
            }
        });

        renderizarProductos(productosGlobales, contenedorProductos);
    } catch (error) {
        contenedorProductos.innerHTML = `<p style="color:white; text-align:center;">Error al cargar los productos.</p>`;
    }
}

function renderizarProductos(productos, contenedor) {
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'card-game';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';

        const precioFormateado = producto.precio.toLocaleString("es-AR");

        card.innerHTML = `
            <div style="background: white; padding: 20px; border-bottom: 2px solid #1e293b;">
                <img src="${producto.imagen}" alt="${producto.titulo}" style="height: 250px; object-fit: contain; width: 100%;">
            </div>
            
            <div style="display: flex; flex-direction: column; flex-grow: 1; padding: 15px;">
                <h3 style="padding-bottom: 10px; font-size: 1.1rem; text-align: center;">${producto.titulo}</h3>
                
                <div style="margin-top: auto;">
                    <p style="text-align: center; color: #2196f3; font-weight: bold; font-size: 1.3rem; margin-bottom: 15px;">$ ${precioFormateado}</p>
                    <button class="btn-primary" onclick="agregarAlCarrito(${producto.id})" style="width: 100%; border:none; cursor:pointer;">Añadir al Carrito</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// CARRITO
function agregarAlCarrito(id) {
    const productoSeleccionado = productosGlobales.find(prod => prod.id === id);
    const existe = carrito.some(prod => prod.id === id);

    if (existe) {
        carrito = carrito.map(prod => {
            if (prod.id === id) {
                prod.cantidad++;
            }
            return prod;
        });
    } else {
        productoSeleccionado.cantidad = 1;
        carrito.push(productoSeleccionado);
    }
    actualizarDOMCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(prod => prod.id !== id);
    actualizarDOMCarrito();
}

function sumarCantidad(id) {
    carrito = carrito.map(prod => {
        if (prod.id === id) {
            prod.cantidad++;
        }
        return prod;
    });
    actualizarDOMCarrito();
}

function restarCantidad(id) {
    carrito = carrito.map(prod => {
        if (prod.id === id) {
            prod.cantidad--;
        }
        return prod;
    });
    carrito = carrito.filter(prod => prod.cantidad > 0);
    actualizarDOMCarrito();
}

function actualizarDOMCarrito() {
    contenedorCarrito.innerHTML = '';
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(producto => {
        const div = document.createElement('div');
        div.style.borderBottom = '1px solid #334155';
        div.style.padding = '15px 0';
        div.style.color = '#fff';
        
        const precioParcial = producto.precio * producto.cantidad;
        
        div.innerHTML = `
            <p><strong>${producto.titulo}</strong></p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <p style="margin: 0;">Precio: $ ${producto.precio.toLocaleString("es-AR")}</p>
                
                <div style="display:flex; gap: 10px; align-items:center;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <button onclick="restarCantidad(${producto.id})" style="background: #334155; color: white; border: none; padding: 3px 8px; border-radius: 5px; cursor: pointer; width: 28px; text-align: center;">-</button>
                        
                        <span style="display: inline-block; width: 20px; text-align: center;">${producto.cantidad}</span>
                        
                        <button onclick="sumarCantidad(${producto.id})" style="background: #334155; color: white; border: none; padding: 3px 8px; border-radius: 5px; cursor: pointer; width: 28px; text-align: center;">+</button>
                    </div>
                    
                    <span style="display: inline-block; width: 100px; text-align: right; color: #2196f3; font-weight: bold;">
                        $ ${precioParcial.toLocaleString("es-AR")}
                    </span>
                    
                    <button onclick="eliminarDelCarrito(${producto.id})" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 5px;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        contenedorCarrito.appendChild(div);

        total += precioParcial;
        cantidadTotal += producto.cantidad;
    });

    precioTotal.innerText = total.toLocaleString("es-AR");
    contadorCarrito.innerText = cantidadTotal;
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// MODAL
document.getElementById('abrir-carrito').addEventListener('click', (e) => {
    e.preventDefault();
    modalCarrito.style.opacity = '1';
    modalCarrito.style.visibility = 'visible';
});

document.getElementById('cerrar-carrito').addEventListener('click', (e) => {
    e.preventDefault();
    modalCarrito.style.opacity = '0';
    modalCarrito.style.visibility = 'hidden';
});

document.getElementById('btn-comprar').addEventListener('click', () => {
    if(carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    alert("¡Compra simulada con éxito! Gracias por tu compra Retro.");
    carrito = [];
    actualizarDOMCarrito();
    modalCarrito.style.opacity = '0';
    modalCarrito.style.visibility = 'hidden';
});

// VALIDACION DE FORMULARIO (Solo en Inicio)
function validarFormulario(e) {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
        e.preventDefault();
        alert('Por favor, completa todos los campos del formulario.');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        e.preventDefault();
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }
}