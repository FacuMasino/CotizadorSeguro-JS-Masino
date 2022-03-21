class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

// Clase "auto" con las propiedades de cada vehículo
class Car {
    constructor(brand, model, year, amount, automaticAdjustment, commercialUse = false, gnc = false) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.amount = parseInt(amount);
        this.automaticAdjustment = parseFloat(automaticAdjustment);
        this.gnc = gnc;
        this.commercialUse = commercialUse;
    }
}

/* Clase Producto, para ofrecer una nueva cobertura
debe instanciarse esta clase y sus propiedades */
class Product {
    constructor(code, name, rate) {
        this.code = code;
        this.name = name;
        this.rate = rate; // Tarifa usada para calcular el costo en policyPrime()
    }
}

class Quotation {
    constructor(person, car, product, paymentType) {
        this.person = person;
        this.car = car;
        this.product = product;
        this.paymentType = paymentType;
    }

    // Realiza la cotización de todas las coberturas que haya en 'product'
    // Devuelve un objeto con el detalle y resultado de cada cobertura: código, nombre, premio y cuotas.
    quote() {
        let policy_Prime;
        let total_Prime;
        let Quotation_Result = [];
        let premium;
        this.product.forEach(prod => {
            policy_Prime = policyPrime(prod.rate, this.car.amount, this.car.automaticAdjustment);
            total_Prime = totalPrime(policy_Prime, this.car.gnc, this.car.commercialUse, this.person.age);
            premium = totalPremium(total_Prime, this.paymentType).toFixed(0);
            Quotation_Result.push({
                coverageCode: prod.code,
                name: prod.name,
                premium: premium,
                installments: (premium / this.paymentType.installments).toFixed(0),
            });
        }
        )
        return Quotation_Result;
    }

    // Devuelve un String con las coberturas elegidas para cotizar
    getProductsStr() {
        return this.product.map(prod => prod.name).toString();
    }
}

// Formas de pago
const paymentTypes = [
    {
        method: 'Cash',
        installments: 6,
    },
    {
        method: 'Biannual',
        installments: 1,
    },
    {
        method: 'Automatic',
        installments: 6,
    },
]

// Definición de Coberturas
const PRODUCT_RC = new Product('RC', 'Responsabilidad Civil', 0);
const PRODUCT_TC = new Product('TC', 'Tercero Completo', 0.0055);
const PRODUCT_TR = new Product('TR', 'Todo Riesgo', 0.017);

// Recargos y descuentos
// Devuelven un valor negativo o positivo según corresponda
const commercialUseDiscount = (price) => price * -0.05;
const gncCharge = (price) => price * 0.12;
function ageCharge(age, price) {
    if (age < 27) {
        return price * 0.004;
    } else if (age <= 50) {
        return price * 0.001;
    } else {
        return price * 0.002;
    }
}
function commercialDiscount(price, paymentType) {
    if (paymentType.method === 'Biannual') {
        // Descuento por pago semestral
        return price * -0.15;
    } else if (paymentType.method !== 'Cash') {
        // Descuento por pago débito automático
        return price * -0.05;
    }
    // Sin descuento, paga en efectivo y cuotas
    return 0;
}

// Calcular prima base de póliza
// El ajuste automático mínimo es 15%
function policyPrime(productRate, carAmount, automaticAdjustment = 0.15) {
    const EXPENSES_RATE = 1500; // Costos de producción
    const RC_BASE = 5000; // Costo base Responsabilidad Civil
    const PRIME_RATE = (carAmount + (carAmount * automaticAdjustment)) * productRate; // Prima de tarifa, para RC es 0

    return PRIME_RATE + EXPENSES_RATE + RC_BASE;
}

// Calcular prima con cargos adicionales
function totalPrime(policyPrime, gnc, commercialUse, age) {
    let prime = policyPrime;
    if (gnc) {
        prime += gncCharge(policyPrime);
    }
    if (commercialUse) {
        prime += commercialUseDiscount(policyPrime);
    }
    prime += ageCharge(age, policyPrime);

    return prime;
}

