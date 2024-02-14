// mincostos.js

function simular() {
    const salario = parseFloat(document.getElementById("salario").value);
    const capital = parseFloat(document.getElementById("capital").value);
    const produccion = parseFloat(document.getElementById("produccion").value);
    const gastotrabajo = parseFloat(document.getElementById("gastotrabajo").value) * 0.01;
    const gastocapital = parseFloat(document.getElementById("gastocapital").value) * 0.01;
    const trabajo = calcularOptimoL(salario, capital, produccion, gastotrabajo, gastocapital);
    const kapital = calcularOptimoK(salario, capital, produccion, gastotrabajo, gastocapital);
    const costo = calcularCostoO(salario, capital, produccion, gastotrabajo, gastocapital);

    document.getElementById("optima_trabajo").value = trabajo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("optima_capital").value = kapital.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("costominimo").value = costo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calcularOptimoL(salario, capital, produccion, gastotrabajo, gastocapital) {
    const alphamasbeta = (gastotrabajo + gastocapital);
    const alphaerre = (gastotrabajo * capital);
    const betadobleu = (gastocapital * salario);
    const produccionQ = produccion **(1/alphamasbeta);
    return (produccionQ) * (alphaerre/betadobleu)**(gastocapital/alphamasbeta);
}

function calcularOptimoK(salario, capital, produccion, gastotrabajo, gastocapital) {
    const alphamasbeta = (gastotrabajo + gastocapital);
    const alphaerre = (gastotrabajo * capital);
    const betadobleu = (gastocapital * salario);
    const produccionQ = produccion **(1/alphamasbeta);
    return (produccionQ) * (betadobleu/alphaerre)**(gastotrabajo/alphamasbeta);
}

function calcularCostoO(salario, capital, produccion, gastotrabajo, gastocapital) {
    const alphamasbeta = (gastotrabajo + gastocapital);
    const alphaerre = (gastotrabajo * capital);
    const betadobleu = (gastocapital * salario);
    const produccionQ = produccion **(1/alphamasbeta);
    const ele = (produccionQ) * (alphaerre/betadobleu)**(gastocapital/alphamasbeta);
    const ca  = (produccionQ) * (betadobleu/alphaerre)**(gastotrabajo/alphamasbeta);
    return (salario * ele) + (capital * ca );
}

