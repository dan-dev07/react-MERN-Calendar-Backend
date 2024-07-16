const {response} = require('express');
const Evento = require('../models/Events');


const obtenerEventos =async(req, res = response)=>{ 
  const eventos = await Evento.find().populate('user', 'name');

  res.json({
    ok:true,
    eventos
  });
};

const crearEventos = async(req, res = response)=>{
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();

    res.json({
      ok:true, 
      evento: eventoGuardado,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Habla con el administrador'
    })
  }
};

const actualizarEventos = async (req, res = response)=>{
  const eventoID = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoID);
    if (!evento) {
      res.status(404).json({
        ok:false,
        msg:'Evento no existe por ese id'
      });
    };
    
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok:false,
        msg:'No tiene privilegios para editar este evento'
      });
    };

    const nuevoEvento = {
      ...req.body,
      user:uid,
    };
    const eventoActualizado = await Evento.findByIdAndUpdate(eventoID, nuevoEvento);

    res.json({
      ok:true,
      eventos:eventoActualizado,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Hable con el administrador'
    })
  }


};

const eliminarEventos = async(req, res = response)=>{
  const eventoID = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoID);
    if (!evento) {
      return res.status(404).json({
        ok:false,
        msg:'Evento no existe por ese id'
      });
    };
    
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok:false,
        msg:'No tiene privilegios para editar este evento'
      });
    };

    const eventoBorrado = await Evento.findByIdAndDelete(eventoID);

    res.json({
      ok:true,
      eventoBorrado,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Hable con el administrador'
    })
  }
};

module.exports = {
  obtenerEventos,
  crearEventos,
  actualizarEventos,
  eliminarEventos,
}