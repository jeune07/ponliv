const app =require('./app');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const PORT= 5001;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`)
})
