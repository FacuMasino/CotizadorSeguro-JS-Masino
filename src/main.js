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

	Quote() {
		let policy_Prime;
		let total_Prime;
		let Quotation_Result = [];
		for(let i = 0; i <= this.product.length-1; i++) {
			switch(this.product[i]){
				case 'TR':
					policy_Prime = policyPrime(FULL_COVERAGE_RATE, this.car.amount,this.car.automaticAdjustment);
					total_Prime = totalPrime(policy_Prime, this.car.gnc, this.car.commercialUse,this.person.age);
					Quotation_Result.push({
						coverageCode: 'TR',
						description: 'Todo Riesgo',
						premium: totalPremium(total_Prime).toFixed(0),
						installments: (premium/6).toFixed(0),
					});
					break;
				case 'TC':
					policy_Prime = policyPrime(MEDIUM_COVERAGE_RATE, this.car.amount,this.car.automaticAdjustment);
					total_Prime = totalPrime(policy_Prime, this.car.gnc, this.car.commercialUse,this.person.age);
					Quotation_Result.push({
						coverageCode: 'TC',
						description: 'Tercero Completo',
						premium: totalPremium(total_Prime).toFixed(0),
						installments: (premium/6).toFixed(0),
					});
					break;
			}
		}
		return Quotation_Result;
	}
}

// Tarifas de cobertuars
const FULL_COVERAGE_RATE = 0.017;
const MEDIUM_COVERAGE_RATE = 0.0045;

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
	const EXPENSES_RATE = 0.008; // Porcentaje para gastos de administración y producción
	const PRIME_RATE = EXPENSES_RATE + productRate; // Prima de tarifa
	
	return PRIME_RATE * (carAmount+(carAmount*automaticAdjustment));
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
const cotizacion = new Quotation(cliente,auto,["TR", "TC"]);

const coberturas = cotizacion.Quote();

console.log(`Cliente: ${cotizacion.person.name}
Marca: ${cotizacion.car.brand}
Modelo: ${cotizacion.car.model}
Año: ${cotizacion.car.year}
Suma Asegurada: ${cotizacion.car.amount}
Ajuste automático: ${cotizacion.car.automaticAdjustment*100}%
Uso: ${cotizacion.car.commercialUse ? 'Comercial':'Particular'}
GNC: ${cotizacion.car.gnc ? 'Sí':'No'}
Coberturas: ${cotizacion.product}`);

for(let i = 0; i <= coberturas.length - 1; i++){
	console.log(`${coberturas[i].coverageCode} - ${coberturas[i].description} \nTotal: $ ${coberturas[i].premium} \n6x $ ${coberturas[i].installments}`);
}