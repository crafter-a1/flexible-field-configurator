
import React from 'react';
import { Box, Typography, Grid, GridItem, Flex } from '@strapi/design-system';
import { Card } from 'primereact/card';
import { useHistory } from 'react-router-dom';
import pluginId from '../../pluginId';

const FormTemplates = () => {
  const history = useHistory();

  const templates = [
    {
      id: 'contact',
      name: 'Contact Form',
      description: 'Basic contact form with name, email, subject and message fields',
      thumbnail: 'contact-form.png',
      fields: 4
    },
    {
      id: 'registration',
      name: 'User Registration',
      description: 'Complete user registration form with validation',
      thumbnail: 'registration-form.png',
      fields: 8
    },
    {
      id: 'survey',
      name: 'Survey Form',
      description: 'Multi-step survey with various question types',
      thumbnail: 'survey-form.png',
      fields: 12
    },
    {
      id: 'event',
      name: 'Event Registration',
      description: 'Form for event registration with participant details',
      thumbnail: 'event-form.png',
      fields: 6
    },
    {
      id: 'feedback',
      name: 'Feedback Form',
      description: 'Customer feedback form with ratings and comments',
      thumbnail: 'feedback-form.png',
      fields: 5
    },
    {
      id: 'product',
      name: 'Product Order Form',
      description: 'E-commerce product order form with shipping details',
      thumbnail: 'product-form.png',
      fields: 10
    }
  ];

  const selectTemplate = (templateId) => {
    // Here we would load the template and redirect to the form builder
    history.push(`/plugins/${pluginId}/builder?template=${templateId}`);
  };

  return (
    <Box padding={8} background="neutral100">
      <Box paddingBottom={4}>
        <Typography variant="alpha">Form Templates</Typography>
        <Typography variant="epsilon">
          Choose a pre-built template to get started quickly
        </Typography>
      </Box>

      <Grid gap={4}>
        {templates.map((template) => (
          <GridItem key={template.id} col={4} s={6} xs={12}>
            <Card
              title={template.name}
              subTitle={`${template.fields} fields`}
              style={{ cursor: 'pointer' }}
              onClick={() => selectTemplate(template.id)}
              className="p-shadow-3"
              footer={
                <Box paddingTop={2}>
                  <Typography variant="pi" textColor="neutral600">
                    Click to use this template
                  </Typography>
                </Box>
              }
            >
              <Box paddingY={2}>
                <Typography variant="omega">
                  {template.description}
                </Typography>
              </Box>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default FormTemplates;
