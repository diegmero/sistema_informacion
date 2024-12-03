module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/asesorias/registrar-asistentes',
        handler: 'asesoria.registrarAsistentes',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };