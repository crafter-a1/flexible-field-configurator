
'use strict';

module.exports = {
  async find(ctx) {
    try {
      const forms = await strapi.plugin('primereact-forms').service('form').find();
      ctx.body = forms;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const form = await strapi.plugin('primereact-forms').service('form').findOne(id);
      
      if (!form) {
        return ctx.notFound('Form not found');
      }
      
      ctx.body = form;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx) {
    try {
      const formData = ctx.request.body;
      const createdForm = await strapi.plugin('primereact-forms').service('form').create(formData);
      ctx.body = createdForm;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const formData = ctx.request.body;
      const updatedForm = await strapi.plugin('primereact-forms').service('form').update(id, formData);
      
      if (!updatedForm) {
        return ctx.notFound('Form not found');
      }
      
      ctx.body = updatedForm;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const deletedForm = await strapi.plugin('primereact-forms').service('form').delete(id);
      
      if (!deletedForm) {
        return ctx.notFound('Form not found');
      }
      
      ctx.body = deletedForm;
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
