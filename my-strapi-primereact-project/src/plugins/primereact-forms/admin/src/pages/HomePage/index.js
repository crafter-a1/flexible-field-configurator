
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, GridItem, Typography } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import pluginId from '../../pluginId';

const HomePage = () => {
  return (
    <Box padding={8} background="neutral100">
      <Box paddingBottom={4}>
        <Typography variant="alpha">PrimeReact Form Builder</Typography>
        <Typography variant="epsilon">
          Create dynamic forms with advanced PrimeReact components
        </Typography>
      </Box>

      <Grid gap={6}>
        <GridItem col={6} s={12}>
          <Box padding={4} background="neutral0" shadow="tableShadow" hasRadius>
            <Box paddingBottom={2}>
              <Typography variant="delta">Create New Form</Typography>
            </Box>
            <Typography variant="omega">
              Start from scratch and create a custom form with our drag-and-drop builder
            </Typography>
            <Box paddingTop={4}>
              <Button
                startIcon={<Plus />}
                variant="primary"
                as={Link}
                to={`/plugins/${pluginId}/builder`}
              >
                Create Form
              </Button>
            </Box>
          </Box>
        </GridItem>

        <GridItem col={6} s={12}>
          <Box padding={4} background="neutral0" shadow="tableShadow" hasRadius>
            <Box paddingBottom={2}>
              <Typography variant="delta">Form Templates</Typography>
            </Box>
            <Typography variant="omega">
              Choose from pre-built templates for common form types
            </Typography>
            <Box paddingTop={4}>
              <Button
                variant="secondary"
                as={Link}
                to={`/plugins/${pluginId}/templates`}
              >
                Browse Templates
              </Button>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default HomePage;
