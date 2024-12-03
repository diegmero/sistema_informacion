module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/registro-evento',
        handler: 'registro-evento.registrarEmprendedores',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };