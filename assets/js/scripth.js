const input = document.querySelector("#input");
const select = document.querySelector("#select");
const btnBuscar = document.querySelector("#btnBuscar");
const clpFinal = document.querySelector("#monto-final");

const baseUrl = "https://mindicador.cl/api/";

async function getMonedas() {
    try {
        const res = await fetch(baseUrl);
        const data = await res.json()
        const monedasPermitidas = ["dolar", "utm", "bitcoin"]

        monedasPermitidas.forEach((codigo) => {
            const moneda = data[codigo];
            const option = document.createElement("option");
            option.value = codigo;
            option.textContent = moneda.nombre;
            select.appendChild(option);
        })

    }   catch (error) {
        console.log(error)
    } 
}

async function convertirMoneda() {

    try{
        const montoPesos = Number(input.value);
        const codigoMoneda = select.value;
    
        if(!codigoMoneda) {
            clpFinal.textContent = "Porfavor Selecciona una Moneda";
            return
        }
        const res = await fetch(`https://mindicador.cl/api/${codigoMoneda}`)
        const data = await res.json();
        const valorMoneda = data.serie[0].valor
    
        const resultado = montoPesos / valorMoneda;
    
        clpFinal.textContent = `${montoPesos} pesos Chilenos son aprox ${resultado.toFixed(2)}`;

        dibujarGrafico(data.serie.slice(0, 10), data.nombre);
        
    }catch (error) {
        console.log(error);
    }
}

getMonedas();

btnBuscar.addEventListener("click", convertirMoneda);

function dibujarGrafico(data, nombreMoneda) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Elimina gráfico anterior si existe
    if (window.miGrafico) {
        window.miGrafico.destroy();
    }

    const fechas = data.map(item => new Date(item.fecha).toLocaleDateString("es-CL"));
    const valores = data.map(item => item.valor);

    window.miGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas.reverse(),
            datasets: [{
                label: `Historial últimos 10 días (${nombreMoneda})`,
                data: valores.reverse(),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}


