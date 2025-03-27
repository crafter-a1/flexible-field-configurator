
import React, { useEffect, useState } from 'react';
import { Switch, Route } from '@strapi/design-system/v2';
import { Layout, BaseHeaderLayout, ContentLayout } from '@strapi/design-system';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import FormBuilder from '../FormBuilder';
import FormTemplates from '../FormTemplates';

// Initialize PrimeReact CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css'; // utility CSS classes

const App = () => {
  return (
    <Layout>
      <BaseHeaderLayout
        title="PrimeReact Forms"
        subtitle="Create dynamic forms with PrimeReact components"
        as="h2"
      />
      <ContentLayout>
        <Switch>
          <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
          <Route path={`/plugins/${pluginId}/builder`} component={FormBuilder} exact />
          <Route path={`/plugins/${pluginId}/templates`} component={FormTemplates} exact />
        </Switch>
      </ContentLayout>
    </Layout>
  );
};

export default App;
