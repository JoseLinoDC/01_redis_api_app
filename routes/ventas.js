const express = require('express');
   const router = express.Router();
   const ventasController = require('../controllers/ventasController');
   
   // Ruta para añadir una nueva venta
   router.post('/:ventasId/sucursal/:sucursalId',ventasController.postsales);
   router.get('/todas', ventasController.getAllSales);

   module.exports = router;