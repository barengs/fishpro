import type { InputHTMLAttributes } from "react";
import { FormField } from "../FormField";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
}

export function TextField({
  label,
  id,
  hint,
  required,
  optional,
  className = "",
  ...inputProps
}: TextFieldProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      hint={hint}
      required={required}
      optional={optional}
    >
      <input
        id={id}
        required={required}
        className={`w-full h-13 border rounded-xl px-3.5 text-fco-md field-input focus:outline-none focus:border-fco-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...inputProps}
      />
    </FormField>
  );
}
