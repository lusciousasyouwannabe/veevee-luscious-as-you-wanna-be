import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditableField {
  key: string;
  label: string;
  type: "text" | "textarea";
}

interface TemplateEditorProps {
  templateName: string;
  editableFields: EditableField[];
  defaults: Record<string, any>;
  savedSettings: Record<string, any>;
  onSaved: () => void;
}

const TemplateEditor = ({
  templateName,
  editableFields,
  defaults,
  savedSettings,
  onSaved,
}: TemplateEditorProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const merged: Record<string, string> = {};
    for (const field of editableFields) {
      merged[field.key] = savedSettings[field.key] ?? defaults[field.key] ?? "";
    }
    setValues(merged);
  }, [templateName, editableFields, defaults, savedSettings]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = (key: string) => {
    setValues((prev) => ({ ...prev, [key]: defaults[key] ?? "" }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Only save values that differ from defaults
      const settingsToSave: Record<string, string> = {};
      for (const field of editableFields) {
        const val = values[field.key];
        if (val !== defaults[field.key]) {
          settingsToSave[field.key] = val;
        }
      }

      // Upsert into email_template_settings
      const { error } = await supabase
        .from("email_template_settings" as any)
        .upsert(
          {
            template_name: templateName,
            settings: settingsToSave,
            updated_at: new Date().toISOString(),
          } as any,
          { onConflict: "template_name" }
        );

      if (error) throw error;
      toast.success("Template settings saved");
      onSaved();
    } catch (err) {
      console.error("Failed to save template settings", err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = editableFields.some(
    (f) => values[f.key] !== (savedSettings[f.key] ?? defaults[f.key] ?? "")
  );

  return (
    <div className="space-y-5 p-5 max-h-[700px] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg font-semibold text-foreground">Edit Template</h3>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="font-body text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {editableFields.map((field) => {
        const isModified = values[field.key] !== (defaults[field.key] ?? "");
        return (
          <div key={field.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="font-body text-sm text-foreground font-medium">
                {field.label}
                {isModified && (
                  <span className="ml-2 text-xs text-primary font-normal">Modified</span>
                )}
              </Label>
              {isModified && (
                <button
                  onClick={() => handleReset(field.key)}
                  className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            {field.type === "textarea" ? (
              <Textarea
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="font-body text-sm min-h-[80px]"
              />
            ) : (
              <Input
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="font-body text-sm"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TemplateEditor;
