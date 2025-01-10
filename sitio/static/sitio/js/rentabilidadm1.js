
            let assetCount = 0;

            document.getElementById('addAsset').addEventListener('click', function () {
                addAssetFields();
            });

            function addAssetFields() {
                assetCount++;
                const assetsContainer = document.getElementById('assetsContainer');
                const correlationsContainer = document.getElementById('correlationsContainer');

            // Crear campos para el nuevo activo
                const assetHTML = `
                <div class="row asset-group mb-3" data-asset-id="${assetCount}">
                <div class="col-md-4 mb-3">
                <label class="form-label">Rentabilidad Activo ${assetCount} (%)</label>
                <input type="number" class="form-control" name="assetReturn" step="0.01" placeholder="0.00" required>
                </div>
                <div class="col-md-4 mb-3">
                <label class="form-label">Riesgo Activo ${assetCount} (%)</label>
                <input type="number" class="form-control" name="assetRisk" step="0.01" placeholder="0.00" required>
                </div>
                <div class="col-md-4 mb-3">
                <label class="form-label">Peso Activo ${assetCount}</label>
                <input type="number" class="form-control" name="assetWeight" step="0.01" placeholder="0.00" required>
                </div>
                <div class="col-md-12">
                <button type="button" class="btn bg-danger w-100 remove-asset">Eliminar Activo</button>
                </div>
                </div><hr>`;

                assetsContainer.insertAdjacentHTML('beforeend', assetHTML);

            // Crear campos de correlaciones para el nuevo activo respecto a los anteriores
                if (assetCount > 1) {
                    for (let i = 1; i < assetCount; i++) {
                        const correlationHTML = `
                        <div class="row correlation-group mb-3" data-correlation-id="${i}-${assetCount}">
                        <div class="col-md-12">
                        <label class="form-label">Correlación entre Activo ${i} y Activo ${assetCount}</label>
                        <input type="number" class="form-control" name="correlation" step="0.01" placeholder="0.00" min="-1" max="1" required>
                        </div>
                        </div>`;
                        correlationsContainer.insertAdjacentHTML('beforeend', correlationHTML);
                    }
                }

            // Añadir funcionalidad al botón de eliminar
                document.querySelectorAll('.remove-asset').forEach(button => {
                    button.addEventListener('click', function () {
                        const assetGroup = this.closest('.asset-group');
                        const assetId = assetGroup.getAttribute('data-asset-id');

                    // Eliminar el activo
                        assetGroup.remove();
                        assetCount--;

                    // Eliminar correlaciones asociadas
                        document.querySelectorAll(`[data-correlation-id*="-${assetId}"], [data-correlation-id^="${assetId}-"]`).forEach(el => el.remove());
                    });
                });
            }

            document.getElementById('portfolioForm').addEventListener('submit', function (e) {
                e.preventDefault();

            // Capturar los valores de todos los activos
                const returns = Array.from(document.querySelectorAll('input[name="assetReturn"]')).map(input => parseFloat(input.value) / 100);
                const risks = Array.from(document.querySelectorAll('input[name="assetRisk"]')).map(input => parseFloat(input.value) / 100);
                const weights = Array.from(document.querySelectorAll('input[name="assetWeight"]')).map(input => parseFloat(input.value));

            // Capturar todas las correlaciones
                const correlations = Array.from(document.querySelectorAll('input[name="correlation"]')).map(input => parseFloat(input.value));

            // Validaciones de pesos
                const totalWeight = weights.reduce((acc, val) => acc + val, 0);
                if (totalWeight !== 1) {
                    alert("La suma de los pesos debe ser igual a 1.");
                    return;
                }

            // Cálculo de la rentabilidad esperada y el riesgo de la cartera
                let expectedReturn = 0;
                let portfolioRisk = 0;

            // Calcular la rentabilidad esperada
                for (let i = 0; i < returns.length; i++) {
                    expectedReturn += weights[i] * returns[i];
                }

            // Calcular el riesgo de la cartera
                let correlationIndex = 0;
                for (let i = 0; i < risks.length; i++) {
                    for (let j = 0; j < risks.length; j++) {
                        if (i === j) {
                        // Riesgo individual
                            portfolioRisk += Math.pow(weights[i] * risks[i], 2);
                        } else if (i < j) {
                        // Riesgo conjunto (correlaciones)
                            portfolioRisk += 2 * weights[i] * weights[j] * risks[i] * risks[j] * correlations[correlationIndex];
                            correlationIndex++;
                        }
                    }
                }

                portfolioRisk = Math.sqrt(portfolioRisk);

            // Actualizar los resultados en la página
                document.getElementById('expectedReturn').textContent = (expectedReturn * 100).toFixed(2) + '%';
                document.getElementById('portfolioRisk').textContent = (portfolioRisk * 100).toFixed(2) + '%';

            // Actualizar la explicación en palabras
                const explanationText = document.getElementById('explanationText');
                if (expectedReturn >= 0 && portfolioRisk >= 0) {
                    explanationText.textContent = `Con una rentabilidad esperada del ${(expectedReturn * 100).toFixed(2)}% y un riesgo de ${(portfolioRisk * 100).toFixed(2)}%, esta cartera tiene una proyección positiva. Esto significa que, en promedio, puedes esperar un rendimiento del ${(expectedReturn * 100).toFixed(2)}% sobre tu inversión. Sin embargo, este rendimiento viene con un riesgo asociado de ${(portfolioRisk * 100).toFixed(2)}%, lo que indica la variabilidad de los retornos que podrías experimentar.`;
                } else {
                    explanationText.textContent = "Hubo un error en los cálculos o los datos ingresados. Por favor, verifica los valores ingresados.";
                }

            // Graficar el riesgo y rentabilidad
                const ctx = document.getElementById('portfolioChart').getContext('2d');
            if (window.chart) window.chart.destroy(); // Destruir gráfico previo si existe

            window.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Rentabilidad Esperada', 'Riesgo'],
                    datasets: [{
                        label: 'Resultados',
                        data: [(expectedReturn * 100).toFixed(2), (portfolioRisk * 100).toFixed(2)],
                        backgroundColor: ['#007bff', '#dc3545'],
                        borderColor: ['#007bff', '#dc3545'],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
