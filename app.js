const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser')


//Rotas
const routeProduct = require('./routes/product')
const routeOrder = require('./routes/order')
const routerUsuario = require('./routes/usuarios')

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false})); // apenas dados simples
app.use(bodyParser.json()); //ACEITAR APENAS JSON de entrada


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin,X-Requested-With, Content-Type,Accept,Authorization',

        );
        if(res.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
            return res.status(200).send({});
        }

        next();
})

app.use('/product',routeProduct);
app.use('/order',routeOrder);
app.use('/usuarios',routerUsuario);

// Quando não encontra rota, entra aqui
app.use((req,res,next)=>{
    const erro = new Error('Não encontrado!!');
    erro.status = 404;
    next(erro);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            message: error.message
        }
    });
});


module.exports = app;