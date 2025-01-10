// Variables globales
let sections = [];
let globalTotalCost = 0;

// Datos del producto en el Paso 1
let productInfo = {
    name: '',
    category: '',
    imageUrl: ''
};

// Mostrar la imagen y el nombre del producto en el Paso 1
document.getElementById('showImageButton').addEventListener('click', function() {
    const file = document.getElementById('productoImagen').files[0];
    const productName = document.getElementById('productoName').value;
    const productCategory = document.getElementById('productoCategoria').value;
    
    if (productName && productCategory && file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('productNameDisplay').textContent = productName;
            document.getElementById('productoCategoriaDisplay').textContent = productCategory;
            document.getElementById('previewContainer').style.display = 'block';
            
            productInfo = { name: productName, category: productCategory, imageUrl: e.target.result };
        };
        reader.readAsDataURL(file);
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Añadir una sección en el Paso 2
document.getElementById("addSectionBtn").addEventListener("click", addSection);

function addSection() {
    const sectionIndex = sections.length;
    const section = { name: '', products: [], totalCost: 0, imageUrl: '' };
    sections.push(section);

    const sectionContainer = document.createElement("div");
    sectionContainer.classList.add("section-container", "mt-4");
    sectionContainer.innerHTML = `
        <h4>Sección de Producción ${sectionIndex + 1}</h4>
        <input type="text" class="form-control mb-3" placeholder="Nombre de la Sección" onchange="updateSectionName(${sectionIndex}, this.value)">
        
        <label for="sectionImage${sectionIndex}" class="form-label">Imagen de la Sección</label>
        <input type="file" id="sectionImage${sectionIndex}" class="form-control mb-3" accept="image/*" onchange="updateSectionImage(${sectionIndex}, this)">

        <div id="imagePreviewContainer${sectionIndex}" class="text-center mb-3" style="display: none;">
            <img id="sectionImagePreview${sectionIndex}" src="" alt="Previsualización de imagen" style="max-width: 150px;">
        </div>

        <form id="productForm${sectionIndex}" onsubmit="addProduct(event, ${sectionIndex})">
            <div class="row">
                <div class="col-md-4"><input type="text" id="productName${sectionIndex}" class="form-control" placeholder="Insumo" required></div>
                <div class="col-md-3"><input type="number" id="productPrice${sectionIndex}" class="form-control" placeholder="Costo Unitario" required></div>
                <div class="col-md-3"><input type="number" id="productQuantity${sectionIndex}" class="form-control" placeholder="Cantidad" required></div>
                <div class="col-md-2"><button type="submit" class="btn btn-primary w-100">Añadir</button></div>
            </div>
        </form>

        <table class="table mt-3"><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
        <tbody id="productTableBody${sectionIndex}"></tbody></table>
        <h5 class="text-end">Total Sección: <span class="text-danger">$<span id="sectionTotal${sectionIndex}">0.00</span></span></h5>
    `;
    document.getElementById("sectionsContainer").appendChild(sectionContainer);
}

function updateSectionName(index, name) {
    sections[index].name = name;
}

function updateSectionImage(sectionIndex, input) {
    const file = input.files[0];
    const imagePreview = document.getElementById(`sectionImagePreview${sectionIndex}`);
    const previewContainer = document.getElementById(`imagePreviewContainer${sectionIndex}`);

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            sections[sectionIndex].imageUrl = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        sections[sectionIndex].imageUrl = '';
        previewContainer.style.display = 'none';
    }
}

function addProduct(event, sectionIndex) {
    event.preventDefault();
    const name = document.getElementById(`productName${sectionIndex}`).value;
    const price = parseFloat(document.getElementById(`productPrice${sectionIndex}`).value);
    const quantity = parseInt(document.getElementById(`productQuantity${sectionIndex}`).value);
    const subtotal = price * quantity;

    sections[sectionIndex].products.push({ name, price, quantity, subtotal });
    sections[sectionIndex].totalCost += subtotal;
    globalTotalCost += subtotal;

    updateSectionTable(sectionIndex);
    updateGlobalTotal();
    document.getElementById(`productForm${sectionIndex}`).reset();
}

function updateSectionTable(sectionIndex) {
    const section = sections[sectionIndex];
    const tableBody = document.getElementById(`productTableBody${sectionIndex}`);
    tableBody.innerHTML = section.products.map(product => `
        <tr><td>${product.name}</td><td>$${product.price}</td><td>${product.quantity}</td><td>$${product.subtotal}</td></tr>
    `).join('');
    document.getElementById(`sectionTotal${sectionIndex}`).textContent = section.totalCost.toFixed(2);
}

function updateGlobalTotal() {
    document.getElementById("globalTotalCost").textContent = globalTotalCost.toFixed(2);
}

// Generar resumen en el Paso Final
function generateSummary() {
    const summaryContainer = document.getElementById("summaryContainer");
    summaryContainer.innerHTML = `
        <div>
            <h4>${productInfo.name}</h4>
            <h5>Categoría: ${productInfo.category}</h5>
            ${productInfo.imageUrl ? `<img src="${productInfo.imageUrl}" style="max-width: 150px;">` : ''}
        </div>
    `;
    summaryContainer.innerHTML += sections.map(section => `
        <div>
            <h4>${section.name}</h4>
            ${section.imageUrl ? `<img src="${section.imageUrl}" style="max-width: 150px;">` : ''}
            <table class="table"><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
            <tbody>${section.products.map(product => `
                <tr><td>${product.name}</td><td>$${product.price}</td><td>${product.quantity}</td><td>$${product.subtotal}</td></tr>
            `).join('')}</tbody></table>
            <h5>Total Sección: $${section.totalCost.toFixed(2)}</h5>
        </div>
    `).join('');
    summaryContainer.innerHTML += `<h4>Total Global de Producción: $${globalTotalCost.toFixed(2)}</h4>`;
}


document.getElementById('myTab').addEventListener('click', (e) => {
    if (e.target.hash === '#resumen') {
        generateSummary();
    }
});

        const employees = [];

        function addEmployee() {
            const name = document.getElementById("employeeName").value;
            const salary = parseFloat(document.getElementById("salary").value);
            const additionalCost = parseFloat(document.getElementById("additionalCost").value);
            const daysWorked = parseFloat(document.getElementById("daysWorked").value);
            const hoursPerDay = parseFloat(document.getElementById("hoursPerDay").value);
            const classification = document.getElementById("classification").value;

            const monthlyCost = salary + additionalCost;
            const totalMinutes = daysWorked * hoursPerDay * 60;
            const minuteCost = (monthlyCost / totalMinutes).toFixed(2);

            employees.push({ name, classification, salary, additionalCost, daysWorked, hoursPerDay, monthlyCost, minuteCost });

            document.getElementById("costForm").reset();
            updateTable();
        }

        function updateTable() {
            const employeeTable = document.getElementById("employeeTable");
            employeeTable.innerHTML = "";

            let totalSalary = 0;
            let totalAdditionalCost = 0;
            let totalMonthlyCost = 0;
            let totalMinuteCost = 0;

            employees.forEach((employee, index) => {
                totalSalary += employee.salary;
                totalAdditionalCost += employee.additionalCost;
                totalMonthlyCost += employee.monthlyCost;
                totalMinuteCost += parseFloat(employee.minuteCost);

                const row = `<tr>
                    <td>${employee.name}</td>
                    <td>${employee.classification}</td>
                    <td>${employee.salary.toLocaleString('es-CO')}</td>
                    <td>${employee.additionalCost.toLocaleString('es-CO')}</td>
                    <td>${employee.daysWorked}</td>
                    <td>${employee.hoursPerDay}</td>
                    <td>${employee.monthlyCost.toLocaleString('es-CO')}</td>
                    <td>${employee.minuteCost}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeEmployee(${index})">Eliminar</button></td>
                </tr>`;
                employeeTable.innerHTML += row;
            });

            document.getElementById("totalSalary").textContent = totalSalary.toLocaleString('es-CO');
            document.getElementById("totalAdditionalCost").textContent = totalAdditionalCost.toLocaleString('es-CO');
            document.getElementById("totalMonthlyCost").textContent = totalMonthlyCost.toLocaleString('es-CO');
            document.getElementById("totalMinuteCost").textContent = totalMinuteCost.toFixed(2);
        }

        function removeEmployee(index) {
            employees.splice(index, 1);
            updateTable();
        }