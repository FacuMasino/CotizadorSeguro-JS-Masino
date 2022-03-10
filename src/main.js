// Coberturas disponibles
const products = [
	{
		code: 'RC',
		name: 'Responsabilidad Civil',
		rate: 0,
	},
	{
		code: 'TC',
		name: 'Tercero Completo',
		rate: 0.0055,
	},
	{
		code: 'TR',
		name: 'Todo Riesgo',
		rate: 0.017,
	},
]

class Person {
	constructor(name,age) {
		this.name = name;
		this.age = age;
	}
}

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

class Quotation {
	constructor (person,car, product) {
		this.person = person;
		this.car = car;
		this.product = product;
	}

	quote() {
		let policy_Prime;
		let total_Prime;
		let Quotation_Result = [];
		this.product.forEach(prod => {
				policy_Prime = policyPrime(prod.rate, this.car.amount,this.car.automaticAdjustment);
				total_Prime = totalPrime(policy_Prime, this.car.gnc, this.car.commercialUse,this.person.age);
				Quotation_Result.push({
					coverageCode: prod.code,
					name: prod.name,
					premium: totalPremium(total_Prime).toFixed(0),
					installments: (premium/6).toFixed(0),
				});
			}
		)

		return Quotation_Result;
	}
	
	getProductsStr() {
		return this.product.map(prod => prod.name).toString();
	}
}

// Recargos y descuentos
const commercialUseDiscount = (price) => price * -0.05;
const gncCharge = (price) => price * 0.12;
function ageCharge(age, price){
	if(age < 27) {
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
	const PRIME_RATE = (carAmount+(carAmount*automaticAdjustment)) * productRate; // Prima de tarifa, para RC es 0

	return PRIME_RATE + EXPENSES_RATE + RC_BASE;
}

// Calcular prima con cargos adicionales
function totalPrime(policyPrime,gnc,commercialUse, age) {
	let prime = policyPrime;
	if(gnc){
		prime += gncCharge(policyPrime);
	}
	if(commercialUse){
		prime += commercialUseDiscount(policyPrime);
	}
	prime += ageCharge(age,policyPrime);

	return prime;
}

// Calcular premio
function totalPremium(totalPrime){
	const COMPANY_FEE = 0.1; // tasa de la compañía
	const SSN_FEE = 0.02; // tasa Superintendencia Nacional de seguros
	const IVA_FEE = 0.21; // Impuesto IVA 21%
	
	premium = (totalPrime+(totalPrime * COMPANY_FEE));
	premium += premium*SSN_FEE;
	premium += premium*IVA_FEE;

	return premium;
}

// Prueba
const auto = new Car("Volkswagen", "GOL 4P - 1.6", "2012", 1080000,0.2, false,false);
const cliente = new Person("Facundo", 26);
const cotizacion = new Quotation(cliente,auto,products);

const coberturas = cotizacion.quote();

console.log(`Cliente: ${cotizacion.person.name}
Marca: ${cotizacion.car.brand}
Modelo: ${cotizacion.car.model}
Año: ${cotizacion.car.year}
Suma Asegurada: ${cotizacion.car.amount}
Ajuste automático: ${cotizacion.car.automaticAdjustment*100}%
Uso: ${cotizacion.car.commercialUse ? 'Comercial':'Particular'}
GNC: ${cotizacion.car.gnc ? 'Sí':'No'}
Coberturas: ${cotizacion.getProductsStr()}\n`);

for(let i = 0; i <= coberturas.length - 1; i++){
	console.log(`${coberturas[i].coverageCode} - ${coberturas[i].name} \nTotal: $ ${coberturas[i].premium} \n6x $ ${coberturas[i].installments}\n`);
}