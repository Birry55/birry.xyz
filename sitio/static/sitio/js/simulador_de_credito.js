let saldoCapitalData = [],  pagoInteresesData = [], pagoCapitalData = [], indices = [];
let valor_vehiculo = document.getElementById("valor_vehiculo");
let valor_carroceria = document.getElementById("valor_carroceria");
let cuota_inicial_porcentaje = document.getElementById("cuota_inicial_porcentaje");
let total_camion = document.getElementById("total_camion");
let valor_total_camion = document.getElementById("valor_total_camion");
let tasa_efectiva = document.getElementById("tasa_efectiva");
let saldo_a_financiar = document.getElementById("saldo_a_financiar");
let seguro_auto = document.getElementById("seguro_auto");
let vehiculo_tabla = document.getElementById("vehiculo_tabla");
let seguro_tabla = document.getElementById("seguro_tabla");
let cuota_mensual_tabla = document.getElementById("cuota_mensual_tabla");
let fechaInicio = document.getElementById("fecha_inicio");
let llenarTabla = document.querySelector('#lista_tabla tbody');
let totalTabla = document.querySelector('#lista_tabla tfoot');
let tasaMv = document.getElementById("tasa_mv")



valor_carroceria.addEventListener("change", () => {
    valor_total_camion.value = parseFloat(valor_vehiculo.value) + parseFloat(valor_carroceria.value)
    total_camion.value = valor_total_camion
    


});



cuota_inicial_porcentaje.addEventListener("change", () => {
    valor_cuota_inicial.value = parseFloat(valor_total_camion.value) *(parseFloat(cuota_inicial_porcentaje.value)/100 ) ;
    saldo_a_financiar.value = parseFloat(valor_total_camion.value) - parseFloat(valor_cuota_inicial.value);   


}) 

tasa_efectiva.addEventListener("change", () => {
    ea = tasa_efectiva.value/100
    tasaMv.value = "El interes mes vencido equivalente es:     " + parseFloat((Math.pow(1 + ea, 1/12) - 1) *100)  + " %";
     



})



