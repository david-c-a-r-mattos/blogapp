const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('./../models/Category');
const Category = mongoose.model('categories');
require('./../models/Post');
const Post = mongoose.model('posts');
const { ObjectId } = require('mongodb'); 
router.get("/", (req, res) => {
    res.send("Rota principal do painel ADM.")
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
router.get("/categories/edit/:id", async (req, res) => 
{
    try
    {
        const category = await Category.findById({_id : req.params.id}).lean();
        console.log(category);
        res.render("admin/editcategories", {category});
    }
    catch(error)
    {
        req.flash("error_msg", "Essa categoria não existe!");
        res.redirect("/admin/categories")
    }
});
router.post("/categories/edit", async (req, res) =>
{
    try
    {
        const category = await Category.findById(req.body.id);
        category.name = req.body.name;
        category.slug = req.body.slug;
        try
        {
            await category.save();
            req.flash("success_msg", "Categoria editada com sucesso!");
            res.redirect("/admin/categories");
        }
        catch(error)
        {
            req.flash("error_msg", "Erro ao salvar a categoria!");
            res.redirect("/admin/categories");
        }
    }
    catch(error)
    {
        req.flash("error_msg", "Erro ao editar a categoria!");
        res.redirect("/admin/categories");
    }
});
router.post("/categories/delete", async (req, res) =>
{
    try
    {
        await Category.findByIdAndDelete(req.body.id);
        req.flash("success_msg", "Categoria deletada com sucesso!");
        res.redirect("/admin/categories");
    }
    catch(error)
    {
        req.flash("error_msg", "Erro ao deletar categoria! "+error.message)
        res.redirect("/admin/categories")
    }
})
router.get("/posts", async (req, res) => {
    try {
        // Popula a categoria ao buscar os posts
        const posts = await Post.find().populate({
            path: 'category',
            model: 'categories' // Nome exato do model
        }).lean();
        res.render('admin/posts', { posts });
        console.log(posts[0].category.name);
    } catch(error) {
        req.flash("error_msg", "Erro ao listar posts!");
        res.redirect("/admin");
    }
});
router.get("/posts/add", async (req, res) =>
{
    try
    {
        const categories = await Category.find().lean();
        res.render("admin/addposts", {categories});
        console.log(categories);
    }
    catch(error)
    {
        req.flash("error_msg", "Erro ao carregar o post! "+erro.message);
        res.redirect("/admin");
    }
})
router.post("/posts/new", async (req, res) => 
{
    try
    {
        var errors = [];
        if(req.body.category == '0')
        {
            errors.push({text: "Registre uma categoria"});
        }
        if(errors.length > 0)
        {
            res.render("/admin/addposts", {errors : errors})
        }
        else
        {
            const newPost = new Post(
            {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                category: req.body.category,
                slug: req.body.slug
            });
            const savedPost = await newPost.save();
            req.flash("success_msg", "Post criado com sucesso!");
            res.redirect("/admin/posts");
            
        }
    }
    catch(error)
    {
        req.flash("error_msg", "Erro ao criar o post! "+error.message);
        res.redirect("/admin/posts");
    }
})
module.exports = router;
