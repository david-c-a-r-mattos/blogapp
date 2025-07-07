const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require("./routes/admin")
const mongoose = require('mongoose')
const app = express()
const path = require("path")
const session = require('express-session')
const flash = require('connect-flash')
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
app.use("/admin", admin)
app.get("/", (req, res) =>
{
    res.render("admin/index")
})
app.get("/admin/categories", (req, res) =>
{
    res.render("admin/categories")
})
app.get("/admin/posts", (req, res) =>
{
    res.render("admin/posts")
})
app.get("/admin/categories/add", (req, res) =>
{
    res.render("admin/addcategories")
})
const PORT = '8081'
app.listen(PORT, () =>{console.log('Servidor rodando!')})
