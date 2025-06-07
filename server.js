const app =require('./app');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const PORT= 5001;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})
