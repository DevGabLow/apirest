const mysql = require('../mysql').pool;

exports.getProducts =  (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) { console.log(error); res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM products ORDER BY name ASC',
            (error, result, field) => {
                conn.release();
                if (error) { res.status(500).send({ error: error }) }
                const response = {
                    quantity: result.length,
                    products: result.map(prod =>{
                        return {
                        id : prod.id,
                        name: prod.name,
                        price : prod.price,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/product'
                        }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
};

exports.insertProduct = (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO products (name,price,image_product) VALUES (?,?,?)',
            [req.body.name, req.body.price,req.file.path],
            (error, result, field) => {
                conn.release();               
                if (error) { console.log(error);res.status(500).send({ error: error }) }
                const response = {
                    mensagem: "Porduto inserido com sucesso!",
                    produtoCriado: {
                        id: result.insertId,
                        name: req.body.name,
                        price: req.body.price,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um novo produto',
                            url: 'http://localhost:3000/product'
                        }

                    }
                }
                return res.status(201).send(response)
            }
        );
    });
};


exports.getOneProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.log(error); res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM products where id = ?',
            [req.params.id_product],
            (error, result, field) => {
                conn.release();
                if (error) { res.status(500).send({ error: error }) }
                if(result == 0){
                    return res.status(404).send({message: 'Não foi encontra um produto com esse ID'})
                }
                const response = {
                    produto: {
                        id: result[0].id,
                        name: result[0].name,
                        price: result[0].price,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/product'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )
    })
};


exports.updateProduct =  (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE products
                SET   name    = ?,
                      price   = ?
                WHERE id    = ?`,
            [req.body.name, req.body.price,req.body.id],
            (error, result, field) => {
                conn.release();
                if (error) { res.status(500).send({ error: error }) }   
                         
                const response = {
                    mensagem: "Porduto atualizado com sucesso!",
                    produtoCriado: {
                        id: req.body.id,
                        name: req.body.name,
                        price: req.body.price,
                        request: {
                            tipo: 'POST',
                            descricao: 'Detalha o produto',
                            url: 'http://localhost:3000/product/' +  req.body.id
                        }

                    }
                }
                return res.status(202).send(response)
            }
        );
    });
};


exports.deleteProduct = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            "DELETE FROM products WHERE id = ?",
            [req.body.id],
            (error, result, field) => {
                conn.release();
                if (error) { res.status(500).send({ error: error }) }
                const response = {
                    message: 'Removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um novo produto',
                        url: 'http://localhost:3000/product',
                        body: {
                            name: 'String',
                            price: 'Number'
                        }
                    }
                }
                res.status(202).send(response)
            }
        );
    });
};