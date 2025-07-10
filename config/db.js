if (process.env.NODE_ENV === 'production') 
{
  module.exports = {MONGODB_URI: 'mongodb+srv://gmLXjuK3TlP0arA1:gmLXjuK3TlP0arA1@cluster0.s4in0vt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'};
} 
else 
{
  module.exports = { MONGODB_URI: 'mongodb://localhost:27017/blogapp'};
}
