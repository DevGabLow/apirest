const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.insertUser = (req,res,next)=>{
    mysql.getConnection((error,conn)=>{
        if(error){res.status(500).send({error : error})}
        conn.query(`SELECT * FROM usuarios WHERE email = ? `,[req.body.email], (error,result)=>{
            if(error){res.status(500).send({error : error})}
            if(result.length > 0 ){
                res.status(409).send({messageError: 'Já existe um usuário com este Email!'})
            }else{
                bcrypt.hash(req.body.senha,10,(errorBcrypt,hash)=>{
                    if(errorBcrypt){res.status(500).send({error : errorBcrypt})}
                    conn.query(`INSERT INTO usuarios (email,senha) VALUES (?,?)`,
                    [req.body.email,hash],
                    (error,result)=>{
                        conn.release();
                        if(error){res.status(500).send({error : error})}
                        return res.status(201).send({
                            message: 'Usuário criado com sucesso',
                            usuarioCriado: {
                                id: result.insertId,
                                email: req.body.email
                            }
                        })
                    })
                });
            }
        })   
    });
};


exports.login = (req,res,next)=>{
    mysql.getConnection((error,conn)=>{
        if(error){res.status(500).send({error: error})}
        const query = 'SELECT * FROM usuarios WHERE email = ?;';
        conn.query(
            query,
            [req.body.email],
            (error,results,field)=>{
                conn.release();
                if(error){res.status(500).send({erro: error})}
                if(results.length < 1 ){
                    return res.status(404).send({message: 'Falha na autenticação!'});
                }
                bcrypt.compare(req.body.senha,results[0].senha,(err,result)=>{
                    if(err){
                        return res.status(404).send({message: 'Falha na autenticação!'});
                    }
                    if(result){ 
                        const token = jwt.sign({
                            id: results[0].id,
                            email: results[0].email
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                        )                       
                        return res.status(200).send(
                            {
                            message: 'Autenticado com Sucesso!',
                            token: token
                          })
                    }
                        return res.status(404).send({message: 'Falha na autenticação!'});
                });
            }
        );
    });
};