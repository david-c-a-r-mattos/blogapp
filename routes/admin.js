const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('./../models/Category');
const Category = mongoose.model('categories');
const { ObjectId } = require('mongodb'); 
router.get("/", (req, res) => {
    res.send("Rota principal do painel ADM.")
})
router.get("/posts", (req, res) => {
    res.send("Página de posts.")
})
router.post("/categories/new", async (req, res) => 
{
    errors = [];
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null)
    {
        errors.push({text: 'Nome inválido'});
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null)
    {
        errors.push({text: 'Slug inválido'});
    }
    if(req.body.name.length < 2)
    {
        errors.push({text: 'Nome da categoria muito pequeno'});
    }
    if(req.body.slug.length < 2)
    {
        errors.push({text: 'Nome do slug muito pequeno'});
    }
    if(errors.length > 0)
    {
        res.render('admin/addcategories', {errors:errors})
    }
    else
    {
        try 
        {
            const newCategory = new Category(
            {
                name: req.body.name,
                slug: req.body.slug,
            })
            const savedCategory = await newCategory.save()
            req.flash("success_msg", "Categoria criada com sucesso!");
            res.redirect("/admin/categories");
        }   
        catch (error) 
        {
            req.flash("error_msg", "Erro ao criar categoria!");
            res.redirect("/admin");
        }
    }
})
router.get("/categories", async (req, res) => {
    try {
        // Busca as categorias no banco de dados
        const categories = await Category.find().lean();
        
        // Renderiza a view passando as categorias
        res.render('admin/categories', { categories: categories });
        console.log(categories);
    } catch(error) {
        // Se ocorrer um erro, exibe mensagem e redireciona
        req.flash("error_msg", "Erro ao listar categorias!");
        res.redirect("/admin");
    }
});
router.get("/categories/edit/:id", (req, res) => {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
        return res.status(404).send("ID inválido");
    }
    
    res.render("admin/editcategories", { id });
});
module.exports = router;
