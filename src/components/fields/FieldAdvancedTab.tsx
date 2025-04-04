
import React, { useEffect, useState } from "react";
import { FieldAdvancedPanel } from "./FieldAdvancedPanel";

interface FieldAdvancedTabProps {
  fieldType: string | null;
  fieldData?: any;
  onUpdate: (data: any) => void;
}

export function FieldAdvancedTab({ fieldType, fieldData, onUpdate }: FieldAdvancedTabProps) {
  const [advancedSettings, setAdvancedSettings] = useState<any>(fieldData?.advanced || {});

  // Update local state when fieldData changes
  useEffect(() => {
    if (fieldData?.advanced) {
      setAdvancedSettings(fieldData.advanced);
    }
  }, [fieldData]);

  // Handle saving advanced settings
  const handleSaveAdvancedSettings = (advancedSettings: any) => {
    setAdvancedSettings(advancedSettings);
    
    // Merge with existing field data if needed
    const updatedData = {
      ...(fieldData || {}),
      advanced: advancedSettings
    };
    
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-6">
      <FieldAdvancedPanel
        fieldType={fieldType}
        initialData={fieldData?.advanced || advancedSettings}
        onSave={handleSaveAdvancedSettings}
      />
    </div>
  );
}

export default FieldAdvancedTab;
