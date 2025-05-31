const { jsPDF } = window.jspdf;

const productos = {
  1: { nombre: "Martillo", descripcion: "Martillo resistente de acero", precio: 20 },
  2: { nombre: "Destornillador", descripcion: "Punta estrella", precio: 15 },
  3: { nombre: "Clavos", descripcion: "Paquete de 100 clavos galvanizados", precio: 5 }
};

let carrito = [];

function actualizarCarrito() {
  const lista = document.getElementById("carrito");
  const totalElem = document.getElementById("total");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach(id => {
    const p = productos[id];
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - S/ ${p.precio}`;
    lista.appendChild(li);
    total += p.precio;
  });
  totalElem.textContent = total;
}

window.agregarProducto = function(id) {
  carrito.push(id);
  actualizarCarrito();
};

window.eliminarProducto = function(id) {
  const index = carrito.lastIndexOf(id);
  if (index !== -1) {
    carrito.splice(index, 1);
    actualizarCarrito();
  }
};

document.getElementById("formulario-reclamo").addEventListener("submit", function(e) {
  e.preventDefault();

  if(carrito.length === 0) {
    alert("Debes agregar al menos un producto al carrito para generar el reporte.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  const doc = new jsPDF();

  // Dibujar borde decorativo
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 277);

  // Logo (puedes reemplazar la URL por la de tu logo local o base64)
  
  doc.setFontSize(20);
  doc.text(" Clava Bien", 15, 25);

  doc.setFontSize(14);
  doc.text("Reporte de Venta", 105, 40, null, null, "center");

  doc.setFontSize(12);
  doc.text(`Nombre: ${nombre}`, 15, 55);
  doc.text(`Correo: ${email}`, 15, 65);

  doc.text("Mensaje:", 15, 80);
  doc.setFontSize(11);
  const splitMsg = doc.splitTextToSize(mensaje, 180);
  doc.text(splitMsg, 15, 90);

  // Productos
  doc.setFontSize(12);
  doc.text("Productos seleccionados:", 15, 120);

  let y = 130;
  let total = 0;
  carrito.forEach((id, i) => {
    const p = productos[id];
    const linea = `${i+1}. ${p.nombre} - S/ ${p.precio}`;
    doc.text(linea, 20, y);
    y += 10;
    total += p.precio;
  });

  doc.text(`Total a pagar: S/ ${total}`, 15, y + 10);

  // Descripción final
  doc.setFontSize(10);
  doc.text(
    "Gracias por confiar en Ferretería Clava Bien. " +
    "Nos comprometemos a atender con amabilidad y estamos asu dispocion y a su reclamo a la brevedad.",
    15, 280, { maxWidth: 180 }
  );

  doc.save("reclamo-ferreteria.pdf");

  // Opcional: Resetear form y carrito
  this.reset();
  carrito = [];
  actualizarCarrito();
});
