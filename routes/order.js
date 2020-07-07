const express = require('express')
const router = express.Router();

const login = require('../middleware/login')

const ordersController = require('../controllers/ordersController')

//RETORNA TODOS OS PEDIDOS
router.get('/',ordersController.getOrderController);

//INSERE UM PEDIDO
router.post('/',login.obrigatorio,ordersController.insertOrders);

//RETORNA UM DADO DE UM PEDIDO
router.get('/:id_order', ordersController.getOneOrder);

//ALTERA UM PEDIDO
router.patch('/',login.obrigatorio, ordersController.updateOrder);

//DELETA UM PEDIDO
router.delete('/',login.obrigatorio,ordersController.deleteOrder);

module.exports = router;