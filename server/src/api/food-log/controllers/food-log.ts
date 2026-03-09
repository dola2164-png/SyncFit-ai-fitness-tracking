/**
 * food-log controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::food-log.food-log',
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Login required');
      }

      const body = ctx.request.body?.data;

      if (!body) {
        return ctx.badRequest('No data provided');
      }

      body.users_permissions_user = user.id;

      const entry = await strapi.entityService.create(
        'api::food-log.food-log',
        {
          data: body,
          populate: {
            users_permissions_user: true,
          },
        }
      );

      return entry;
    },

    async find(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Login required');
      }

      const result = await strapi.entityService.findMany(
        'api::food-log.food-log',
        {
          filters: { users_permissions_user: user.id },
          populate: {
            users_permissions_user: true,
          },
        }
      );

      return result;
    },

    async findOne(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Login required');
      }

      const { id } = ctx.params;

      const result = await strapi.entityService.findMany(
        'api::food-log.food-log',
        {
          filters: { id, users_permissions_user: user.id },
          populate: {
            users_permissions_user: true,
          },
        }
      );

      if (!result.length) return ctx.notFound('Not found');

      return result[0];
    },
  })
);