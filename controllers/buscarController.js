const redis = require('redis');

// Crear cliente de Redis
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Verificar conexión a redis
redisClient.connect().catch(err => {
    console.error('Error al conectar con Redis:', err);
});

redisClient.on('connect', () => {
    console.log('Conectado a Redis');
});

redisClient.on('error', (err) => {
    console.error('Error al conectar con Redis:', err);
});


exports.getbuscar = async (req, res) => {
    const { latitud, longitud, rango, unidad } = req.params;

    try {
        // Usar el nombre de la clave 'sucursales_geopos' directamente
        const locations = await redisClient.sendCommand([
            'GEORADIUS',
            'sucursales_geopos', // Nombre de la clave donde se almacenan los datos geoespaciales
            latitud,
            longitud,
            rango,
            unidad,
            'WITHDIST'
        ]);
        
        res.status(202).json(locations); // Devolver los resultados como JSON
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud', error });
    }
};
