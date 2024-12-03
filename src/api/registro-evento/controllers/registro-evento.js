module.exports = {
    async registrarEmprendedores(ctx) {
      const { eventoId, cedulasEmprendedores } = ctx.request.body;
  
      // Validación de los datos de entrada
      if (!eventoId) {
        return ctx.badRequest('El eventoId es requerido');
      }
  
      if (!cedulasEmprendedores || !Array.isArray(cedulasEmprendedores) || cedulasEmprendedores.length === 0) {
        return ctx.badRequest('cedulasEmprendedores debe ser un array no vacío de números de documento');
      }
  
      try {
        const evento = await strapi.entityService.findOne('api::evento.evento', eventoId, {
          populate: ['emprendedores'],
        });
  
        if (!evento) {
          return ctx.notFound('Evento no encontrado');
        }
  
        // Buscar los emprendedores por número de documento
        const emprendedores = await Promise.all(
          cedulasEmprendedores.map(async (cedula) => {
            const [emprendedor] = await strapi.entityService.findMany('api::emprendedor.emprendedor', {
              filters: { Cedula: cedula },
              limit: 1,
            });
            return emprendedor;
          })
        );
  
        // Filtrar los emprendedores encontrados y obtener sus IDs
        const emprendedoresIds = emprendedores.filter(e => e).map(e => e.id);
  
        // Actualizar el evento con los emprendedores encontrados
        const updatedEvento = await strapi.entityService.update('api::evento.evento', eventoId, {
          data: {
            emprendedores: {
              set: emprendedoresIds,
            },
          },
        });
  
        const populatedEvento = await strapi.entityService.findOne('api::evento.evento', eventoId, {
          populate: ['emprendedores'],
        });
  
        return populatedEvento;
      } catch (error) {
        console.error('Error detallado:', error);
        return ctx.badRequest('Error al registrar emprendedores', { error: error.message });
      }
    },
  };