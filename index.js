    const app = require('./app');

    // Ruta principal
    app.get('/', (req, res) => {
       res.send('API con Node.js, Express y Redis');
    });

    // Iniciar el servidor
    const PORT = process.env.PORT || 3000;
   app.listen(PORT,() => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
    