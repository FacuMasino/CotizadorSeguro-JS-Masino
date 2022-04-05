// Definición de formas de pago
const paymentCash = new PaymentType('Cash',6,0);
const paymentBiannual = new PaymentType('Biannual',1,-0.15);
const paymentAuto = new PaymentType('Automatic',6,-0.05);

// Definición de Coberturas
const PRODUCT_RC = new Product('RC', 'Responsabilidad Civil','Cobertura básica, no incluye asistencia', 0);
const PRODUCT_TC = new Product('TC', 'Tercero Completo', 'Destrucción total/parcial por robo/incendio', 0.0055);
const PRODUCT_TR = new Product('TR', 'Todo Riesgo', 'Todo riesgo con franquicia del 1% sobre suma asegurada', 0.017);

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
        if(quotations) {
            const indexOfActiveId =  quotations.indexOf(quotations.find((q)=> q.id == activeId));
            loadQuotation(quotations[indexOfActiveId], isEditing);
            enableActiveItem(activeId, isEditing);
        }
    }
}

function createNewQuotation() {
    // Deshabilitar item activo
    disableActiveItem();
    // Prepara storage para crear una nueva cotización
    setToSession('newQuotation', true);
    setToSession('isEditing',false);
    setToSession('activeId', null);
    
    const DOMById = (elId) => document.getElementById(elId);

    // Resetear todos los campos
    const allFormElements = ['clientName','clientAge', 
    'vehicleBrand', 'vehicleYear', 'vehicleModel', 'vehicleAmount'];

    allFormElements.forEach((el) => {
        DOMById(el).disabled = true;
        DOMById(el).value = '';
        DOMById(el).style.border = '1px solid #ced4da'; // default bootstrap style
    });

    DOMById('vehicleAdjustment').selectedIndex = 0
    DOMById('vehicleUsage').selectedIndex = 0;
    DOMById('vehicleGNC').checked = false;

    // Resetear checkboxes coberturas
    resetCoverages();

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

// llenar los campos con la información de la cotización
// y renderizar la cotización
function loadQuotation(quotationData, isLocal){
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

    // Reset checkboxes Coberturas
    resetCoverages();
    enableCoverages(true);

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
    quotationData.coverages.forEach((product) => {
        switch(product.coverageCode){
            case 'RC':
                DOMById('checkRC').checked = true;
                break;
            case 'TC':
                DOMById('checkTC').checked = true;
                break;
            case 'TR':
                DOMById('checkTR').checked = true;
                break;
        }
    })

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

    Toastify({
        text: "Cotización recuperada desde " + (isLocal ? 'las guardadas':'el historial'),
        close: true,
        className: 'toast-info',
        duration: 3000
    }).showToast();
}

function btnLoadQuotation(id,isLocal){
    // eliminar atributo 'active' del item activo
    disableActiveItem();
    // agregar atributo 'active' al item seleccionado
    enableActiveItem(id, isLocal);
    // cambiar id activa por la de la cotización seleccionada
    setToSession('activeId', Number(id));
    const quotation = isLocal ? getFromLocal('quotations') : getFromSession('quotations');
    const indexOfActiveId =  quotation.indexOf(quotation.find((q)=> q.id == id));
    if(isLocal) {
        setToSession('isEditing', true);
        setToSession('newQuotation', false);
        loadQuotation(quotation[indexOfActiveId], isLocal);
    } else {
        setToSession('isEditing',false);
        setToSession('newQuotation', false)
        loadQuotation(quotation[indexOfActiveId], isLocal);
    }
    // Ocultar historial
    document.getElementById('btn-offcanvasHistory').click();
}

function btnDeleteQuotation(id, isLocal) {
    const listTarget = isLocal ? 'offcanvas-saved-list':'offcanvas-history-list';
    const itemTarget = document.getElementById(listTarget).querySelector(`[data-quotation-id="${id}"]`);
    if(itemTarget.classList.contains('active')) {
        Toastify({
            text: 'No se puede eliminar una cotización activa!',
            close: true,
            className: 'toast-danger',
            duration: 3000
        }).showToast();
    } else {
        const quotations = isLocal ? getFromLocal('quotations') : getFromSession('quotations');
        const updateStorage = isLocal ? (data)=> setToLocal('quotations',data):(data)=>setToSession('quotations',data);
        quotations.splice(quotations.indexOf(quotations.find((item) => item.id == id)),1);
        updateStorage(quotations);
        itemTarget.remove();
        if(quotations.length == 0) {
            const textElement = document.createElement('p');
            textElement.innerText = 'No hay cotizaciones recientes';
            document.getElementById(listTarget).appendChild(textElement);
        }
        Toastify({
            text: 'Cotización eliminada exitosamente!',
            close: true,
            className: 'toast-success',
            duration: 3000
        }).showToast();
    }
}

function disableActiveItem() {
    const activeId = getFromSession('activeId');
    const isEditing = getFromSession('isEditing');
    if(activeId != null) {
        const listTarget = isEditing ? 'offcanvas-saved-list':'offcanvas-history-list';
        const itemTarget = document.getElementById(listTarget).querySelector(`[data-quotation-id="${activeId}"]`);
        itemTarget.classList.remove('active');
    }
}

function enableActiveItem(id, isLocal) {
    const listTarget = isLocal ? 'offcanvas-saved-list':'offcanvas-history-list';
    const itemTarget = document.getElementById(listTarget).querySelector(`[data-quotation-id="${id}"]`);
    itemTarget.classList.add('active');
}

// Cotizar y mostrar resultado
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

    const selectedCoverages = [];

    if(document.getElementById('checkRC').checked) selectedCoverages.push(PRODUCT_RC);
    if(document.getElementById('checkTC').checked) selectedCoverages.push(PRODUCT_TC);
    if(document.getElementById('checkTR').checked) selectedCoverages.push(PRODUCT_TR);

    const clientVehicle = new Car(vehicleBrand, vehicleModel, vehicleYear, vehicleAmount, vehicleAdjustment, commercialUse,isGNC);
    const clientData = new Person(clientName, clientAge);
    const clientCoverages = selectedCoverages;
    const quotation = new Quotation(clientData, clientVehicle, clientCoverages, paymentType);
    const coverages = quotation.quote();

    // Guardar la cotización
    let {product, ...quotationData} = quotation;
    quotationData = {...quotationData,coverages};
    handleStorage(quotationData);

    // Mostrar cotización
    renderQuotation(quotation,coverages);

    Toastify({
        text: 'Cotización exitosa!',
        close: true,
        className: 'toast-success',
        duration: 3000
    }).showToast();

}

// Comprobación de cotizaciones anteriores al cargar la página
if(getFromSession('newQuotation') === null){
    // Establecer newQuotation true porque se inicia una nueva cotización
    // De esta forma la nueva va a quedar almacenada en el historial (sessionStorage)
    setToSession('newQuotation',true);
}
if(getFromSession('isEditing') === null){
    // Establecer isEditing false, si fuera true significa que se cargó desde las guardadas
    setToSession('isEditing', false);
}
// Recuperar historial de la sesión
renderQuotationsList(false,false);
// Recuperar el historial guardado
renderQuotationsList(false,true);
// Recuperar ultima cotización
restoreLastQutation();