// Calcular premio
function totalPremium(totalPrime, paymentType) {
    const COMPANY_FEE = 0.1; // tasa de la compañía
    const SSN_FEE = 0.02; // tasa Superintendencia Nacional de seguros
    const IVA_FEE = 0.21; // Impuesto IVA 21%

    premium = (totalPrime + (totalPrime * COMPANY_FEE));
    premium += premium * SSN_FEE;
    premium += premium * IVA_FEE;

    // Aplicar descuento según forma de pago
    premium += commercialDiscount(premium, paymentType)

    return premium;
}

// -------------------------------------------------------------- //
// ------------------Simulación de cotización-------------------- //
// -------------------------------------------------------------- //

// Preguntar que vehículo va a cotizar
function getVehicle() {
    // Objeto con vehículos que se obtendrían de una base de datos actualizada
    // Estos se muestran al cliente para que seleccione el que corresponda
    const vehicles = [
        {
            brand: 'Volkswagen',
            model: 'GOL 1.6 5P - TRENDLINE',
            year: '2017',
            amount: 800000,
        },
        {
            brand: 'Ford',
            model: 'FOCUS 2.0 4P - SE PLUS AT',
            year: '2016',
            amount: 1100000,
        },
        {
            brand: 'Chevrolet',
            model: 'ONIX 1.4 4P - JOY LS',
            year: '2021',
            amount: 2600000,
        },
    ]
    const vehicleStrList = vehicles.map((vh, index) => `\n ${(index + 1)}. ${vh.brand} - ${vh.model} - ${vh.year}`).join('');
    const vehicle = parseInt(prompt(`Por favor seleccione un vehículo: ${vehicleStrList}`));
    if (vehicle !== null && !isNaN(vehicle) && vehicle !== 0) {
        return vehicles[vehicle - 1];
    } else {
        return []; // Ingresó mal el dato, devuelve array vacío
    }
}

// Preguntar nombre y edad
function getClientData() {
    const clientName = prompt('Por favor ingresá tu nombre:');
    const clientAge = parseInt(prompt('Por favor ingresá tu edad (entre 17 y 85 años):'));
    if (clientName === null) return false;
    if (clientName.toLowerCase != clientName.toUpperCase && clientName.length > 3 && !isNaN(clientAge) && clientAge >= 17 && clientAge <= 85) {
        return [clientName, clientAge];
    } else {
        return []; // Ingresó mal los datos, devuelve array vacío
    }
}

// Preguntar forma de pago
function getPaymentType() {
    const paymentType = parseInt(prompt(`Seleccione una forma de pago preferida:\
    \n1. Efectivo - 6 cuotas\n2. Efectivo - 1 pago semestral (-15%) \n3. Débito/Crédito Automático - 6 Cuotas (-5%)`));
    if (!isNaN(paymentType) && paymentType >= 1 && paymentType <= 3) {
        return [paymentType];
    } else {
        return []; // Ingresó mal el dato, devuelve array vacío
    }
}

function getCoverages() {
    let objCoverages = []; // array a devolver con las coberturas
    const coverages = prompt(`Elija una o más coberturas separadas por comas (1,2):\
    \n1. Todo Riesgo\
    \n2. Tercero Completo\
    \n3. Responsabilidad Civil`);

    if (coverages === null) return [];
    let arrCoverages = coverages.split(' ').join(''); // eliminar espacios
    arrCoverages = arrCoverages.split(',') // lista con las opciones
    if (arrCoverages.length > 3) return []; // no más de 3 opciones
    arrCoverages = arrCoverages.map(option => Number(option)) // tratar de convertir a numero

    // validar que todos sean numeros, distintos de 0 y menores a 3
    if (arrCoverages.some(option => isNaN(option) || option > 3 || option == 0)) return [];

    arrCoverages.forEach(option => {
        switch (option) {
            case 1:
                objCoverages.push(PRODUCT_TR);
                break;
            case 2:
                objCoverages.push(PRODUCT_TC);
                break;
            case 3:
                objCoverages.push(PRODUCT_RC);
                break;
        }

    });
    return objCoverages; // si se cumple con todo, devolver coberturas
}

