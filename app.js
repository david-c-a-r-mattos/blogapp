const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const path = require("path")
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Post');
const Post = mongoose.model('posts');
require('./models/Category');
const Category = mongoose.model('categories');
const user = require('./routes/user');
const admin = require("./routes/admin")
//Configurações
async function connectToDatabase() 
{
  try 
  {
    await mongoose.connect('mongodb://localhost/blogapp', 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // outras opções se necessário
    });
    console.log('Conectado ao MongoDB com sucesso!');
  } 
  catch (error) 
  {
    console.error('Erro ao conectar ao MongoDB:', error.message);
  }
}
connectToDatabase();
app.use(session(
{
    secret: 'cursodenode',
    resave: true,
    saveUnitialized: true
}));
app.use(flash());
app.use((req, res, next) =>
{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next();
})
app.use(flash());
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')
//Rotas
app.get("/", async (req, res) =>
{
    try
    {    
        const posts = await Post.find().populate({path: 'category', model: 'categories'}).lean();
        res.render("index", {posts});
    }
    catch(error)
    {
        req.flash("error_msg", "Não foi possível carregar as postagens! "+error.message);
        res.render("/404");
    }
})
app.get("/404", (req, res) =>
{
    res.send("Erro 404!")
})
app.get("/post/:slug", async (req, res) =>
{
    try
    {
        const post = await Post.findOne({slug: req.params.slug}).lean();
        console.log(post.slug)
        if(post)
        {
            res.render("post/index", {post:post});
        }
        else
        {
            req.flash("error_msg", "Esse post não existe!");
            res.redirect("/");
        }
    }
    catch(error)
    {
        req.flash("error_msg", "Houve um erro interno! "+error.message);
        res.redirect("/");
    }
})
app.get("/categories/:slug", async (req, res) =>
{
    try
    {
        const category = await Category.findOne({slug: req.params.slug}).lean();
        if(category)
        {
            const posts = await Post.find({category: category._id}).lean();
            res.render("category/posts", { posts:posts, category:category });
        }
        else
        {
            req.flash("error_msg", "Essa categoria não existe!");
            res.redirect("/");
        }
    }
    catch(error)
    {
        req.flash("error_msg", "Houve um erro interno! "+error.message);
        res.redirect("/");
    }
})
app.get("/categories", async (req, res) =>
{  
    try
    {
        const categories = await Category.find().lean();
        res.render("category/index", {categories:categories});
    }
    catch(error)
    {
        req.flash("error_msg", "Houve um erro ao listar as categorias! "+error.message);
        res.redirect("/");
    }
})
app.get("/admin/categories", (req, res) =>
{
    res.render("admin/categories")
})
app.get("/admin/posts", (req, res) =>
{
    res.render("admin/posts")
})
app.use("/admin", admin);
app.use("/user", user);
const PORT = '8081'
app.listen(PORT, () =>{console.log('Servidor rodando!')});
