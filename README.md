# DOCUMENTACION DE LA API  
## Bases de Datos NoSQL
> [!NOTE]
> **Alumno:** José Lino Díaz Canales `@joselino25`  
> **Grupo:** 5A (7:00-8:00)  
> **Docente:** Jorge Saúl Montes Cáceres  

**1. Considere el caso de una empresa mayorista de materiales de construcción. Todas las ventas que hace una sucursal implica la emisión de una factura. A la empresa le interesan los siguientes aspectos:**

## Prerequisitos de las APIS:
**1.1 Desargar el archivo txt llamado datos.txt**

**1.2. Descargar desde DockerHub la imagen de la APIS con el siguiente comando:**
```
docker pull joselino25/01_redis_api_app
```
**1.3 Inicializar un docker Compose en que incluya un contenedor api y otro contenedor que contenga la base de datos noSQL en este caso redis**

**1.4 Iniciar el docker-compose**

**1.5 Utilizar los datos del archivo .txt que se encuentra en el proyecto**

**1.6 Utilizar el navegador de su preferencia y escribir localhost:3000 y tendra que salir el siguiente mensaje:**
```
  API con Node.js, Express y Redis
```

## Q1: Obtener los detalles de un producto dado su ID

El modelado con HASH para los productos es conveniente porque permite almacenar múltiples atributos (nombre, precio, categoría, etc.) de un producto y recuperarlos eficientemente con `HGETALL` o atributos específicos con `HGET`.

```redis
HGETALL producto:1001:sucursal:1111
```

Ruta en Postman
```
/GET http://localhost:3000/producto/1001/sucursal/2222
```


**Método HTTP: GET** Indica el tipo de operación que se va a realizar en el servidor. En este caso, es una solicitud para obtener información del servidor.

**localhost:** Se refiere a la máquina local (es decir, el servidor que está ejecutando en el mismo equipo desde donde se hace la solicitud).

**/3000** Es el puerto en el que la aplicación del servidor está escuchando. 

*nota: Estos datos se repiten para las demas querys.*

**/producto** Esto indica que se está solicitando información relacionada con productos. Generalmente, este segmento define una colección o entidad.

**/1001** es un parámetro dinámico que representa el ID del producto que se está consultando.

**/2222** es otro parámetro dinámico que representa el ID de la sucursal. 
Esto nos  indica que se está solicitando información relacionada con la sucursal 2222 en el contexto del producto 1001 por lo cual al momento de ejecutar el meteodo get nos debe aparecer un JSON con la informacion obtenida de la consulta.


## Q2: Añadir un nuevo cliente al conjunto de clientes de una sucursal y verificar que no exista previamente

El modelado con SET para los clientes de cada sucursal es adecuado ya que garantiza la unicidad de los valores y permite agregar o verificar la existencia de un cliente de manera eficiente.

```redis
SISMEMBER sucursal:1111:clientes "cliente:RFC23456:nombre:'Luis Fernandez'"
SADD sucursal:1111:clientes "cliente:RFC23456:nombre:'Luis Fernandez'"
SADD sucursal:2222:clientes "cliente:RFC11223:nombre:'Carlos Ramirez'"
SADD sucursal:4444:clientes "cliente:RFC12345:nombre:'Juan Perez'"
```

Ruta en Postman
```
/POST http://localhost:3000/clients/add
```

**Método HTTP: POST** Indica que se está realizando una solicitud para enviar datos al servidor.

**/clients** Indica que el recurso al que se está accediendo o afectando es clientes. Este segmento identifica la colección de clientes dentro de la API.

**/add** La acción add especifica que se está solicitando la operación de agregar un nuevo cliente. 


## Q3: Registrar una nueva venta para un cliente en específico

El uso de LIST permite registrar múltiples productos dentro de una venta, y la estructura `RPUSH` facilita agregar nuevas ventas de manera secuencial y cronológica.

```redis
RPUSH sucursal:1111:ventas:2024 "VENTA:20001:PRODUCTO:1003:CANTIDAD:4:COSTO_UNITARIO:60:TOTAL:240:CLIENTE:RFC23456:SUCURSAL:1111:FECHA:20240925:HORA:123500"
```

Ruta en Postman
```
/POST http://localhost:3000/ventas/2001/sucursal/2222
```

**Método HTTP: POST** El método POST se utiliza comúnmente para enviar datos al servidor con el propósito de crear o actualizar un recurso.

**/ventas/2001** Indica que estás trabajando con la entidad "ventas" y, más específicamente, con la venta que tiene el identificador 2001. Este identificador podría ser único para la venta que estás registrando o agrupando ventas bajo el mismo ID.

**/sucursal/2222** Especifica que la venta pertenece a la sucursal con el identificador 2222.


## Q4: Buscar sucursales cercanas a una ubicación geográfica específica usando consultas geoespaciales

El uso de GEO es altamente eficiente para realizar búsquedas geoespaciales y permite localizar sucursales cercanas a una ubicación específica.

```redis
GEORADIUS sucursales_geopos -104.8946 21.5107 10 km WITHDIST
```

Ruta en Postman
```
/GET http://localhost:3000/buscar/sucursales_geopos/-104.8946/21.5107/100/km
```

**Método HTTP** GET: Este método se utiliza para recuperar datos, en este caso, las sucursales cercanas a las coordenadas especificadas.

**/buscar/sucursales_geopos** Es el punto de acceso donde se realiza la búsqueda geoespacial. El término sucursales_geopos es el nombre del conjunto geoespacial en Redis que contiene las coordenadas de las sucursales.

**/-104.8946/21.5107** Estas son las coordenadas geográficas (longitud y latitud, respectivamente) que se utilizarán como punto central para buscar sucursales cercanas.

**/100/km** El valor 100 indica el radio de búsqueda (en este caso, 100 kilómetros), y km es la unidad que especifica que la distancia se mide en kilómetros.


## Q5: Obtener el conjunto de clientes que han comprado en una sucursal específica

```redis
SMEMBERS sucursal:1111:clientes
```

Ruta en Postman
```
/GET http://localhost:3000/sucursal/clientes/1111
```

**Método HTTP** GET: Este método se utiliza para recuperar datos, en este caso, todos los clientes que están asociados con una sucursal específica.

**/sucursal/clientes/1111** La parte 1111 de la URL es el ID de la sucursal. Esto significa que el endpoint buscará los clientes que están vinculados con la sucursal con este identificador.

## Q6: Registro histórico de los clientes que han hecho compras en cada sucursal

```redis
SMEMBERS sucursal:1111:clientes
SMEMBERS sucursal:2222:clientes
SMEMBERS sucursal:3333:clientes
SMEMBERS sucursal:4444:clientes
```
Ruta en Postman
```
/GET http://localhost:3000/sucursal/sucursales/clientes/historico
```

**Método HTTP: GET** Este método se utiliza para recuperar datos, en este caso, el historial de todos los clientes de múltiples sucursales.

**/sucursal/sucursales/clientes/historico** La parte historico de la URL indica que el endpoint está destinado a devolver un historial, en este caso, el conjunto de todos los clientes de las diferentes sucursales.
