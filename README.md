# ![js](https://raw.githubusercontent.com/FacuMasino/cursoJavaScript-ch/main/img/js.png) Proyecto final - Curso JavaScript
## Simulador Interactivo
### Cotizador de seguros para autos
> Para el proyecto final se eligió hacer un cotizador de seguros para autos, simulando los cálculos que se harían para estimar el costo de la cobertura elegida, recargos según el tipo de riesgo, impuestos y descuentos según corresponda.

#### Entrega Final
*Cambios aplicados:*
- Se realizaron algunas correcciones en el HTML y se agregó un footer.
- Se agregó un logo y favicon
- Metatags y OG Tags agregadas
- Correcciones menores

#### Incorporar Fetch - Clase 15
*Consigna:*
- Consumir una API que ofrezca recursor relevantes para tu APP o crear un archivo .JSON y cargar los datos usando fetch y una ruta relativa.

##### Cambios aplicados:
- Utilizando Firebase se creó una mini base de datos que simula ser un ENDPOINT con acceso a los datos dentro de un archivo JSON que fue subido a la misma.
- A través de Fetch se accede a los datos de Firebase para poder cargar las marcas y modelos de los vehículos.
- Se creó una clase en JS (customSelect.js) que simula un elemento \<select> y permite escribir dentro para buscar las marcas y modelos de vehículos, de esta forma se facilita al usuario encontrar las mismas ya que con un select convencional debería hacer scroll hasta econtrar la correcta.
- Se agregó un delay de 1s en la función de cotizar para mostrar una animación simple que simula la carga de los datos.
- Se agregó un delay de 1.2s en la función fillYearSelect() para hacer uso de una promesa y simular la carga de datos.
- El tamaño de la imagen del header se redujo un 70%.

#### Incorporando librerías - Clase 13
*Consigna:*
- Incorporar una librería de manera coherente, cuya aplicación se torne significativa para tu
  proyecto.
- Justificar elección

##### Cambios aplicados:
- Se incorporó la libreria Toastify para poder notificar al usuario el resultado de sus acciones en la página, por ejemplo al guardar una cotización para que no haga click repetidas veces o al eliminar una cotización del historial.
- Estilos y clases de Toastify modificadas para adaptarse a los colores de la página y mejorar la posición del botón cerrar
- Mejoras generales:
  - Se dividió el código en diferentes archivos para mejorar la legibilidad
  - Nueva función para eliminar del historial las cotizaciones
  - Se agregaron checkboxes para poder seleccionar la cobertura a cotizar
  - Se agregó a la clase "Product" la propiedad "description" para mostrar información extra sobre las coberturas
  - La página ahora es Responsive y se adapta bien en mobile

#### Operadores avanzados - Clase 12
*Consigna:*
- Incluir operadores avanzados: Ternario, AND u OR
 - Optimizar asignacion condicional de variables
 - Aplicar desestructuración para recuperar propiedades de objetos con claridad y rapidez
 - Usar el operador spread para replicar objetos o arrays, también para mejorar la lógica de las funciones.

##### Cambios aplicados:
- Se redujo la función getNewStorageId a la mitad de líneas usando operadores ternarios y arrow functions
- Operadores OR aplicados en la función storeQuotation()
- Se simplificó renderSavedList y renderHistoryList a 1 sola función, renderQuotationsList() aplicando if ternarios en las asignaciones de variables
- Se simplificó updateSavedList() y updateHistoryList() a 1 sola función, updateQuotationsList() aplicando if ternarios en las asignaciones de variables
- Se corrigió un error que ocurría al actualizar una cotización ya guardada en el que en vez de actualizar el html de la cotización editada, solo eliminaba el ultimo elemento de la lista y volvía a agregar el mismo. Esto ocurría en la función renderQuotationsList(), para solucionarlo se agregó el atributo "data-quotation-id" en cada elemento de la lista para identificar cuál se debe actualizar.
- Spread utilizado en las funciones updateQuotationsList() y handleStorage()
- Desestructuración utilizada en la función quoteAndShow() para eliminar la propiedad "product" al pasar la variable quotationData a handleStorage()

#### Segunda entrega del proyecto final
*Consigna:*
- Agregar y entregar uso de JSON y Storage, DOM y eventos de usuario.

##### Cambios aplicados:
- Se agregó un historial de cotizaciones recientes y cotizaciones guardadas por el usuario con las siguientes funcionalidades:
  - El usuario puede guardar las cotizaciones en localStorage
  - Al volver a cargar la página se carga desde sessionStorage la última cotización que realizó el usuario
  - Desde el historial de cotizaciones el usuario puede volver a cargar cotizaciones guardadas o del historial
- Se agregó el botón Nueva cotización
- Se agregó una función para "limpiar" el nombre del cliente en caso de que lo ingrese dE EsTa FoRma

#### Desafío: Incorporar eventos - Clase 9
*Consigna:*
- Agregar manejo de eventos

#### Desafío Complementario - Clase 8 DOM
*Consigna:*
- Crear elementos manipulando el DOM a partir de la información de tus objetos
- Modificar etiquetas existentes en funcion del resultado de operaciones.

#### Cambios aplicados:
- El resultado de la cotización ya no se muestra por consola, ahora lo hace en el documento HTML generando el código desde JavaScript dinámicamente en base a la información introducida por el usuario y las coberturas elegidas.
- 1 validación agregada en la función getVehicle() para evitar que el usuario pueda ingresar un numero mayor a 3.

#### Primer entrega del proyecto final
*Consigna:*
- El estudiante deberá codificar la funcionalidad inicial del simulador. Identificando el flujo de trabajo en el script en términos de captura de entradas ingresadas por el usuario, procesamiento esencial del simulador y notificación de resultados en forma de salida.

##### Cambios aplicados:
- Se agregaron funciones para pedir datos al usuario y validar que la entrada sea correcta
- Según los datos ingresados por el usuario y las características de la persona, se muestra en consola el resultado de la cotización

#### Desafío complementario - Clase 6	
*Consigna:*
- Incorporar arrays
- Utilizar algunos de los métodos o propiedades vistos en la clase.

##### Cambios aplicados:
- Las coberturas y sus propiedades ahora están dentro del array de objetos "productos" (línea 1-18)
- Se reemplazó el switch utilizando el método ForEach para el cálculo de cada cotización aprovechando que productos ahora es un array de objetos (línea 50-60)
- Se agregó otra cobertura, ahora agregar coberturas es más sencillo ya que solo hay que incorporarla dentro de "productos"
- Correcciones en la función policyPrime(), el costo de producción es fijo al igual que el costo de responsabilidad civil que no se ve afectado por la suma asegurada del vehículo.

#### Consignas para la estructura inicial:
- Incorporar algoritmo condicional y con ciclos
- Utilizar funciones
- Utilizar variables y constantes
- Utilizar Clases y Objetos
- Incluir una estructura HTML