import type { TextareaHTMLAttributes } from "react";
import { FormField } from "../FormField";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
}
export function TextareaField({
  label,
  id,
  hint,
  required,
  optional,
  className = "",
  rows = 3,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <FormField
      label={label}
      htmlFor={id}
      hint={hint}
      required={required}
      optional={optional}
    >
      <textarea
        id={id}
        required={required}
        rows={rows}
        className={`w-full border-2 border-fco-border dark:border-fco-border-dark rounded-xl p-3 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft resize-none disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...textareaProps}
      />
    </FormField>
  );
}
