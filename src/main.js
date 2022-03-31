// Validaciones
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
    const fields = ['clientName', 'clientAge'];
    let invalids = 0;
    fields.forEach(field => {
        if(!isValid(field)) {
            // Borde rojo si algún campo es inválido
            validateFieldEnableNext(false, document.getElementById(field));
            invalids += 1;
        }
    })
    if(invalids > 0) return false;
    return true;
}

function validateVehicleData() {
    const fields = ['vehicleBrand', 'vehicleYear', 'vehicleModel', 'vehicleAmount'];
    //if(fields.some(field => !isValid(field))) return false;
    let invalids = 0;
    fields.forEach(field => {
        if(!isValid(field)) {
            validateFieldEnableNext(false, document.getElementById(field));
            invalids += 1;
        }
    })
    if(invalids > 0) return false;
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

function previousStep(prevCollapseId, actualCollapseId){
    document.getElementById('btn-'+actualCollapseId).disabled = true;
    showStep(prevCollapseId);
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

function validateFieldEnableNext(isValid, fieldElement, nextElement = ''){
    if(!isValid){
        fieldElement.style.border = '1px solid red';
        if(nextElement != '') document.getElementById(nextElement).disabled = true;
    } else {
        fieldElement.style.border = '1px solid green';
        if(nextElement != '') document.getElementById(nextElement).disabled = false;
    }
}

// Eventos en escucha

const clientNameEvents = document.getElementById('clientName');
clientNameEvents.addEventListener('input', () => validateFieldEnableNext(isValid('clientName'), clientNameEvents,'clientAge'));

const clientAgeEvents = document.getElementById('clientAge');
clientAgeEvents.addEventListener('input', () => validateFieldEnableNext(isValid('clientAge'), clientAgeEvents,'btn-next-client'));

const vehicleBrandEvents = document.getElementById('vehicleBrand');
vehicleBrandEvents.addEventListener('input', () => validateFieldEnableNext(isValid('vehicleBrand'), vehicleBrandEvents,'vehicleYear'));

const vehicleYearEvents = document.getElementById('vehicleYear');
vehicleYearEvents.addEventListener('input', () => validateFieldEnableNext(isValid('vehicleYear'), vehicleYearEvents,'vehicleModel'));

const vehicleModelEvents = document.getElementById('vehicleModel');
vehicleModelEvents.addEventListener('input', () => validateFieldEnableNext(isValid('vehicleModel'), vehicleModelEvents,'vehicleAmount'));

const vehicleAmountEvents = document.getElementById('vehicleAmount');
vehicleAmountEvents.addEventListener('input', () => validateFieldEnableNext(isValid('vehicleAmount'), vehicleAmountEvents,'btn-next-vehicle'));


// Definición de formas de pago
const paymentCash = new PaymentType('Cash',6,0);
const paymentBiannual = new PaymentType('Biannual',1,-0.15);
const paymentAuto = new PaymentType('Automatic',6,-0.05);

// Definición de Coberturas
const PRODUCT_RC = new Product('RC', 'Responsabilidad Civil', 0);
const PRODUCT_TC = new Product('TC', 'Tercero Completo', 0.0055);
const PRODUCT_TR = new Product('TR', 'Todo Riesgo', 0.017);


function createNewQuotation() {
    // Prepara storage para crear una nueva cotización
    setToSession('newQuotation', true);
    setToSession('isEditing',false);
    setToSession('activeId', 0);
    
    const DOMById = (elId) => document.getElementById(elId);

    // resetear todos los campos
    const allFormElements = ['clientName','clientAge', 
    'vehicleBrand', 'vehicleYear', 'vehicleModel', 'vehicleAmount'];

    allFormElements.forEach((el) => {
        DOMById(el).disabled = true;
        DOMById(el).value = '';
        DOMById(el).style.border = '1px solid #ced4da'; // default bootstrap style
    });

    // Habilitar campo cliente y vehiculo para empezar desde 0
    DOMById('clientName').disabled = false;
    DOMById('vehicleBrand').disabled = false;

    // Mostrar primer etapa y deshabilitar las siguientes
    DOMById('btn-collapseClient').disabled = false;
    DOMById('btn-collapseVehicle').disabled = true;
    DOMById('btn-collapsePayment').disabled = true;
    DOMById('btn-collapseQuotation').disabled = true;

    showStep('collapseClient');
}

// Obtener nueva id
function getNewStorageId(isLocal = false){
    if(isLocal){
        const lastId = getFromLocal('lastId');
        if(lastId == null){
            setToLocal('lastId',0)
            return 0;
        }
        setToLocal('lastId',Number(lastId)+1);
        return Number(lastId)+1;
    }
    const lastId = getFromSession('lastId');
    if(lastId == null){
        setToSession('lastId',0);
        return 0;
    }
    setToSession('lastId',Number(lastId)+1)
    return Number(lastId)+1;
}

// Guardar cotización y actualizar lista
function storeQuotation(quotation, isLocal = false) {
    if(isLocal){
        let localQuotations = getFromLocal('quotations') || false;
        if(!localQuotations) localQuotations = [];
        localQuotations.push(quotation);
        setToLocal('quotations',localQuotations);
        renderSavedList();
    } else {
        let sessionQuotations = getFromSession('quotations') || false;
        if(!sessionQuotations) sessionQuotations = [];
        sessionQuotations.push(quotation);
        setToSession('quotations',sessionQuotations);
        renderHistoryList();
    }
}

// Guarda en local la última cotización realizada por el usuario solo si
// no está editando una guardada
function saveQuotation(){
    const isEditing = getFromSession('isEditing');
    const activeId = getFromSession('activeId');
    if(!isEditing) {
        let sessionQuotation = getFromSession('quotations');
        sessionQuotation = sessionQuotation[activeId];
        sessionQuotation.id = getNewStorageId(true);
        storeQuotation(sessionQuotation,true);
        renderSavedList();
        // pasa a ser true porque la cotización actual está guardada en local
        // si vuelve a tocar guardar, no debe guardar una nueva
        setToSession('isEditing', true) 
    }
}

const getHistoryList = () => getFromSession('quotations') || false;
const getSavedList = () => getFromLocal('quotations') || false;

function renderSavedList(isUpdating = false) {
    let quotations = getSavedList();
    //console.log(quotations);
    if (quotations){
        let quotationsHTML = '';
        if(isUpdating) {
            quotations = quotations[quotations.length-1];
            const newItem = document.createElement('button');
            newItem.nodeType = 'button';
            newItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-start';
            newItem.setAttribute('onClick',`btnLoadQuotation(${quotations.id},true)`);
            newItem.innerHTML = `
                <div class="my-1 me-auto">
                    <div class="fw-bold">${quotations.person.name}</div>
                    <div>${quotations.car.brand} ${quotations.car.model} ${quotations.car.year}</div>
                </div>
                <div class="my-1 align-self-stretch d-flex flex-column justify-content-between align-items-end">
                    <span class="mb-1 badge bg-primary rounded-pill">Ver</span>
                    <span class="badge bg-primary rounded-pill">
                    ${quotations.paymentType.method == 'Automatic'?'Automático':'Efectivo'} -
                    ${quotations.paymentType.installments == 6?'6 Cuotas':'1 cuota'}
                    </span>
                </div>
            `;
            document.getElementById('offcanvas-saved-list').lastElementChild.remove(); // Quitar ultima actualización
            document.getElementById('offcanvas-saved-list').appendChild(newItem); // Reemplazar
        } else {
            quotations.forEach((item) => {
                quotationsHTML += `
                    <button type="button" onClick="btnLoadQuotation(${item.id},true)" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                        <div class="my-1 me-auto">
                            <div class="fw-bold">${item.person.name}</div>
                            <div>${item.car.brand} ${item.car.model} ${item.car.year}</div>
                        </div>
                        <div class="my-1 align-self-stretch d-flex flex-column justify-content-between align-items-end">
                            <span class="mb-1 badge bg-primary rounded-pill">Ver</span>
                            <span class="badge bg-primary rounded-pill">
                            ${item.paymentType.method ==  'Automatic'?'Automático':'Efectivo'} -
                            ${item.paymentType.installments == 6?'6 Cuotas':'1 cuota'}
                        </span>
                    </button>
                `;
            })
            document.getElementById('offcanvas-saved-list').innerHTML = quotationsHTML;
        }
    }
}

function renderHistoryList(isUpdating = false) {
    let quotations = getHistoryList();
    //console.log(quotations);
    if (quotations){
        let quotationsHTML = '';
        if(isUpdating) {
            quotations = quotations[quotations.length-1];
            const newItem = document.createElement('button');
            newItem.nodeType = 'button';
            newItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-start';
            newItem.setAttribute('onClick',`btnLoadQuotation(${quotations.id},false)`);
            newItem.innerHTML = `
                <div class="my-1 me-auto">
                    <div class="fw-bold">${quotations.person.name}</div>
                    <div>${quotations.car.brand} ${quotations.car.model} ${quotations.car.year}</div>
                </div>
                <div class="my-1 align-self-stretch d-flex flex-column justify-content-between align-items-end">
                    <span class="mb-1 badge bg-primary rounded-pill">Ver</span>
                    <span class="badge bg-primary rounded-pill">
                    ${quotations.paymentType.method ==  'Automatic'?'Automático':'Efectivo'} -
                    ${quotations.paymentType.installments == 6?'6 Cuotas':'1 cuota'}
                    </span>
                </div>
            `;
            document.getElementById('offcanvas-history-list').lastElementChild.remove(); // Quitar ultima actualización
            document.getElementById('offcanvas-history-list').appendChild(newItem); // Reemplazar
        } else {
            quotations.forEach((item) => {
                quotationsHTML += `
                    <button type="button" onClick="btnLoadQuotation(${item.id},false)" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                        <div class="my-1 me-auto">
                            <div class="fw-bold">${item.person.name}</div>
                            <div>${item.car.brand} ${item.car.model} ${item.car.year}</div>
                        </div>
                        <div class="my-1 align-self-stretch d-flex flex-column justify-content-between align-items-end">
                            <span class="mb-1 badge bg-primary rounded-pill">Ver</span>
                            <span class="badge bg-primary rounded-pill">
                            ${item.paymentType.method ==  'Automatic'?'Automático':'Efectivo'} -
                            ${item.paymentType.installments == 6?'6 Cuotas':'1 cuota'}
                        </span>
                    </button>
                `;
            })
            document.getElementById('offcanvas-history-list').innerHTML = quotationsHTML;
        }
    }
}

// Obtiene las cotizaciones guardadas en Session
// y sobre escribe la que tenga el mismo Id que el activo actualmente
function updateHistoryList(quotationData){
    let activeId = getFromSession('activeId');
    let sessionQuotations = getFromSession('quotations');
    sessionQuotations[activeId] = {id:activeId,...quotationData};
    setToSession('quotations', sessionQuotations);
    renderHistoryList(true);
}

function updateSavedList(quotationData) {
    let activeId = getFromSession('activeId');
    let localQuotations = getFromLocal('quotations');
    localQuotations[activeId] = {id:activeId,...quotationData};
    setToLocal('quotations', localQuotations);
    renderSavedList(true);
}

// Al abrir la página obtiene la ultima cotización
function restoreLastQutation() {
    const isEditing = getFromSession('isEditing');
    const newQuotation = getFromSession('newQuotation');
    const activeId = getFromSession('activeId');
    // Si es falso se hizo una cotizacion previamente
    // Podría haber quedado guardada en el historial o en local
    if(!newQuotation){
        // Si isEditing quedó true, lo ultimo que hizo al salir
        // fue editar o cargar una de las cotizaciones guardads
        // Si no obtener la ultima activa desde el historial
        const quotations = isEditing ? getFromLocal('quotations') : getFromSession('quotations');
        if(quotations) loadQuotation(quotations[activeId]);
    }
}

function btnLoadQuotation(id,isLocal){
    setToSession('activeId', Number(id));
    const quotation = isLocal ? getFromLocal('quotations') : getFromSession('quotations');
    if(isLocal) {
        setToSession('isEditing', true);
        setToSession('NewQuotation', false);
        loadQuotation(quotation[Number(id)]);
    } else {
        setToSession('isEditing',false);
        setToSession('NewQuotation', false)
        loadQuotation(quotation[Number(id)]);
    }
    // Ocultar historial
    document.getElementById('btn-offcanvasHistory').click();
}

// llenar los campos con la información de la cotización
// y renderizar la cotización
function loadQuotation(quotationData){
    const DOMById = (elId) => document.getElementById(elId);
    let adjustmentIndex;
    switch(quotationData.car.automaticAdjustment){
        case 0.15:
            adjustmentIndex = 0;
        case 0.20:
            adjustmentIndex = 1;
        case 0.30:
            adjustmentIndex = 2;
    }
    // Llenar campos
    DOMById('clientName').value = quotationData.person.name;
    DOMById('clientAge').value = quotationData.person.age;
    DOMById('vehicleBrand').value = quotationData.car.brand;
    DOMById('vehicleYear').value = quotationData.car.year;
    DOMById('vehicleModel').value = quotationData.car.model;
    DOMById('vehicleAmount').value = quotationData.car.amount;
    DOMById('vehicleAdjustment').selectedIndex = adjustmentIndex;
    DOMById('vehicleUsage').selectedIndex = quotationData.car.commercialUse ? 1:0;
    DOMById('vehicleGNC').checked = quotationData.car.gnc;

    // habilitar todos los campos para que sean editables
    const allFormElements = ['clientName','clientAge','btn-next-client', 
    'vehicleBrand', 'vehicleYear', 'vehicleModel', 'vehicleAmount', 'btn-next-vehicle'];

    allFormElements.forEach((el) => {
        DOMById(el).disabled = false;
        DOMById(el).style.border = '1px solid green';
    });

    // Mostrar última etapa y deshabilitar las anteriores
    DOMById('btn-collapseClient').disabled = true;
    DOMById('btn-collapseVehicle').disabled = true;
    DOMById('btn-collapsePayment').disabled = true;
    DOMById('btn-collapseQuotation').disabled = false;

    // Mostrar cotización
    renderQuotation(quotationData,quotationData.coverages);
    showStep('collapseQuotation');
}

function handleStorage(quotationData){
    // comprobar si la cotización es nueva
    // si lo es, guardar en historial
    // si no lo es y no está editando, actualizar el historial con el id actual
    const newQuotation = getFromSession('newQuotation');
    const isEditing = getFromSession('isEditing');
    if(newQuotation) {
        // Guardarla en session y actualizar id activa
        let activeId = getNewStorageId(); // Obtener nueva id
        setToSession('activeId',activeId);
        storeQuotation({id: activeId,...quotationData});
        setToSession('newQuotation',false) // Va a ser falso hasta que el usuario cree una nueva
    } else {
        if(isEditing) {
            // Si está editandola es porque estaba guardada en local
            // Guardarla actualizada en local
            updateSavedList(quotationData);
        } else {
            // Si no significa que la tomó desde el historial
            // Guardarla actualizada en el historial
            updateHistoryList(quotationData);
        }
    }
}

// falta agregar opcion en el formulario para elegir coberturas
function quoteAndShow(paymentType) {
    const clientName = cleanClientName(document.getElementById('clientName').value);
    const clientAge = Number(document.getElementById('clientAge').value);
    const vehicleBrand = document.getElementById('vehicleBrand').value;
    const vehicleYear = Number(document.getElementById('vehicleYear').value);
    const vehicleModel = document.getElementById('vehicleModel').value;
    const vehicleAmount = Number(document.getElementById('vehicleAmount').value);
    const vehicleAdjustment = Number(document.getElementById('vehicleAdjustment').value);
    const commercialUse = document.getElementById('vehicleUsage').value == '1' ? false:true;
    const isGNC = document.getElementById('vehicleGNC').checked;

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

    const clientVehicle = new Car(vehicleBrand, vehicleModel, vehicleYear, vehicleAmount, vehicleAdjustment, commercialUse,isGNC);
    const clientData = new Person(clientName, clientAge);
    const clientCoverages = [PRODUCT_RC,PRODUCT_TC, PRODUCT_TR];
    const quotation = new Quotation(clientData, clientVehicle, clientCoverages, paymentType);
    const coverages = quotation.quote();

    // Guardar la cotización
    let {product, ...quotationData} = quotation;
    quotationData = {...quotationData,coverages};
    handleStorage(quotationData);

    // Mostrar cotización
    renderQuotation(quotation,coverages);
}

function renderQuotation(quotation, coverages) {
    let htmlQuotationData = `
        <div class="col-4 border rounded-start m-1 p-3">
            <p class="m-0"><span class="fw-bold">Marca:</span> ${quotation.car.brand}</p>
            <p class="m-0"><span class="fw-bold">Modelo:</span> ${quotation.car.model}</p>
            <p class="m-0"><span class="fw-bold">Año:</span> ${quotation.car.year} </p>
            <p class="m-0"><span class="fw-bold">S.A:</span> $${quotation.car.amount}</p>
        </div>
        <div class="col-4 border rounded-end text-rigth m-1 p-3">
            <p class="m-0"><span class="fw-bold">Combustible adicional:</span>${quotation.car.gnc ? 'GNC':'No'}</p>
            <p class="m-0"><span class="fw-bold">Uso:</span> ${quotation.car.commercialUse ? 'Comercial':'Particular'}</p>
            <p class="m-0"><span class="fw-bold">Ajuste:</span> ${quotation.car.automaticAdjustment*100}%</p>
        </div>
        <div class="col-4 border rounded-end text-rigth m-1 p-3">
            <p class="m-0"><span class="fw-bold">Cliente:</span> ${quotation.person.name}</p>
            <p class="m-0"><span class="fw-bold">Edad:</span> ${quotation.person.age}</p>
            <p class="m-0"><span class="fw-bold">Forma de pago:</span> ${quotation.paymentType.method ==  'Automatic'?'Automático':'Efectivo'}</p>
            <p class="m-0"><span class="fw-bold">Cuotas:</span> ${quotation.paymentType.installments == 6?'6 Cuotas':'1 cuota'}</p>
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

    // habilitar y mostrar etapa de cotización
    document.getElementById('btn-collapsePayment').disabled = true;
    showStep('collapseQuotation');
    document.getElementById('quotation-data').innerHTML = htmlQuotationData;
    document.getElementById('quotation-list').innerHTML = htmlProductList;
}

if(getFromSession('newQuotation') === null){
    // Establecer newQuotation true porque se inicia una nueva cotización
    // De esta forma la nueva va a quedar almacenada en el historial (sessionStorage)
    setToSession('newQuotation',true);
}
if(getFromSession('isEditing') === null){
    // Establecer isEditing false, si fuera true significa que se cargó desde las guardadas
    setToSession('isEditing', false);
}
// Si no hay una cotización activa
if(getFromSession('activeId') === null){
    // Id de la cotización activa
    setToSession('activeId',0);
}
// Recuperar historial de la sesión
renderHistoryList();
// Recuperar el historial guardado
renderSavedList();
// Recuperar ultima cotización
restoreLastQutation();