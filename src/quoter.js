// Este archivo posee las clases y funciones principales necesarias para generar la cotización

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
    constructor(code, name, description, rate) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.rate = rate; // Tarifa usada para calcular el costo en policyPrime()
    }
}

class PaymentType {
	constructor(method, installments, discount){
		this.method = method;
		this.installments = installments;
		this.discount = discount;
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
                description: prod.description,
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

// Recargos y descuentos
// Devuelven un valor negativo o positivo según corresponda
const commercialUseDiscount = (price) => price * -0.05;
const commercialDiscount = (price,paymentType) => price * paymentType.discount;
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
    premium += commercialDiscount(premium, paymentType);

    return premium; 
}