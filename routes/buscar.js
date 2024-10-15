const express = require('express');
   const router = express.Router();
   const buscarController = require('../controllers/buscarController');
   
   // Ruta para añadir un nuevo cliente
   router.get('/:sucursal/:latitud/:longitud/:rango/:unidad', buscarController.getbuscar);

   module.exports = router;