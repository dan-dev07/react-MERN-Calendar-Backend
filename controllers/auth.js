const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');


const crearUsuario = async(req, res = response)=>{
  const {name,email,password} = req.body;

  try {
    let usuario = await Usuario.findOne({email})
    if (usuario) {
      return res.status(400).json({
        ok:false,
        msg:'Este correo ya existe'
      });
    };

    //Encryptar contraseña
    usuario = new Usuario(req.body);
    
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();
    
    //Generar un JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok:true,
      uid:usuario.id,
      msg:usuario.name,
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Contacte con su administrador para resolver el problema',
    })
  }
};

const loginUsuario = async (req, res=response)=>{
  const {email, password} = req.body;

  try {
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
      return res.status(400).json({
        ok:false,
        msg:'El usuario no existe con este email',
      });
    }

    //Confirmar los password
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok:false,
        msg:'Contraseña incorrecta'
      });
    };

    //Generar un JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok:true,
      uid:usuario.id,
      name:usuario.name,
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Por favor hable con el administrador'
    });
  };
}


const revalidaToken = async(req, res=response)=>{
  const uid = req.uid;
  const name = req.name;

  const token = await generarJWT(uid, name);
  console.log('Desde controllers: ',token);

  res.json({
    ok:true,
    token,
  });
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidaToken
}