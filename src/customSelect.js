class CustomSelect {
	constructor(mainDiv, onClickCallback = '') {
        this.mainDiv = document.getElementById(mainDiv);
		this.inputSelect = document.querySelector(`#${mainDiv} > input`);
		this.divItems = document.querySelector(`#${mainDiv} > .customSelect-items`);
		this.arrow = document.querySelector(`#${mainDiv} > .arrow`);
        this.itemsArray = [];
        this.isReady = false;
		this.onClickCallback = onClickCallback;
		this.addMainEvents();
	}

	addMainEvents() {
        this.divItems.hidden = true;
		this.inputSelect.disabled = true;
        this.inputSelect.addEventListener('click', () => this.showItems());
		this.inputSelect.addEventListener('blur', (event) => this.hideItems(event));
		this.inputSelect.addEventListener('input', () => this.onType());
	}

	createItems(itemsArray) {
		let divsHTML = '';
        this.itemsArray = itemsArray;
		itemsArray.forEach((item) =>{
			divsHTML += `
				<div tabindex="0" class='customSelect-item' data-item-id=${item.key}>${item.name}</div>
			`
		})
		this.divItems.innerHTML = divsHTML;
        const allItems = document.querySelectorAll(`#${this.mainDiv.id} > .customSelect-items > .customSelect-item`);
		allItems.forEach(item=>item.addEventListener('click', (event) => this.onClickItem(event)));
		this.isReady = true;
	} 

	reset() {
		this.inputSelect.value = '';
		this.isReady = false;
		this.itemsArray = [];
		delete this.inputSelect.dataset.selectedItem;
		this.divItems.innerHTML = '';
	}

	loadPreviousData(key, name = ''){
		// Para seleccionar un dato que ya estaba cargado antes
		if(this.itemsArray.length > 0) {
			const foundItem = key != '' ? this.itemsArray.find((item) => item.key == Number(key)):this.itemsArray.find((item) => item.name == name);
			this.inputSelect.value = foundItem.name;
			this.inputSelect.dataset.selectedItem = foundItem.key;
		}
	}

	onType() {
        this.showItems();
    	const typedText = this.inputSelect.value.trim().toLowerCase();
        if(typedText != null) {
		const filteredItems = this.itemsArray.filter((item) => item.name.toLowerCase().includes(typedText));
		this.showOnly(filteredItems);
        }
	}
    
	onClickItem(event) {
		const changeEvent = new Event('change'); // crea evento change
        this.inputSelect.focus();
        this.inputSelect.value = event.target.innerText;
        this.inputSelect.dataset.selectedItem = event.target.dataset.itemId;
		this.inputSelect.dispatchEvent(changeEvent); // simular evento change
        this.hideItems();
		if(typeof(this.onClickCallback) == 'function') {
			const clickedItem = this.itemsArray.find((item)=>item.key == event.target.dataset.itemId);
			this.onClickCallback(clickedItem);
		}
	}

	showOnly(items) {
		this.itemsArray.find((item) => {
			const divElement = this.divItems.querySelector(`[data-item-id="${item.key}"`);
			if(items.some((items) => items.name == item.name)){
				if(divElement) divElement.hidden = false;
			} else {
				if(divElement) divElement.hidden = true;
			}
		})
	}
    
	showItems() {
        if(this.divItems.hidden){
            this.handleArrow(true); //
        }
		this.divItems.hidden = false;
	}

	hideItems(event = null) {
        const itemsFocus = event?.relatedTarget ? String(event.relatedTarget.attributes.class.value.includes('customSelect-items')):false;
        // Si no recibe el foco un item, ocultarlos
        if(!itemsFocus){
            this.divItems.hidden = true;
            this.handleArrow(false);
			// Al perder foco, validar input
			this.validateInput();
        }
	}
    
	validateInput() {
		// validar que haya item seleccionado y coincida con el value del input
		if(this.inputSelect.value != '') {
			// si hay texto pero no se selecciono un item, resetear input
			if(!this.inputSelect.dataset.selectedItem) {
				this.inputSelect.value = '';
				// Por si se ocultaron items al tipear y quedaron ocultos al perder foco el input
				this.showOnly(this.itemsArray); 
			} else {
				// si hay item seleccionado, hacer coincidir value del input
				const selectedItem = this.itemsArray.find((item)=> item.key ==this.inputSelect.dataset.selectedItem)
				this.inputSelect.value = selectedItem.name;
			}
		}
	}

    handleArrow(setUp) {
        const arrowClassList = this.arrow.classList;
        if(setUp){
            if(arrowClassList.contains('arrow-down')) arrowClassList.remove('arrow-down');
            arrowClassList.add('arrow-up');
        } else {
            if(arrowClassList.contains('arrow-up')) arrowClassList.remove('arrow-up');
            arrowClassList.add('arrow-down');
        }
    }
    
    showArrow() {
        if(this.arrow.classList.contains('arrow-hidden')) this.arrow.classList.remove('arrow-hidden');
        this.handleArrow(false);
    }
    
    hideArrow() {
        if(!this.arrow.classList.contains('arrow-hidden')) this.arrow.classList.add('arrow-hidden');
    }
    
    isLoading(show){
        if(show){
            this.inputSelect.disabled = true;
            this.mainDiv.querySelector('.spinner-border').hidden = false;
            this.hideArrow();
        } else {
            this.inputSelect.disabled = false;
            this.mainDiv.querySelector('.spinner-border').hidden = true;
            this.arrow.classList.remove('arrow-hidden');
            this.showArrow();
        }
    }
}

/* const brandsSelect = new CustomSelect('brandSelect');
brandsSelect.isLoading(true);
brandsSelect.createItems([{key:0, name:'Ford'},{key:1,name:'Audi'},{key:2,name:'Fiat'},{key:3,name:'Chevrolet'},{key:4,name:'Volkswagen'}]);
setTimeout(()=>brandsSelect.isLoading(false),4000); */