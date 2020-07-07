const mysql = require('../mysql').pool;

exports.getOrderController =  (req, res, next) => {
        mysql.getConnection((error, conn) => {
            if (error) { console.log(error); res.status(500).send({ error: error }) }
            conn.query(
               `SELECT o.id,o.quantity,p.name,p.price
                FROM orders o
                    INNER JOIN products p
                        on p.id = o.id_products;`,
                (error, result, field) => {
                 
                    if (error) { res.status(500).send({ error: error }) }
                    const response = {                   
                        order: result.map(orders =>{
                            return {
                            id : orders.id,                      
                            quantity : orders.quantity,
                            product: {
                                name: orders.name,
                                price: 'R$ '+ orders.price
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://localhost:3000/order'
                            }
                            }
                        })
                    }
                    return res.status(200).send(response)
                }
            )
        });
};


exports.insertOrders = (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO orders (id_products,quantity) VALUES (?,?)',
            [req.body.id_products, req.body.quantity],
            (error,result,field)=>{
             if(error){res.status(500).send({error: error})}           
                conn.release();
                const response = {
                    mensage: 'Pedido inserido com sucesso!',                  
                    id_product: req.body.id_products,
                    quantity: req.body.quantity,
                    request: {
                        tipo: 'POST',
                        descricao: '',
                        url: 'http://localhost:3000/order' 
                    }
                }
                res.status(201).send(response);
            }
        )
    });
 };


 exports.getOneOrder = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.log(error); res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM orders where id = ?',
            [req.params.id_order],
            (error, result, field) => {
                conn.release();
                if (error) { res.status(500).send({ error: error }) }
                if(result == 0){
                    return res.status(404).send({message: 'Não foi encontra um produto com esse ID'})
                }
                const response = {
                    produto: {
                        id: result[0].id,
                        quantity: result[0].quantity,                      
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/orders'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
};

exports.updateOrder = (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){res.status(500).send({error: error})}
        conn.query(
            'UPDATE orders SET quantity = ? where id = ?',
            [req.body.quantity, req.body.id],
             (error,result,field)=>{
                 if(error){res.status(500).send({error: error})}
                 conn.release();
                 const response = {
                     id: req.body.id,
                     quantity: req.body.quantity,
                     request: {
                         tipo: 'POST',
                         descricao: '',
                         url: 'http://localhost:300/orders/' + req.body.id
                     }
                 }
             }
        );
    });
 };


 exports.deleteOrder = (req,res,next)=>{
    mysql.getConnection((error,conn)=>{
        if(error){res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM orders WHERE id = ?',
            [req.body.id],
            (error,result,field)=>{
                if(error){res.status(500).send({error: error})}
                conn.release();
                const response = {
                    message: 'Removido com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: '',
                        url: 'http://localhost:3000/order'
                    }
                }
 
            }
        )
    })
 };