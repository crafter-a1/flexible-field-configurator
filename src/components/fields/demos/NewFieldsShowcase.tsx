
import React, { useState } from 'react';
import TranslationField from '../inputs/TranslationField';
import MapField from '../inputs/MapField';
import MediaField from '../inputs/MediaField';
import NoticeField from '../inputs/NoticeField';
import ButtonLinksField from '../inputs/ButtonLinksField';
import ModalField from '../inputs/ModalField';
import DetailGroupField from '../inputs/DetailGroupField';
import InlineRepeaterField from '../inputs/InlineRepeaterField';
import IconSelectField from '../inputs/IconSelectField';

export const NewFieldsShowcase = () => {
  // Translation Field
  const [translationValue, setTranslationValue] = useState<{[locale: string]: string}>({
    en: 'This is some sample content in English.',
    es: 'Este es un contenido de muestra en español.',
    fr: '',
    de: ''
  });

  // Map Field
  const [mapValue, setMapValue] = useState<{lat: number, lng: number} | null>({
    lat: 48.8584,
    lng: 2.2945
  });

  // Media Field
  const [mediaValue, setMediaValue] = useState<File | string | null>(null);
  const [imageValue, setImageValue] = useState<File | string | null>(null);

  // Button Links
  const buttonLinks = [
    {
      label: 'Primary Action',
      url: '#primary',
      variant: 'default' as const,
      target: '_self' as const
    },
    {
      label: 'Secondary Action',
      url: '#secondary',
      variant: 'outline' as const,
      target: '_self' as const
    }
  ];

  // Repeater Field
  const [repeaterItems, setRepeaterItems] = useState([
    { id: '1', label: 'Item 1 Name', value: 'Item 1 Value' },
    { id: '2', label: 'Item 2 Name', value: 'Item 2 Value' }
  ]);

  // Icon Select
  const [selectedIcon, setSelectedIcon] = useState('');

  // Notice states for dismissible notices
  const [showInfoNotice, setShowInfoNotice] = useState(true);
  const [showWarningNotice, setShowWarningNotice] = useState(true);

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Field Components Showcase</h1>

      <div className="space-y-10">
        {/* Translation Field */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Translation Field</h2>
          <TranslationField
            id="translation-demo"
            label="Multilingual Content"
            value={translationValue}
            onChange={setTranslationValue}
            helpText="Edit content in multiple languages with this tabbed interface."
          />
        </section>

        {/* Map Field */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Map Field</h2>
          <MapField
            id="map-demo"
            label="Location"
            value={mapValue}
            onChange={setMapValue}
            helpText="Select a location on the map or enter coordinates manually."
          />
        </section>

        {/* Media Fields */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Media/Image Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MediaField
              id="image-demo"
              label="Image Field"
              value={imageValue}
              onChange={setImageValue}
              accept="image/*"
              helpText="Upload image files (PNG, JPG, GIF, etc.)"
            />
            <MediaField
              id="media-demo"
              label="Media Field"
              value={mediaValue}
              onChange={setMediaValue}
              accept=".pdf,.doc,.docx"
              helpText="Upload document files (PDF, DOC, etc.)"
            />
          </div>
        </section>

        {/* Special Components */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Special Components</h2>

          {/* Repeater */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Repeater/Inline Repeater</h3>
            <InlineRepeaterField
              id="repeater-demo"
              label="Repeater Field"
              value={repeaterItems}
              onChange={setRepeaterItems}
              fields={[
                { key: 'label', label: 'Label' },
                { key: 'value', label: 'Value' }
              ]}
              helpText="Add, remove, and manage repeatable items"
            />
          </div>

          {/* ButtonLinks */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Button Links</h3>
            <ButtonLinksField
              id="button-links-demo"
              label="Button Links"
              buttons={buttonLinks}
              helpText="Configurable action buttons that can link to URLs or trigger functions"
            />
          </div>

          {/* Notices */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Notices</h3>
            <div className="space-y-4">
              {showInfoNotice && (
                <NoticeField
                  id="info-notice-demo"
                  title="Information Notice"
                  content="This is an information notice with important details that users should be aware of."
                  variant="info"
                  dismissable
                  onDismiss={() => setShowInfoNotice(false)}
                />
              )}
              
              <NoticeField
                id="success-notice-demo"
                title="Success Notice"
                content="The operation has been completed successfully."
                variant="success"
              />
              
              {showWarningNotice && (
                <NoticeField
                  id="warning-notice-demo"
                  title="Warning Notice"
                  content="This action may have consequences. Please review before proceeding."
                  variant="warning"
                  dismissable
                  onDismiss={() => setShowWarningNotice(false)}
                />
              )}
              
              <NoticeField
                id="error-notice-demo"
                title="Error Notice"
                content="An error occurred while processing your request. Please try again."
                variant="error"
              />
            </div>
          </div>

          {/* Icon Select */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Icon Select</h3>
            <IconSelectField
              id="icon-select-demo"
              label="Icon Select"
              value={selectedIcon}
              onChange={setSelectedIcon}
              helpText="Select an icon from the library of available icons"
            />
          </div>

          {/* Modal */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Modal Trigger</h3>
            <ModalField
              id="modal-demo"
              label="Modal Field"
              triggerText="Open Modal"
              title="Modal Dialog"
              description="This is a sample modal dialog"
              content={(
                <div className="py-4">
                  <p>Modal content goes here. This could contain form fields, information, or other interactive elements.</p>
                </div>
              )}
              helpText="Click to open a modal dialog"
            />
          </div>

          {/* DetailGroup */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Detail Group</h3>
            <DetailGroupField
              id="detail-group-demo"
              title="Detail Group"
              description="A way to display structured information"
              items={[
                { label: "Name", value: "John Doe" },
                { label: "Email", value: "john.doe@example.com" },
                { label: "Role", value: "Administrator" },
                { label: "Status", value: "Active" }
              ]}
              helpText="Display grouped data in a structured format"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewFieldsShowcase;
