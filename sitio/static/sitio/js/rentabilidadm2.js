

        let assetCount = 0;

        function addAsset() {
            assetCount++;
            const assetTemplate = `
            <div class="asset" id="asset${assetCount}">
            <h5>Activo ${assetCount}</h5>
            <div class="row">
            <div class="mb-3 col-md-4">
            <label for="asset${assetCount}Return" class="form-label">Rentabilidad (%)</label>
            <input type="number" class="form-control" id="asset${assetCount}Return" step="0.01" placeholder="0.00" required>
            </div>
            <div class="mb-3 col-md-4">
            <label for="asset${assetCount}Risk" class="form-label">Riesgo (%)</label>
            <input type="number" class="form-control" id="asset${assetCount}Risk" step="0.01" placeholder="0.00" required>
            </div>
            <div class="mb-3 col-md-4">
            <label for="weight${assetCount}" class="form-label">Peso</label>
            <input type="number" class="form-control" id="weight${assetCount}" step="0.01" placeholder="0.00" required>
            </div>
            <div class="mb-3 col-md-4">
            <label for="sustainability${assetCount}" class="form-label">Puntaje de Sostenibilidad (S)</label>
            <input type="number" class="form-control" id="sustainability${assetCount}" step="0.01" placeholder="0.00" required>
            </div>
            <div class="mb-3 col-md-4">
            <label for="transparency${assetCount}" class="form-label">Puntaje de Transparencia (T)</label>
            <input type="number" class="form-control" id="transparency${assetCount}" step="0.01" placeholder="1.00" min="0" max="1" required>
            </div><hr>
            </div>
            </div>`;
            document.getElementById('assetsContainer').insertAdjacentHTML('beforeend', assetTemplate);
        }

        function removeAsset() {
            if (assetCount > 0) {
                document.getElementById(`asset${assetCount}`).remove();
                assetCount--;
            }
        }

        document.getElementById('portfolioForm').addEventListener('submit', function (e) {
            e.preventDefault();

            // Parámetros globales
            const lambda = parseFloat(document.getElementById('lambda').value);
            const gamma = parseFloat(document.getElementById('gamma').value);

            // Variables de acumulación
            let expectedReturn = 0;
            let adjustedRisk = 0;
            let totalWeight = 0;

            // Arrays para acumulación de datos
            const returns = [];
            const risks = [];
            const weights = [];
            const sustainabilities = [];
            const transparencies = [];

            // Recopilar los datos de cada activo
            for (let i = 1; i <= assetCount; i++) {
                const assetReturn = parseFloat(document.getElementById(`asset${i}Return`).value) / 100;
                const assetRisk = parseFloat(document.getElementById(`asset${i}Risk`).value) / 100;
                const weight = parseFloat(document.getElementById(`weight${i}`).value);
                const sustainability = parseFloat(document.getElementById(`sustainability${i}`).value);
                const transparency = parseFloat(document.getElementById(`transparency${i}`).value);

                // Sumar ponderaciones para verificar que sumen 1
                totalWeight += weight;

                // Acumulación de rentabilidad esperada ajustada por sostenibilidad
                expectedReturn += weight * assetReturn + lambda * weight * sustainability;

                // Acumulación de riesgos y transparencias
                returns.push(assetReturn);
                risks.push(assetRisk);
                weights.push(weight);
                sustainabilities.push(sustainability);
                transparencies.push(transparency);
            }

            // Verificar que los pesos sumen 1
            if (Math.abs(totalWeight - 1) > 0.01) {
                alert("La suma de los pesos debe ser igual a 1.");
                return;
            }

            // Cálculo del riesgo ajustado por transparencia
            for (let i = 0; i < assetCount; i++) {
                for (let j = 0; j < assetCount; j++) {
                    // Simulación de la covarianza como producto de los riesgos individuales (esto es solo para simplificar)
                    const covariance = risks[i] * risks[j] * (i === j ? 1 : 0.5); // Covarianza estimada
                    adjustedRisk += weights[i] * weights[j] * covariance;
                }
                adjustedRisk += gamma * weights[i] * (1 - transparencies[i]);
            }

            // Actualizar resultados en la página
            document.getElementById('expectedReturn').textContent = (expectedReturn * 100).toFixed(2) + '%';
            document.getElementById('portfolioRisk').textContent = (adjustedRisk * 100).toFixed(2) + '%';

            // Explicación en palabras
            const explanationText = document.getElementById('explanationText');
            if (expectedReturn >= 0 && adjustedRisk >= 0) {
                explanationText.textContent = `Con una rentabilidad esperada del ${(expectedReturn * 100).toFixed(2)}% y un riesgo ajustado del ${(adjustedRisk * 100).toFixed(2)}%, esta cartera optimiza la sostenibilidad y la transparencia, proporcionando un equilibrio saludable entre rendimientos y riesgos.`;
            } else {
                explanationText.textContent = "Los parámetros elegidos podrían no ser óptimos. Intente ajustar los valores de sostenibilidad y confianza.";
            }

            // Graficar resultados
            const ctx = document.getElementById('portfolioChart').getContext('2d');

            // Destruir el gráfico anterior si existe
            if (window.portfolioChart) {
                window.portfolioChart.destroy();
            }

            window.portfolioChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Rentabilidad Esperada', 'Riesgo Ajustado'],
                    datasets: [{
                        label: 'Porcentaje (%)',
                        data: [(expectedReturn * 100).toFixed(2), (adjustedRisk * 100).toFixed(2)],
                        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
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

        // Agregar un activo por defecto al cargar la página
addAsset();
