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
        className={`w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue resize-none disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...textareaProps}
      />
    </FormField>
  );
}
