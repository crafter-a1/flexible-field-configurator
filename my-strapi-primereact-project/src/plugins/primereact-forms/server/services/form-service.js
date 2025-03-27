
'use strict';

module.exports = ({ strapi }) => ({
  async find(query = {}) {
    // In a real implementation, this would likely use Strapi's database APIs
    // For now, we'll just return a mock array of forms
    return [
      {
        id: 1,
        name: 'Contact Form',
        description: 'Basic contact form',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Name',
            required: true
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            validation: {
              pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
            }
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            required: true
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  },

  async findOne(id) {
    const forms = await this.find();
    return forms.find(form => form.id.toString() === id.toString()) || null;
  },

  async create(data) {
    // In a real implementation, this would create a record in the database
    return {
      id: Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  async update(id, data) {
    // In a real implementation, this would update a record in the database
    const form = await this.findOne(id);
    
    if (!form) {
      return null;
    }
    
    return {
      ...form,
      ...data,
      updatedAt: new Date()
    };
  },

  async delete(id) {
    // In a real implementation, this would delete a record from the database
    const form = await this.findOne(id);
    
    if (!form) {
      return null;
    }
    
    return form;
  }
});
