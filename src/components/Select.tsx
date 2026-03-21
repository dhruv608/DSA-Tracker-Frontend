import * as React from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  value: string | number;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Select({ value, options, onChange, placeholder = 'Select...', disabled = false, className, icon }: SelectProps) {
  const getSafeVal = (v: string | number) => v === '' ? '__empty__' : String(v);
  const getRealVal = (v: string) => v === '__empty__' ? '' : v;

  const safeValue = value !== undefined && value !== null ? getSafeVal(value) : undefined;

  return (
    <ShadcnSelect value={safeValue} onValueChange={(v) => onChange(getRealVal(v))} disabled={disabled}>
      <SelectTrigger className={`w-full ${className || ''}`}>
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">No options found</div>
        ) : (
          options.map((opt) => (
            <SelectItem key={getSafeVal(opt.value)} value={getSafeVal(opt.value)}>
              {opt.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </ShadcnSelect>
  );
}
