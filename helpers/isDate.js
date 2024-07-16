const dayjs = require('dayjs');

const isDate = (value, {req, location, path})=>{

  if (!value) {
    return false;
  };

  const fecha = dayjs(value).isValid();
  return fecha;  

}; 

module.exports = {
  isDate,
}