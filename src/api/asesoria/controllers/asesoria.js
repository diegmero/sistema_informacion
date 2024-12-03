'use strict';

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::asesoria.asesoria', ({ strapi }) => ({
  async registrarAsistentes(ctx) {
    const { asesoriaId, cedulasEmprendedores } = ctx.request.body;

    // Validación de los datos de entrada
    if (!asesoriaId) {
      return ctx.badRequest('El asesoriaId es requerido');
    }

    if (!cedulasEmprendedores || !Array.isArray(cedulasEmprendedores) || cedulasEmprendedores.length === 0) {
      return ctx.badRequest('cedulasEmprendedores debe ser un array no vacío de números de documento');
    }

    try {
      const asesoria = await strapi.entityService.findOne('api::asesoria.asesoria', asesoriaId, {
        populate: ['emprendedor'],
      });

      if (!asesoria) {
        return ctx.notFound('Asesoría no encontrada');
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

      // Actualizar la asesoría con los emprendedores encontrados
      const updatedAsesoria = await strapi.entityService.update('api::asesoria.asesoria', asesoriaId, {
        data: {
          emprendedor: emprendedoresIds,
        },
      });

      const populatedAsesoria = await strapi.entityService.findOne('api::asesoria.asesoria', asesoriaId, {
        populate: ['emprendedor'],
      });

      return populatedAsesoria;
    } catch (error) {
      console.error('Error detallado:', error);
      return ctx.badRequest('Error al registrar asistentes en la asesoría', { error: error.message });
    }
  },
}));