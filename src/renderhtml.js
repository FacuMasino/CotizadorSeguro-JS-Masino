// Obtener historial de coberturas recientes
const getHistoryList = () => getFromSession('quotations') || false;
const getSavedList = () => getFromLocal('quotations') || false;

// Generar lista en el historial
function renderQuotationsList(isUpdating,isLocal) {
    // preguntar de donde obtenerlas, sesion o local
    let quotations = isLocal ? getSavedList():getHistoryList();
    const elementTarget = isLocal ? 'offcanvas-saved-list':'offcanvas-history-list';
    const activeId = getFromSession('activeId');
    // si hay guardadas, renderizarlas en el historial
    if(quotations && quotations.length > 0) {
        let quotationsHTML = '';
        // Si isUpdating es true, significa que solo hay que renderizar 1 cotización
        // Para evitar renderizar todo de nuevo, se selecciona y actualizar solo la seleccionada (activeId)
        // El atributo data-quotation-id debe coincidir con "activeId"
        if(isUpdating){
            quotations = quotations.find((item) => item.id == activeId);
            quotationsHTML = `
                <div class="my-1 me-auto">
                    <div class="fw-bold">${quotations.person.name}</div>
                    <div>${quotations.car.brand} ${quotations.car.model} ${quotations.car.year}</div>
                </div>
                <div class="my-1 align-self-stretch d-flex flex-column justify-content-between align-items-end">
                    <div>
                        <span role="button" class="mb-1 badge bg-primary rounded-pill" onclick="btnLoadQuotation(${quotations.id},${isLocal})"><i class="far fa-edit"></i></span>
                        <span role="button" class="mb-1 badge bg-primary rounded-pill" onclick="btnDeleteQuotation(${quotations.id},${isLocal})"><i class="far fa-trash-alt"></i></span>        
                    </div>
                    <span class="badge bg-secondary rounded-pill">
                    ${quotations.paymentType.method ==  'Automatic'?'Automático':'Efectivo'} -
                    ${quotations.paymentType.installments == 6?'6 Cuotas':'1 cuota'}
                </span>
            `;
            // Seleccionar la lista correspondiente
            const listElement = document.getElementById(elementTarget);
            // Seleccionar el item que coincida con el id y actualizarlo
            listElement.querySelector(`[data-quotation-id="${quotations.id}"]`).innerHTML = quotationsHTML;
        } else {
            quotations.forEach((item) => {
                quotationsHTML += `
                    <li data-quotation-id="${item.id}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                        <div class="my-1 me-auto">
                            <div class="fw-bold">${item.person.name}</div>
                            <div>${item.car.brand} ${item.car.model} ${item.car.year}</div>
                        </div>
                        <div class="my-1 align-self-stretch d-flex flex-column justify-content-between align-items-end">
                            <div>
                                <span role="button" class="mb-1 badge bg-primary rounded-pill" onclick="btnLoadQuotation(${item.id},${isLocal})"><i class="far fa-edit"></i></span>
                                <span role="button" class="mb-1 badge bg-primary rounded-pill" onclick="btnDeleteQuotation(${item.id},${isLocal})"><i class="far fa-trash-alt"></i></span>    
                            </div>
                            <span class="badge bg-secondary rounded-pill">
                            ${item.paymentType.method ==  'Automatic'?'Automático':'Efectivo'} -
                            ${item.paymentType.installments == 6?'6 Cuotas':'1 cuota'}
                        </span>
                    </li>
                `;
            });
            document.getElementById(elementTarget).innerHTML = quotationsHTML;
        }
    } else {
        const listElement = document.getElementById(elementTarget);
        const textElement = document.createElement('p');
        textElement.innerText = 'No hay cotizaciones recientes';
        listElement.appendChild(textElement);
    }
}

// Mostrar resultado de la cotización
function renderQuotation(quotation, coverages) {
    let htmlQuotationData = `
        <div class="col-sm-4 col-12 border rounded-start m-1 p-3">
            <p class="m-0"><span class="fw-bold">Marca:</span> ${quotation.car.brand}</p>
            <p class="m-0"><span class="fw-bold">Modelo:</span> ${quotation.car.model}</p>
            <p class="m-0"><span class="fw-bold">Año:</span> ${quotation.car.year} </p>
            <p class="m-0"><span class="fw-bold">S.A:</span> $${quotation.car.amount}</p>
        </div>
        <div class="col-sm-4 col-12 border rounded-end text-rigth m-1 p-3">
            <p class="m-0"><span class="fw-bold">Combustible adicional:</span>${quotation.car.gnc ? 'GNC':'No'}</p>
            <p class="m-0"><span class="fw-bold">Uso:</span> ${quotation.car.commercialUse ? 'Comercial':'Particular'}</p>
            <p class="m-0"><span class="fw-bold">Ajuste:</span> ${quotation.car.automaticAdjustment*100}%</p>
        </div>
        <div class="col-sm-4 col-12 border rounded-end text-rigth m-1 p-3">
            <p class="m-0"><span class="fw-bold">Cliente:</span> ${quotation.person.name}</p>
            <p class="m-0"><span class="fw-bold">Edad:</span> ${quotation.person.age}</p>
            <p class="m-0"><span class="fw-bold">Forma de pago:</span> ${quotation.paymentType.method ==  'Automatic'?'Automático':'Efectivo'}</p>
            <p class="m-0"><span class="fw-bold">Cuotas:</span> ${quotation.paymentType.installments == 6?'6 Cuotas':'1 cuota'}</p>
        </div>
    `;

    let htmlProductList = "";
    coverages.forEach(product => { 
        htmlProductList += `
            <div class="d-flex flex-wrap align-items-center border-top border-bottom border-dark p-2">
                <div class="col-sm-8 col-12">
                    <p class="m-0 fw-bold">${product.coverageCode} - ${product.name}</p>
                    <p class="m-0">${product.description}</p>
                </div>
                <div class="col-sm-4 col-12 text-end">
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