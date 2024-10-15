const redis = require('redis');
   
   // Crear cliente de Redis
   const redisClient = redis.createClient({
       url: process.env.REDIS_URL || 'redis://localhost:6379'
   });
   
   // Verificar conexion a redis
   redisClient.connect().catch(err => {
       console.error('Error al conectar con Redis:', err);
   });
   
   redisClient.on('connect', () => {
       console.log('Conectado a Redis');
   });
   
   redisClient.on('error', (err) => {
       console.error('Error al conectar con Redis:', err);
   });

exports.postsales = async (req, res) => {
       const {sucursalId,ventasId} = req.params;
       const {ventaId, productoId, cantidad, costo_unitario,rfc, fecha, hora} = req.body;
       const redisKey = `sucursal:${sucursalId}:ventas:${ventasId} `;
        const newVenta = `VENTA:${ventaId}:PRODUCTO:${productoId}:CANTIDAD:${cantidad}:COSTO_UNITARIO:${costo_unitario}:TOTAL:${cantidad*costo_unitario}:CLIENTE:${rfc}:SUCURSAL:${sucursalId}:FECHA:${fecha}:HORA:${hora}`;
       console.log('Clave:', redisKey,"\n",newVenta);
       
    
           // Usar await para obtener los detalles del producto
           const productDetails = await redisClient.rPush(redisKey,newVenta);
           
           // Retornar los detalles del producto si se encuentra
           return res.status(200).json(req.body);
       
   };
   exports.getAllSales = async (req, res) => {
    try {
        // Definir los IDs de las sucursales
        const sucursalIds = ['1111', '2222', '3333', '4444'];

        // Crear un array de promesas para obtener las ventas de cada sucursal
        const salesPromises = sucursalIds.map(async sucursalId => {
            const ventasKeyPrefix = `sucursal:${sucursalId}:ventas`;
            
            // Obtener las subclaves (listas) de ventas en Redis
            const ventaSubKeys = await redisClient.keys(`${ventasKeyPrefix}:*`);

            // Array para almacenar todas las ventas de la sucursal
            let allSalesForSucursal = [];

            // Obtener las ventas de cada subclave
            for (const subKey of ventaSubKeys) {
                const sales = await redisClient.lRange(subKey, 0, -1);
                allSalesForSucursal = allSalesForSucursal.concat(sales); // Concatenar ventas
            }

            // Retornar el objeto con el ID de la sucursal y las ventas
            return { sucursalId, sales: allSalesForSucursal };
        });

        // Esperar a que se resuelvan todas las promesas
        const allSales = await Promise.all(salesPromises);

        // Enviar el resultado como un objeto JSON
        res.json(allSales);
    } catch (error) {
        console.error('Error retrieving sales:', error);
        return res.status(500).send('Error retrieving sales');
    }
};
