const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
  info: {
    version: '1.0.0',        
    title: 'Nodejs Express + MySQL API',              
    description: 'API oparte na Node.js Express obsługujące operacje związane z bazą danych PostgreSQL.'         // by default: ''
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '' ,
      schemes: ['http']      
    },
    
  ],
  
  
  components: {}       
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
    require('./server.js'); 
  });