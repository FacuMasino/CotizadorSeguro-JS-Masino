
function isValid(fieldId) {
    const DOMById = (elId) => document.getElementById(elId);

    switch (fieldId) {
        case 'clientName':
            const clientName = DOMById('clientName').value.trim().replace(' ','');
            if(clientName.split('').some(char => char.toLowerCase() == char.toUpperCase())) return false;
            if(clientName.length < 3) return false;
            if(clientName.split('').some(char => !isNaN(parseInt(char)))) return false;
            return true;
        case 'clientAge':
            const clientAge = Number(DOMById('clientAge').value.trim());
            if(isNaN(clientAge)) return false;
            if(clientAge < 17) return false;
            if(clientAge > 85) return false;
            return true;
        case 'vehicleBrand':
            const vehicleBrand = DOMById('vehicleBrand').value.trim().replace(' ','');
            if(vehicleBrand.split('').some(char => char.toLowerCase() == char.toUpperCase())) return false;
            if(vehicleBrand.length < 3) return false;
            if(vehicleBrand.split('').some(char => !isNaN(parseInt(char)))) return false;
            return true;
        case 'vehicleYear':
            const vehicleYear = Number(DOMById('vehicleYear').value.trim());
            if(isNaN(vehicleYear)) return false;
            if(vehicleYear < 2012) return false;
            if(vehicleYear > 2022) return false;
            return true;
        case 'vehicleModel':
            const vehicleModel = DOMById('vehicleModel').value.trim();
            if(vehicleModel.toLowerCase() == vehicleModel.toUpperCase()) return false;
            if(vehicleModel.length < 5) return false;
            return true;
        case 'vehicleAmount':
            const vehicleAmount = Number(DOMById('vehicleAmount').value.trim());
            if(isNaN(vehicleAmount)) return false;
            if(vehicleAmount < 100000) return false;
            return true;
    }
}

function validateClientData() {
    return isValid('clientName') && isValid('clientAge') ? true : false;
}

function validateVehicleData() {
    const fields = ['vehicleBrand', 'vehicleYear', 'vehicleModel', 'vehicleAmount'];
    if(fields.some(field => !isValid(field))) return false;
    return true;
}

function nextStep(isValid, collapseId, actualCollapseId) {
    if(isValid){
        // Si hubo un error, ocultar mensaje
        const alertMsg = document.getElementById('alert-'+actualCollapseId);
        if(alertMsg.innerHTML !== '') alertMsg.innerHTML = '';
        // Deshabiliar etapa actual
        document.getElementById('btn-'+actualCollapseId).disabled = true;
        // Ir a la siguiente etapa
        showStep(collapseId)
    } else {
        showAlert('Los datos ingresados son inválidos, por favor revisalos.','danger','alert-' + actualCollapseId)
    }
}

function showStep(collapseId) {
    const collapse = document.getElementById(collapseId)
    document.getElementById('btn-'+collapseId).disabled = false;
    return new bootstrap.Collapse(collapse, {
    toggle: true
    });
}

function showAlert(msg, type, targetId){
    const alertHTML = document.getElementById(targetId);
    alertHTML.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + msg + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    alertHTML.scrollIntoView();
}

function paintField(isValid, fieldElement){
    if(!isValid){
        fieldElement.style.border = '1px solid red';
    } else {
        fieldElement.style.border = '1px solid green';
    }
}

// Eventos en escucha

const clientNameEvents = document.getElementById('clientName');
clientNameEvents.addEventListener('input', () => paintField(isValid('clientName'), clientNameEvents));

const clientAgeEvents = document.getElementById('clientAge');
clientAgeEvents.addEventListener('input', () => paintField(isValid('clientAge'), clientAgeEvents));

const vehicleBrandEvents = document.getElementById('vehicleBrand');
vehicleBrandEvents.addEventListener('input', () => paintField(isValid('vehicleBrand'), vehicleBrandEvents));

const vehicleModelEvents = document.getElementById('vehicleModel');
vehicleModelEvents.addEventListener('input', () => paintField(isValid('vehicleModel'), vehicleModelEvents));

const vehicleYearEvents = document.getElementById('vehicleYear');
vehicleYearEvents.addEventListener('input', () => paintField(isValid('vehicleYear'), vehicleYearEvents));

const vehicleAmountEvents = document.getElementById('vehicleAmount');
vehicleAmountEvents.addEventListener('input', () => paintField(isValid('vehicleAmount'), vehicleAmountEvents));


// Definición de formas de pago
const paymentCash = new PaymentType('Cash',6,0);
const paymentBiannual = new PaymentType('Biannual',1,-0.15);
const paymentAuto = new PaymentType('Automatic',6,-0.05);

// Definición de Coberturas
const PRODUCT_RC = new Product('RC', 'Responsabilidad Civil', 0);
const PRODUCT_TC = new Product('TC', 'Tercero Completo', 0.0055);
const PRODUCT_TR = new Product('TR', 'Todo Riesgo', 0.017);

// falta agregar opcion en el formulario para elegir coberturas
// falta agregar GNC y Uso seleccionado por el usuario
function quoteAndShow(paymentType) {
    const clientName = document.getElementById('clientName').value;
    const clientAge = Number(document.getElementById('clientAge').value);
    const vehicleBrand = document.getElementById('vehicleBrand').value;
    const vehicleModel = document.getElementById('vehicleModel').value;
    const vehicleYear = Number(document.getElementById('vehicleYear').value);
    const vehicleAmount = Number(document.getElementById('vehicleAmount').value);

    // habilitar y mostrar etapa de cotización
    document.getElementById('btn-collapsePayment').disabled = true;
    showStep('collapseQuotation');

    switch (paymentType) {
        case 1:
            paymentType = paymentCash;
            break;
        case 2:
            paymentType = paymentBiannual;
            break;
        case 3:
            paymentType = paymentAuto;
            break;
    }

    const clientVehicle = new Car(vehicleBrand, vehicleModel, vehicleYear, vehicleAmount, 0.3, false,false);
    const clientData = new Person(clientName, clientAge);
    const clientCoverages = [PRODUCT_RC,PRODUCT_TC, PRODUCT_TR];
    const quotation = new Quotation(clientData, clientVehicle, clientCoverages, paymentType);
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