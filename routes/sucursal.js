const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');

router.get('/clientes/:sucursalId', sucursalController.getclients);
router.get('/sucursales/clientes/historico', sucursalController.getHistoricalClients);

module.exports = router;