import { Info, Ruler } from "lucide-react";

interface MeasurementResultsProps {
  data: Record<string, unknown>;
}

// Convert snake_case to Title Case and remove _cm suffix for display
const formatLabel = (key: string): string => {
  return key
    .replace(/_cm$/, "") // Remove _cm suffix
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// Check if key contains _cm to determine unit
const hasUnitCm = (key: string): boolean => {
  return key.toLowerCase().includes("_cm") || key.toLowerCase().includes("cm");
};

const isNumericMeasurement = (value: unknown): value is number => {
  return typeof value === "number";
};

const isNote = (key: string): boolean => {
  const noteKeys = ["note", "notes", "accuracy_note", "accuracy", "message", "info", "status"];
  return noteKeys.some((noteKey) => key.toLowerCase().includes(noteKey));
};

const isNestedObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

// Flatten nested measurements object into array of [key, value] pairs
const extractMeasurements = (data: Record<string, unknown>): Array<[string, number]> => {
  const results: Array<[string, number]> = [];
  
  for (const [key, value] of Object.entries(data)) {
    // If it's a nested measurements object, extract its contents
    if (key === "measurements" && isNestedObject(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (isNumericMeasurement(nestedValue)) {
          results.push([nestedKey, nestedValue]);
        }
      }
    } 
    // If it's a direct numeric measurement (not a note)
    else if (isNumericMeasurement(value) && !isNote(key)) {
      results.push([key, value]);
    }
  }
  
  return results;
};

// Extract notes from data (top-level or nested)
const extractNotes = (data: Record<string, unknown>): Array<[string, string]> => {
  const results: Array<[string, string]> = [];
  
  for (const [key, value] of Object.entries(data)) {
    if (isNote(key) && typeof value === "string") {
      results.push([key, value]);
    }
  }
  
  return results;
};

const MeasurementResults = ({ data }: MeasurementResultsProps) => {
  const measurements = extractMeasurements(data);
  const notes = extractNotes(data);

  return (
    <div className="w-full animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
          <Ruler className="w-4 h-4" />
          <span>Measurement Results</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Your Body Measurements
        </h2>
      </div>

      {/* Measurements Grid */}
      {measurements.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {measurements.map(([key, value], index) => (
            <div
              key={key}
              className="bg-card gradient-card rounded-xl p-5 shadow-soft border border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <p className="text-sm text-muted-foreground mb-1">
                {formatLabel(key)}
              </p>
              <p className="font-display text-2xl font-bold text-foreground">
                {value.toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  cm
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Notes Section */}
      {notes.length > 0 && (
        <div className="space-y-3">
          {notes.map(([key, value]) => (
            <div
              key={key}
              className="flex gap-3 p-4 rounded-xl bg-accent/50 border border-accent animate-fade-in"
            >
              <Info className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-accent-foreground mb-0.5">
                  {formatLabel(key)}
                </p>
                <p className="text-sm text-accent-foreground/80">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border text-center">
        <p className="text-xs text-muted-foreground">
          ⚠️ These are approximate AI-generated measurements. Accuracy ~85% based on pose estimation and anthropometric scaling.
        </p>
      </div>
    </div>
  );
};

export default MeasurementResults;