function simular() {
    while(llenarTabla.firstChild){
        llenarTabla.removeChild(llenarTabla.firstChild);
    }

    let interes = parseFloat (tasa_efectiva.value/1200);
    let prestamo = parseFloat(saldo_a_financiar.value);
    let n = plazo.value;
    let pago_intereses = parseFloat(interes * Math.pow(1 + interes, n));
    let pago_capital = parseFloat(Math.pow(1 + interes, n) - 1);
    /////// verificar si en la cuota del gasto de matricula aproximado n = 12///////
    let pago_intereses_seguro = parseFloat(interes * Math.pow(1 + interes, n));
    let pago_capital_seguro = parseFloat(Math.pow(1 + interes, n) - 1);
    let seguro = parseFloat(seguro_auto.value)
    let VehiculoCuota = prestamo * (pago_intereses/pago_capital) 
    vehiculo_tabla.value = VehiculoCuota;
    let seguroCuota = seguro * (pago_intereses_seguro/pago_capital_seguro) 
    seguro_tabla.value = seguroCuota;
    CuotaCamion = VehiculoCuota + seguroCuota 
    cuota_mensual_tabla.value = CuotaCamion;

    let fechas = [];
    let fechaActual = fechaInicio.value
    let mes_actual = moment(fechaActual);
    mes_actual.add(1, 'month');

    let  pagoIntereses =0, pagoCapital = 0, saldoCapital = 0, seguroAuto = seguroCuota, cuotaTotal = 0, cuotaSuma = 0, 
    interesSuma= 0, capitalSuma = 0, seguroSuma = 0;

    for(let i = 1; i <= n; i++) {

        pagoInteres = parseFloat(prestamo *interes);
        interesSuma = interesSuma + pagoInteres;
        pagoCapital = parseFloat(CuotaCamion - pagoInteres - seguroCuota);
        capitalSuma = capitalSuma + pagoCapital;
        saldoCapital = parseFloat(prestamo - pagoCapital);
        prestamo = saldoCapital;
        saldoCapitalData[i] = saldoCapital;
        pagoInteresesData[i] = pagoInteres;
        pagoCapitalData[i] = pagoCapital;
        indices[i] = "pago " + i; 



        //Formato fechas
        fechas[i] = mes_actual.format('DD-MM-YYYY');
        mes_actual.add(1, 'month');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-dark text-center">${[i]}</td>
            <td class="text-dark ">${fechas[i]}</td>
            <td class="text-dark icon-attach_money">${saldoCapital.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
            <td class="text-dark icon-attach_money">${pagoInteres.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
            <td class="text-dark icon-attach_money">${pagoCapital.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
            <td class="text-dark icon-attach_money">${seguroAuto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
            <td class="text-dark icon-attach_money">${CuotaCamion.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
        `;
        llenarTabla.appendChild(row)
    }

    cuotaSuma = CuotaCamion * n;
    seguroSuma = seguroAuto * n;

    while(totalTabla.firstChild){
        totalTabla.removeChild(totalTabla.firstChild);
    }
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class=" ">Totales</td>
        <td class=" "></td>
        <td class=" "></td>
        <td class=" icon-attach_money">${interesSuma.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
        <td class=" icon-attach_money">${capitalSuma.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
        <td class=" icon-attach_money">${seguroSuma.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
        <td class=" icon-attach_money">${cuotaSuma.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
    `;
    totalTabla.appendChild(row)




var ctx = document.getElementById("myAreaChart");
var Hoy = new Chart(ctx, {
  type: 'line',
  data: {
    labels: indices,
    datasets: [{
      label: "Saldo Capital",
      lineTension: 0.3,
      backgroundColor: "rgba(100, 100, 100, 0.05)",
      borderColor: "rgba(100, 100, 100, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(100, 100, 100, 1)",
      pointBorderColor: "rgba(100, 100, 100, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(100, 100, 100, 1)",
      pointHoverBorderColor: "rgba(100, 100, 100, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      fill: false,
      steppedLine: true,
      data: saldoCapitalData,
    }

    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: true,
          drawBorder: true
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: true
    },
    tooltips: {
      backgroundColor: "rgb(72,72,72)",
      bodyFontColor: "#fff",
      bodyFontSize: 18,
      titleMarginBottom: 10,
      titleFontColor: '#fff',
      titleFontSize: 20,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      footerFontSize: 18,
      footerFontColor: "rgb(0, 255, 0)",
      displayColors: true,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        },

        //footer: function(beneficio, data){
          //et index = beneficio[0].index;
          //return "Cuota: " + '$' + number_format(data.datasets[0].data[index] + data.datasets[1].data[index]);
         //}       


      }
    }
  }
});


var ctx = document.getElementById("myAreaChart2");
var Hoy = new Chart(ctx, {
  type: 'line',
  data: {
    labels: indices,
    datasets: [{
      label: "Abono Capital",
      lineTension: 0.3,
      backgroundColor: "rgba(100, 100, 100, 0.05)",
      borderColor: "rgba(100, 100, 100, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(100, 100, 100, 1)",
      pointBorderColor: "rgba(100, 100, 100, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(100, 100, 100, 1)",
      pointHoverBorderColor: "rgba(100, 100, 100, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      fill: false,
      steppedLine: true,
      data: pagoCapitalData,
    }

    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: true,
          drawBorder: true,
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: true
    },
    tooltips: {
      backgroundColor: "rgb(72,72,72)",
      bodyFontColor: "#fff",
      bodyFontSize: 18,
      titleMarginBottom: 10,
      titleFontColor: '#fff',
      titleFontSize: 20,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      footerFontSize: 18,
      footerFontColor: "rgb(0, 255, 0)",
      displayColors: true,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        },

        //footer: function(beneficio, data){
          //et index = beneficio[0].index;
          //return "Cuota: " + '$' + number_format(data.datasets[0].data[index] + data.datasets[1].data[index]);
         //}       


      }
    }
  }
});


var ctx = document.getElementById("myAreaChart3");
var Hoy = new Chart(ctx, {
  type: 'line',
  data: {
    labels: indices,
    datasets: [{
      label: "Abono Intereses",
      lineTension: 0.3,
      backgroundColor: "rgba(100, 100, 100, 0.05)",
      borderColor: "rgba(100, 100, 100, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(100, 100, 100, 1)",
      pointBorderColor: "rgba(100, 100, 100, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(100, 100, 100, 1)",
      pointHoverBorderColor: "rgba(100, 100, 100, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      fill: false,
      steppedLine: true,
      data: pagoInteresesData,
    }

    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: true,
          drawBorder: true,
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: true
    },
    tooltips: {
      backgroundColor: "rgb(72,72,72)",
      bodyFontColor: "#fff",
      bodyFontSize: 18,
      titleMarginBottom: 10,
      titleFontColor: '#fff',
      titleFontSize: 20,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      footerFontSize: 18,
      footerFontColor: "rgb(0, 255, 0)",
      displayColors: true,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        },

        //footer: function(beneficio, data){
          //et index = beneficio[0].index;
          //return "Cuota: " + '$' + number_format(data.datasets[0].data[index] + data.datasets[1].data[index]);
         //}       


      }
    }
  }
});


let interes_mv = document.getElementById("interes_mv")
let interes_tea = document.getElementById("interes_tea")

interes_mv.addEventListener("change", () => {

    mv = interes_mv.value/100

    interes_tea.value = parseFloat((Math.pow(1 + mv, 12) - 1) *100)

})




}




///////////////////////////// graficas 



// Set new default font family and font color to mimic Bootstrap's default styling


