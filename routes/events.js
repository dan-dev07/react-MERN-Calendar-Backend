const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const { obtenerEventos, crearEventos, actualizarEventos, eliminarEventos } = require('../controllers/events');
const {validarJWT} = require('../middlewares/validar-jwt');
const {validarCampos} = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
//Todo tiene que pasar por la valiadación del JWT
router.use(validarJWT);

//obtener eventos
router.get('/',
    
    obtenerEventos
  );

//Crear un evento
router.post('/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos,
  ],
  crearEventos
);

//Actualizar evento
router.put('/:id',
  
  actualizarEventos
);

//Borrar evento
router.delete('/:id', 
  
  eliminarEventos
);

module.exports = router;