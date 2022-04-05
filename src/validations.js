//---------------VALIDACIONES---------------//
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
    let invalids = 0;
    fields.forEach(field => {
        if(!isValid(field)) {
            validateFieldEnableNext(false, document.getElementById(field));
            invalids += 1;
        }
    })
    if(invalids > 0) return false;
    if(!validateCoverages()) return false;
    return true;
}

function validateCoverages() {
    const checkboxes = ['checkRC', 'checkTC', 'checkTR'];
    let selectedCount = 0;
    checkboxes.forEach((check) => {
        if(document.getElementById(check).checked){
            selectedCount += 1;
        }
    })
    if(selectedCount > 0) {
        document.getElementById('btn-next-vehicle').disabled = false;
        return true;
    }
    Toastify({
        text: 'Debes seleccionar al menos 1 cobertura',
        close: true,
        className: 'toast-danger',
        duration: 3000
    }).showToast();
    document.getElementById('btn-next-vehicle').disabled = true;
    return false;
}

function enableCoverages(isValid) {
    const checkboxes = ['checkRC', 'checkTC', 'checkTR'];
    checkboxes.forEach((check) => document.getElementById(check).disabled = !isValid)
}

function resetCoverages() {
    const checkboxes = ['checkRC', 'checkTC', 'checkTR'];
    checkboxes.forEach((check) => document.getElementById(check).checked = false);
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

// Eventos en escucha para validaciones

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
vehicleAmountEvents.addEventListener('input', () => {
    let isvalid = isValid('vehicleAmount');
    validateFieldEnableNext(isvalid, vehicleAmountEvents);
    enableCoverages(isvalid);
});

const checkRC = document.getElementById('checkRC');
checkRC.addEventListener('change',() => validateCoverages());

const checkTC = document.getElementById('checkTC');
checkTC.addEventListener('change',() => validateCoverages());

const checkTR = document.getElementById('checkTR');
checkTR.addEventListener('change',() => validateCoverages());