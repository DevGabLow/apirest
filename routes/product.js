const express = require('express')
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login')
const productController = require('../controllers/productController')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
/*
const filter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
    cb(null,true);
    }else{
    cb(null,false);
    }

}*/
const upload = multer({storage});

//RETORNA TODOS OS PRODUTOS
router.get('/',productController.getProducts);

//INSERE UM PRODUTO
router.post('/',login.obrigatorio ,upload.single('product_image'), productController.insertProduct);

//RETORNA UM DADO DE UM PRODUTO
router.get('/:id_product', productController.getOneProduct)

//ALTERA UM PRODUTO
router.patch('/',login.obrigatorio,productController.updateProduct);

//DELETA UM PRODUTO
router.delete('/',login.obrigatorio, productController.deleteProduct)

module.exports = router;