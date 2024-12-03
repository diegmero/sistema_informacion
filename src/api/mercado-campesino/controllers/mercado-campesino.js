'use strict';

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mercado-campesino.mercado-campesino', ({ strapi }) => ({
  async registrarEmprendedores(ctx) {
    const { mercadoCampesinoId, cedulasEmprendedores } = ctx.request.body;

    // Validación de los datos de entrada
    if (!mercadoCampesinoId) {
      return ctx.badRequest('El mercadoCampesinoId es requerido');
    }

    if (!cedulasEmprendedores || !Array.isArray(cedulasEmprendedores) || cedulasEmprendedores.length === 0) {
      return ctx.badRequest('cedulasEmprendedores debe ser un array no vacío de números de documento');
    }

    try {
      const mercadoCampesino = await strapi.entityService.findOne('api::mercado-campesino.mercado-campesino', mercadoCampesinoId, {
        populate: ['participantes'],
      });

      if (!mercadoCampesino) {
        return ctx.notFound('Mercado Campesino no encontrado');
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

      // Actualizar el mercado campesino con los emprendedores encontrados
      const updatedMercadoCampesino = await strapi.entityService.update('api::mercado-campesino.mercado-campesino', mercadoCampesinoId, {
        data: {
          participantes: {
            connect: emprendedoresIds,
          },
        },
      });

      const populatedMercadoCampesino = await strapi.entityService.findOne('api::mercado-campesino.mercado-campesino', mercadoCampesinoId, {
        populate: ['participantes'],
      });

      return populatedMercadoCampesino;
    } catch (error) {
      console.error('Error detallado:', error);
      return ctx.badRequest('Error al registrar emprendedores en el mercado campesino', { error: error.message });
    }
  },
}));