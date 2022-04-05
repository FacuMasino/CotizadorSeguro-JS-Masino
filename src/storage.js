//--------------- Storage ---------------//
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
        enableActiveItem(activeId,false);
    } else {
        if(isEditing) {
            // Si está editandola es porque estaba guardada en local
            // Guardarla actualizada en local
            updateQuotationsList(quotationData,true);
        } else {
            // Si no significa que la tomó desde el historial
            // Guardarla actualizada en el historial
            updateQuotationsList(quotationData,false);
        }
    }
}

// Obtener nueva id
function getNewStorageId(isLocal = false) {
    const lastId = isLocal ? parseInt(getFromLocal('lastId')):parseInt(getFromSession('lastId'));
    const setId = isLocal ? (n)=>setToLocal('lastId',n):(n)=>setToSession('lastId',n);
    if(isNaN(lastId)){
        setId(0);
        return 0;
    } else {
        setId(lastId+1);
        return lastId+1;
    }
}

// Guardar cotización y actualizar lista
function storeQuotation(quotation, isLocal = false) {
    if(isLocal){
        let localQuotations = getFromLocal('quotations') || false;
        if(!localQuotations) localQuotations = [];
        localQuotations.push(quotation);
        setToLocal('quotations',localQuotations);
        renderQuotationsList(false, true);
    } else {
        let sessionQuotations = getFromSession('quotations') || false;
        if(!sessionQuotations) sessionQuotations = [];
        sessionQuotations.push(quotation);
        setToSession('quotations',sessionQuotations);
        renderQuotationsList(false, false);
    }
}

// Guarda en local la última cotización realizada por el usuario solo si
// no está editando una guardada
function saveQuotation(){
    const isEditing = getFromSession('isEditing');
    const activeId = getFromSession('activeId');
    if(!isEditing) {
        disableActiveItem();
        let sessionQuotation = getFromSession('quotations');
        const indexOfActiveId = sessionQuotation.indexOf(sessionQuotation.find((q)=>q.id == activeId));
        sessionQuotation = sessionQuotation[indexOfActiveId];
        sessionQuotation.id = getNewStorageId(true);
        storeQuotation(sessionQuotation,true);
        renderQuotationsList(false,true);
        setToSession('activeId',getFromLocal('lastId'))
        enableActiveItem(getFromLocal('lastId'),true);
        // pasa a ser true porque la cotización actual está guardada en local
        // si vuelve a tocar guardar, no debe guardar una nueva
        setToSession('isEditing', true)
        Toastify({
            text: 'Cotización guardada correctamente!',
            close: true,
            className: 'toast-success',
            duration: 3000
        }).showToast();
    } else {
        Toastify({
            text: 'La cotización ya se encuentra guardada! \n Las modificaciones que realices se actualizan automáticamente',
            close: true,
            className: 'toast-danger',
            duration: 3000
        }).showToast();
    }
}

// Obtiene las cotizaciones guardadas en Storage
// y sobre escribe la que tenga el mismo Id que el activo actualmente
function updateQuotationsList(quotationData, isLocal){
    const activeId = getFromSession('activeId');
    const setToStorage = isLocal ? (data) => setToLocal('quotations',data) : (data)=>setToSession('quotations',data);
    let quotations = isLocal ? getFromLocal('quotations') : getFromSession('quotations');
    const indexOfActiveId = quotations.indexOf(quotations.find((q)=> q.id == activeId));
    quotations[indexOfActiveId] = {id:activeId,...quotationData};
    setToStorage(quotations);
    renderQuotationsList(true,isLocal);
}