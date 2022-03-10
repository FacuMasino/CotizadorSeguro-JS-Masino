# ![js](https://raw.githubusercontent.com/FacuMasino/cursoJavaScript-ch/main/img/js.png) Proyecto final - Curso JavaScript
## Simulador Interactivo
### Cotizador de seguros para autos
> Para el proyecto final se eligió hacer un cotizador de seguros para autos, simulando los cálculos que se harían para estimar el costo de la cobertura elegida, recargos según el tipo de riesgo, impuestos y descuentos según corresponda.

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