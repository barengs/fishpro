import type { ReactNode, SelectHTMLAttributes } from "react";
import { FormField } from "../FormField";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options?: SelectOption[];
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children?: ReactNode;
}
export function SelectField({
  label,
  id,
  options,
  hint,
  required,
  optional,
  children,
  className = "",
  ...selectProps
}: SelectFieldProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      hint={hint}
      required={required}
      optional={optional}
    >
      <select
        id={id}
        required={required}
        className={`w-full h-13 border rounded-xl px-3.5 text-fco-md field-input focus:outline-none focus:border-fco-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...selectProps}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    </FormField>
  );
}