function quoteAndShow(vehicle, client, paymentType, products) {
    const clientVehicle = new Car(vehicle.brand, vehicle.model, vehicle.year, vehicle.amount, 0.3, false,false);
    const clientData = new Person(client[0], client[1]);
    const clientCoverages = products;
    const quotation = new Quotation(clientData, clientVehicle, clientCoverages, paymentTypes[paymentType - 1]);
    const coverages = quotation.quote();

    let htmlQuotationData = `
        <div class="col-4 border rounded-start m-1 p-3">
            <p class="m-0"><span class="fw-bold">Marca:</span> ${quotation.car.brand}</p>
            <p class="m-0"><span class="fw-bold">Modelo:</span> ${quotation.car.model}</p>
            <p class="m-0"><span class="fw-bold">Año:</span> ${quotation.car.year} </p>
            <p class="m-0"><span class="fw-bold">S.A:</span> ${quotation.car.amount}</p>
        </div>
        <div class="col-4 border rounded-end text-rigth m-1 p-3">
            <p class="m-0"><span class="fw-bold">Combustible adicional:</span>${quotation.car.gnc ? 'GNC':'No'}</p>
            <p class="m-0"><span class="fw-bold">Uso:</span> ${quotation.car.commercialUse ? 'Comercial':'Particular'}</p>
            <p class="m-0"><span class="fw-bold">Ajuste:</span> ${quotation.car.automaticAdjustment*100}%</p>
        </div>
        <div class="col-4 border rounded-end text-rigth m-1 p-3">
            <p class="m-0"><span class="fw-bold">Cliente:</span> ${quotation.person.name}</p>
            <p class="m-0"><span class="fw-bold">Edad:</span> ${quotation.person.age}</p>
            <p class="m-0"><span class="fw-bold">Forma de pago:</span> ${paymentType === 3 ? 'Débito/Crédito':'Efectivo'}</p>
            <p class="m-0"><span class="fw-bold">Cuotas:</span> ${paymentType === 2 ? '1':'6'}</p>
        </div>
    `;

    let htmlProductList = "";
    coverages.forEach(product => { 
        htmlProductList += `
            <div class="d-flex align-items-center border-top border-bottom border-dark p-2">
            <div class="col-8">
                <p class="m-0 fw-bold">${product.coverageCode} - ${product.name}</p>
                <p class="m-0">${product.name}</p>
            </div>
            <div class="col-4 text-end">
                <p class="m-0 fw-bold">${quotation.paymentType.installments}x $ ${product.installments}</p>
            </div>
            </div>
        `;
    });

    console.log(`Cotización realizada con éxito. \nCoberturas elegidas: ${quotation.getProductsStr()}`);
    document.getElementById('quotation-data').innerHTML = htmlQuotationData;
    document.getElementById('quotation-list').innerHTML = htmlProductList;

}

// Pedir y validar datos
/* Para el ejemplo y para evitar hacer tantos prompts solo se piden los datos más importantes.
   GNC, tipo de uso y ajuste automático ya tienen un valor por defecto.
*/
do {
    var retry;
    const clientVehicle = getVehicle();
    const clientData = getClientData();
    const clientPaymentType = getPaymentType();
    const clientCoverages = getCoverages();
    if (clientVehicle.length != 0 && clientData.length != 0 && clientPaymentType.length != 0 && clientCoverages.length != 0) {
        retry = false;
        quoteAndShow(clientVehicle, clientData, clientPaymentType, clientCoverages);
    } else {
        retry = confirm('Alguno de los datos ingresados no poseen el formato correcto o son inválidos, desea volver a intentar?');
        if (!retry) console.log('Cotización cancelada por el usuario.');
    }
} while (retry);