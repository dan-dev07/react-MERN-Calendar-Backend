// Rutas de usuarios / Auth
// host + /api/auth

const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {crearUsuario, loginUsuario, revalidaToken} = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
// Rutas
router.post(
  '/new',
  [//middlewares
    check('name', 'El nombre el obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').isLength({min:6}),
    validarCampos,
  ],
  crearUsuario);

router.post('/',
  [//middlewares
    check('email','El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatorio').isLength({min:6}).not(),
    validarCampos,
  ],
  loginUsuario);

router.get('/renew', validarJWT, revalidaToken);

module.exports = router;
