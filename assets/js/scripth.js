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
        
    }catch (error) {
        console.log(error);
    }
}

getMonedas()

btnBuscar.addEventListener("click", convertirMoneda);