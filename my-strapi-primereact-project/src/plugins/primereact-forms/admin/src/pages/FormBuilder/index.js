
import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Flex, Grid, GridItem } from '@strapi/design-system';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { Panel } from 'primereact/panel';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// This would need the react-beautiful-dnd package installed
// <lov-add-dependency>react-beautiful-dnd@latest</lov-add-dependency>

const FormBuilder = () => {
  const [formName, setFormName] = useState('New Form');
  const [formFields, setFormFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  
  const availableFields = [
    { id: 'text', label: 'Text Field', icon: 'pi pi-pencil' },
    { id: 'textarea', label: 'Text Area', icon: 'pi pi-align-left' },
    { id: 'richtext', label: 'Rich Text Editor', icon: 'pi pi-align-center' },
    { id: 'upload', label: 'Media Upload', icon: 'pi pi-image' },
    { id: 'dropdown', label: 'Dropdown', icon: 'pi pi-chevron-down' },
    { id: 'date', label: 'Date Picker', icon: 'pi pi-calendar' },
    { id: 'checkbox', label: 'Checkbox', icon: 'pi pi-check-square' },
  ];

  const addField = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      required: false,
      placeholder: '',
      defaultValue: '',
      validation: {},
      options: fieldType === 'dropdown' ? [{ label: 'Option 1', value: 'option1' }] : [],
    };
    
    setFormFields([...formFields, newField]);
    setSelectedField(newField);
  };

  const updateFieldProperty = (fieldId, property, value) => {
    const updatedFields = formFields.map(field => {
      if (field.id === fieldId) {
        return { ...field, [property]: value };
      }
      return field;
    });
    
    setFormFields(updatedFields);
    
    if (selectedField && selectedField.id === fieldId) {
      setSelectedField({ ...selectedField, [property]: value });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFormFields(items);
  };

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'text':
        return <InputText placeholder={field.placeholder || field.label} />;
      case 'textarea':
        return <InputTextarea placeholder={field.placeholder || field.label} rows={3} />;
      case 'richtext':
        return <Editor style={{ height: '200px' }} />;
      case 'upload':
        return <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} />;
      case 'dropdown':
        return <Dropdown options={field.options} placeholder={field.placeholder || field.label} />;
      default:
        return <Box>Unsupported field type</Box>;
    }
  };

  return (
    <Box padding={4}>
      <Flex justifyContent="space-between" alignItems="center" paddingBottom={4}>
        <Box>
          <Typography variant="beta">{formName}</Typography>
          <Typography variant="epsilon">Drag and drop fields to build your form</Typography>
        </Box>
        <Button>Save Form</Button>
      </Flex>
      
      <Grid gap={4}>
        <GridItem col={3}>
          <Box background="neutral0" padding={4} shadow="tableShadow" hasRadius>
            <Typography variant="delta" paddingBottom={2}>Form Components</Typography>
            <Box>
              {availableFields.map((field) => (
                <Box 
                  key={field.id} 
                  background="neutral100" 
                  padding={2} 
                  marginBottom={2} 
                  hasRadius 
                  onClick={() => addField(field.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Flex>
                    <Box paddingRight={2}>
                      <i className={field.icon} style={{ fontSize: '1.2rem' }}></i>
                    </Box>
                    <Typography>{field.label}</Typography>
                  </Flex>
                </Box>
              ))}
            </Box>
          </Box>
        </GridItem>
        
        <GridItem col={6}>
          <Box background="neutral0" padding={4} shadow="tableShadow" hasRadius minHeight="400px">
            <Typography variant="delta" paddingBottom={4}>Form Preview</Typography>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    padding={2}
                    background="neutral100"
                    hasRadius
                    minHeight="300px"
                  >
                    {formFields.length === 0 ? (
                      <Box padding={4} textAlign="center">
                        <Typography variant="omega" textColor="neutral600">
                          Drag components here to start building your form
                        </Typography>
                      </Box>
                    ) : (
                      formFields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              background="neutral0"
                              padding={3}
                              marginBottom={2}
                              hasRadius
                              shadow="tableShadow"
                              onClick={() => setSelectedField(field)}
                              style={provided.draggableProps.style}
                            >
                              <Box paddingBottom={2}>
                                <Typography variant="pi" fontWeight="bold">{field.label}</Typography>
                                {field.required && (
                                  <Typography variant="pi" textColor="danger600">*</Typography>
                                )}
                              </Box>
                              {renderFieldPreview(field)}
                            </Box>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </GridItem>
        
        <GridItem col={3}>
          <Box background="neutral0" padding={4} shadow="tableShadow" hasRadius>
            <Typography variant="delta" paddingBottom={2}>Field Properties</Typography>
            
            {selectedField ? (
              <Accordion multiple activeIndex={[0, 1]}>
                <AccordionTab header="Basic Settings">
                  <Box paddingY={2}>
                    <Typography variant="pi" fontWeight="bold">Label</Typography>
                    <InputText 
                      value={selectedField.label} 
                      onChange={(e) => updateFieldProperty(selectedField.id, 'label', e.target.value)}
                      className="w-full mt-1"
                    />
                  </Box>
                  
                  <Box paddingY={2}>
                    <Typography variant="pi" fontWeight="bold">Placeholder</Typography>
                    <InputText 
                      value={selectedField.placeholder} 
                      onChange={(e) => updateFieldProperty(selectedField.id, 'placeholder', e.target.value)}
                      className="w-full mt-1"
                    />
                  </Box>
                  
                  <Box paddingY={2} className="field-checkbox">
                    <Typography variant="pi" fontWeight="bold">Required</Typography>
                    <div className="p-field-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedField.required}
                        onChange={(e) => updateFieldProperty(selectedField.id, 'required', e.target.checked)}
                      />
                    </div>
                  </Box>
                </AccordionTab>
                
                <AccordionTab header="Validation">
                  <Box paddingY={2}>
                    <Typography variant="pi" fontWeight="bold">Regex Pattern</Typography>
                    <InputText 
                      value={selectedField.validation?.pattern || ''} 
                      onChange={(e) => updateFieldProperty(
                        selectedField.id, 
                        'validation', 
                        {...selectedField.validation, pattern: e.target.value}
                      )}
                      className="w-full mt-1"
                    />
                  </Box>
                  
                  {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
                    <>
                      <Box paddingY={2}>
                        <Typography variant="pi" fontWeight="bold">Min Length</Typography>
                        <InputText 
                          type="number"
                          value={selectedField.validation?.minLength || ''} 
                          onChange={(e) => updateFieldProperty(
                            selectedField.id, 
                            'validation', 
                            {...selectedField.validation, minLength: e.target.value}
                          )}
                          className="w-full mt-1"
                        />
                      </Box>
                      
                      <Box paddingY={2}>
                        <Typography variant="pi" fontWeight="bold">Max Length</Typography>
                        <InputText 
                          type="number"
                          value={selectedField.validation?.maxLength || ''} 
                          onChange={(e) => updateFieldProperty(
                            selectedField.id, 
                            'validation', 
                            {...selectedField.validation, maxLength: e.target.value}
                          )}
                          className="w-full mt-1"
                        />
                      </Box>
                    </>
                  )}
                </AccordionTab>
                
                {selectedField.type === 'dropdown' && (
                  <AccordionTab header="Options">
                    <Box paddingY={2}>
                      <Typography variant="pi" fontWeight="bold">Dropdown Options</Typography>
                      {selectedField.options.map((option, index) => (
                        <Flex key={index} paddingY={1}>
                          <InputText 
                            value={option.label} 
                            onChange={(e) => {
                              const newOptions = [...selectedField.options];
                              newOptions[index] = { ...option, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s/g, '_') };
                              updateFieldProperty(selectedField.id, 'options', newOptions);
                            }}
                            className="mr-2"
                          />
                          <Button size="S" variant="danger-light">×</Button>
                        </Flex>
                      ))}
                      <Button 
                        size="S" 
                        variant="secondary" 
                        onClick={() => {
                          const newOptions = [...selectedField.options, { label: `Option ${selectedField.options.length + 1}`, value: `option${selectedField.options.length + 1}` }];
                          updateFieldProperty(selectedField.id, 'options', newOptions);
                        }}
                      >
                        Add Option
                      </Button>
                    </Box>
                  </AccordionTab>
                )}
              </Accordion>
            ) : (
              <Box padding={4} textAlign="center">
                <Typography variant="omega" textColor="neutral600">
                  Select a field to edit its properties
                </Typography>
              </Box>
            )}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default FormBuilder;
