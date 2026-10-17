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
        className={`w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl px-3.5 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...inputProps}
      />
    </FormField>
  );
}
