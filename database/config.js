const mongoose = require('mongoose');

const dbConnection = async ()=>{
  try {
    mongoose.connect(process.env.DB_CNN ); 
  } catch (error) {
    console.log(error);
    throw new Error('No se pudo conectar a la BD con mongo');
  };
};

module.exports = {
  dbConnection
}