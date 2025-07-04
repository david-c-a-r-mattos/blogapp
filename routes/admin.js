const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('./../models/Category')
const Category = mongoose.model('categories')
router.get("/", (req, res) => {
    res.send("Rota principal do painel ADM.")
})
router.get("/posts", (req, res) => {
    res.send("Página de posts")
})
router.post("/categories/new", async (req, res) => 
{
    try 
    {
        const newCategory = new Category(
        {
            name: req.body.name,
            slug: req.body.slug,
        })
        const savedCategory = await newCategory.save()
        console.log("Categoria salva com sucesso:", savedCategory)
        res.send("Categoria salva com sucesso!")
    }   
    catch (error) 
    {
        console.error("Erro ao salvar categoria:", error)    
    }
})
router.get("/categories", (req, res) => {
    res.send("Página de categorias.")
})
module.exports = router
