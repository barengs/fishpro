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
        className={`w-full border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] rounded-[10px] px-3.5 py-3 text-sm text-[#0f172a] dark:text-[#e8edf7] placeholder:text-[#94a0b8] dark:placeholder:text-[#6b7a96] focus:outline-none focus:border-[#2563eb] dark:focus:border-[#5b94ff] focus:ring-2 focus:ring-[#2563eb]/15 transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...textareaProps}
      />
    </FormField>
  );
}
