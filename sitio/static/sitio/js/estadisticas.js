document.addEventListener('DOMContentLoaded', function () {
    var form1 = document.getElementById('formVariables');
    var form2 = document.getElementById('formNombres');
    var table = document.getElementById('myTable');
    var numVariables;

    form1.addEventListener('submit', function (event) {
        event.preventDefault();
        numVariables = parseInt(document.getElementById('var').value);

        if (numVariables <= 0 || numVariables > 10) {
            alert('Por favor, ingrese un número válido de variables (1-10).');
            return;
        }

        crearFormularioNombres(numVariables);
    });

    form2.addEventListener('submit', function (event) {
        event.preventDefault();
        var maxObservaciones = parseInt(document.getElementById('observaciones').value);
        crearTablaConNombres(numVariables, maxObservaciones);
    });

    function crearFormularioNombres(numVariables) {
        form2.innerHTML = '';

        for (var i = 1; i <= numVariables; i++) {
            var divWrapper = document.createElement('div');
            divWrapper.className = 'col-md-6 mt-2';

            var label = document.createElement('label');
            label.textContent = 'Nombre de la variable ' + i;
            label.for = 'vari' + i;

            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.name = 'vari' + i;
            input.id = 'vari' + i;
            input.placeholder = 'Nombre de la variable ' + i;
            input.required = true;

            divWrapper.appendChild(label);
            divWrapper.appendChild(input);
            form2.appendChild(divWrapper);
        }

        var divObservaciones = document.createElement('div');
        divObservaciones.className = 'col-md-6 mt-2';

        var labelObservaciones = document.createElement('label');
        labelObservaciones.className = "icon-list";
        labelObservaciones.textContent = ' Número de observaciones (Filas)';
        labelObservaciones.for = 'observaciones';

        var inputObservaciones = document.createElement('input');
        inputObservaciones.type = 'number';
        inputObservaciones.className = 'form-control';
        inputObservaciones.name = 'observaciones';
        inputObservaciones.id = 'observaciones';
        inputObservaciones.placeholder = 'Número de observaciones (max: 500)';
        inputObservaciones.required = true;

        divObservaciones.appendChild(labelObservaciones);
        divObservaciones.appendChild(inputObservaciones);
        form2.appendChild(divObservaciones);

        var button = document.createElement('button');
        button.type = 'submit';
        button.className = 'btn btn-success mt-3';
        button.textContent = 'Crear Tabla';
        form2.appendChild(button);
    }

    function crearTablaConNombres(numVariables, maxObservaciones) {
        table.innerHTML = '';

        var nombresVariables = [];
        for (var i = 1; i <= numVariables; i++) {
            var nombreVariable = document.getElementById('vari' + i).value;
            nombresVariables.push(nombreVariable);
        }

        var thead = document.createElement('thead');
        table.appendChild(thead);

        var headerRow = thead.insertRow(0);

        var counterCell = headerRow.insertCell(0);
        counterCell.textContent = 'No.';

        for (var j = 0; j < nombresVariables.length; j++) {
            var headerCell = headerRow.insertCell(j + 1);
            headerCell.textContent = nombresVariables[j];
        }

        var tbody = document.createElement('tbody');
        table.appendChild(tbody);

        for (var k = 1; k <= maxObservaciones; k++) {
            var row = tbody.insertRow(k - 1);

            var counterCell = row.insertCell(0);
            counterCell.textContent = k;

            for (var l = 0; l < numVariables; l++) {
                var cell = row.insertCell(l + 1);

                var input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control';
                input.name = 'dato_' + k + '_var' + (l + 1);
                input.placeholder = 'Dato ' + k + ' Variable ' + (l + 1);
                input.required = true;

                cell.appendChild(input);
            }
        }
    }

                 // Después de la función crearTablaConNombres
    function calcularResumen() {
        var resumenArea = document.getElementById('resumenArea');
        var tbody = table.querySelector('tbody');
        var numVariables = tbody.rows[0].cells.length - 1; 
         // Restar 1 para excluir la columna de contador

        resumenArea.innerHTML = '<h5>Resumen Estadístico</h5>';

        for (var i = 1; i <= numVariables; i++) {
            var datos = obtenerDatosDeColumna(i);

             // Calcular la media, moda, desviación estándar, etc.
            var media = calcularMedia(datos);
            var moda = calcularModa(datos);
            var desviacionEstandar = calcularDesviacionEstandar(datos);
            var numeroObservaciones = datos.length;
            var valorMinimo = Math.min(...datos);
            var valorMaximo = Math.max(...datos);


// Cambia i por el nombre de la variable (puedes obtenerlo desde el formulario)
            var nombreVariable = obtenerNombreVariable(i);                        

                  // Mostrar el resumen en el área correspondiente
            resumenArea.innerHTML += `
            <div class="tabla table-responsive mt-3">
            <table class="table table-striped table-bordered" id="myTable">
            <thead>
            <tr>
            <th> Variable </th>
            <th> Obs</th>
            <th> Media </th>
            <th> Des.Est. </th>
            <th> Valor Mínimo</th>
            <th> Valor Máximo</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>${nombreVariable}</td>
            <td>${numeroObservaciones}</td>
            <td>${media.toLocaleString()}</td>
            <td>${desviacionEstandar.toLocaleString()}</td>
            <td>${valorMinimo.toLocaleString()}</td>
            <td>${valorMaximo.toLocaleString()}</td>
            </tr>
            </tbody>
            </table>
            </div>
            `;
        }
    }

// Función para obtener el nombre de la variable desde el formulario
    function obtenerNombreVariable(indice) {
        var inputNombre = document.getElementById('vari' + indice);
        return inputNombre.value || 'Variable ' + indice;
    }


           // Función para obtener datos de una columna específica
    function obtenerDatosDeColumna(columnIndex) {
        var datos = [];
        var tbody = table.querySelector('tbody');

        for (var i = 0; i < tbody.rows.length; i++) {
            var cell = tbody.rows[i].cells[columnIndex];
            var inputValue = cell.querySelector('input').value;
            datos.push(parseFloat(inputValue));
        }

        return datos;
    }


        // Funciones auxiliares para cálculos estadísticos (puedes agregar más según sea necesario)
    function calcularMedia(datos) {
        var suma = datos.reduce((total, dato) => total + dato, 0);
        return suma / datos.length;
    }

    function calcularModa(datos) {
            // Implementar lógica para calcular la moda (puedes usar bibliotecas externas)
            // Devolver un mensaje si no hay una moda clara
        return "Moda no disponible";
    }

    function calcularDesviacionEstandar(datos) {
        var media = calcularMedia(datos);
        var sumaCuadrados = datos.reduce((total, dato) => total + Math.pow(dato - media, 2), 0);
        return Math.sqrt(sumaCuadrados / datos.length);
    }

        // Luego, dentro del evento click del botón Resumen
    document.getElementById('btnResumen').addEventListener('click', function () {
            // Obtener los datos de la tabla
        var datos = obtenerDatosDeTabla();

            // Validar datos antes de calcular el resumen
        if (!validarDatosParaResumen(datos)) {
            alert('Por favor, complete todos los datos en la tabla antes de calcular el resumen.');
            return;
        }

            // Calcular y mostrar el resumen
        calcularResumen(datos);
    });

        // Función para validar datos en la tabla antes de calcular el resumen
    function validarDatosParaResumen(datos) {
            // Implementar lógica de validación según tus requisitos
            // Por ejemplo, verificar si todos los datos son números y están presentes
        return datos.every(dato => !isNaN(dato) && dato !== '');
    }

        // Función para obtener datos de la tabla
    function obtenerDatosDeTabla() {
        var datos = [];
        var tbody = table.querySelector('tbody');

        for (var i = 0; i < tbody.rows.length; i++) {
            for (var j = 1; j < tbody.rows[i].cells.length; j++) {
                var input = tbody.rows[i].cells[j].querySelector('input');
                datos.push(parseFloat(input.value));
            }
        }

        return datos;
    }

});