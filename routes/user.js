const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('./../models/User');
const User = mongoose.model('users'); // Corrigido: usar maiúsculo para o modelo
const bcrypt = require('bcryptjs');

router.get("/registry", (req, res) => 
{
    res.render("user/registry");
});
router.get("/login", (req, res) => 
{
    res.render("user/login");
});
router.post("/registry", async (req, res) => 
{
    const { name, email, password1, password2 } = req.body;
    const errors = [];  
    if(!name || typeof name == undefined || name == null) 
    {
        errors.push({text: 'Nome inválido!'});
    }
    if(!email || typeof email == undefined || email == null) 
    {
       errors.push({text: 'Email inválido!'});
    }
    if(!password1 || typeof password1 == undefined) 
    {
        errors.push({text: 'Senha inválida!'});
    } 
    else if(password1.length < 4) 
    {
        errors.push({text: 'Senha muito curta!'});
    }
    if(password2 != password1) 
    {
        errors.push({text: 'As senhas estão diferentes!'});
    } 
    if(errors.length > 0) 
    {
        return res.render('user/registry', {errors: errors});
    }   
    try 
    {
        const existingUser = await User.findOne({email: email}).lean();
        if(existingUser) {
            req.flash("error_msg", "Já existe uma conta com esse email!");
            return res.redirect('/user/registry');
        }
        
        const newUser = new User({
            name: name,
            email: email,
            password: password1
        });

        bcrypt.genSalt(10, (error, salt) => 
        {
            if(error) 
            {
                req.flash('error_msg', 'Houve um erro ao gerar o salt!');
                return res.redirect('/user/registry');
            }
            
            bcrypt.hash(newUser.password, salt, async (error, hash) => 
            {
                if(error) 
                {
                    req.flash('error_msg', 'Houve um erro durante o salvamento do usuário!');
                    return res.redirect('/user/registry');
                }             
                try 
                {
                    newUser.password = hash;
                    await newUser.save();
                    req.flash('success_msg', "Usuário criado com sucesso!");
                    return res.redirect('/');
                } 
                catch(error) 
                {
                    req.flash('error_msg', "Erro ao registrar usuário! "+error.message);
                    return res.redirect('/user/registry');
                }
            });
        });
    } 
    catch(error) 
    {
        req.flash('error_msg', "Erro ao verificar usuário existente! "+error.message);
        return res.redirect('/user/registry');
    }
});
module.exports = router;

