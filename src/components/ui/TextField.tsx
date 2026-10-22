import {
  useState,
  useRef,
  type InputHTMLAttributes,
  type ChangeEvent,
} from "react";
import { FormField } from "../FormField";
import {
  formatThousandInput,
  unformatThousandInput,
  calculateCursorPosition,
} from "../../utils/formatters";

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label: string;
  id: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  formatThousand?: boolean;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

export function TextField({
  label,
  id,
  hint,
  required,
  optional,
  className = "",
  type,
  formatThousand,
  value,
  defaultValue,
  onChange,
  ...inputProps
}: TextFieldProps) {
  const isYearField =
    id.toLowerCase().includes("year") ||
    id.toLowerCase().includes("yr") ||
    Boolean(inputProps.name?.toLowerCase().includes("year"));

  const isDecimalDimensionOrCoord =
    id.toLowerCase().includes("length") ||
    id.toLowerCase().includes("width") ||
    id.toLowerCase().includes("panjang") ||
    id.toLowerCase().includes("lebar") ||
    id.toLowerCase().includes("gt") ||
    id.toLowerCase().includes("tonnage") ||
    id.toLowerCase().includes("lat") ||
    id.toLowerCase().includes("lng") ||
    id.toLowerCase().includes("coord") ||
    Boolean(inputProps.name?.toLowerCase().includes("length")) ||
    Boolean(inputProps.name?.toLowerCase().includes("width")) ||
    Boolean(inputProps.name?.toLowerCase().includes("gt"));

  const shouldFormat =
    formatThousand ??
    (type === "number" && !isYearField && !isDecimalDimensionOrCoord);

  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const [uncontrolledVal, setUncontrolledVal] = useState(() =>
    defaultValue !== undefined ? String(defaultValue) : "",
  );

  const rawCurrentValue = isControlled ? value : uncontrolledVal;
  const displayValue = shouldFormat
    ? formatThousandInput(rawCurrentValue as string | number)
    : (rawCurrentValue ?? "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!shouldFormat) {
      if (!isControlled) {
        setUncontrolledVal(e.target.value);
      }
      onChange?.(e);
      return;
    }

    const rawInput = e.target.value;
    const oldCursor = e.target.selectionStart ?? rawInput.length;
    const rawVal = unformatThousandInput(rawInput);
    const newFormatted = formatThousandInput(rawInput);

    if (!isControlled) {
      setUncontrolledVal(rawVal);
    }

    requestAnimationFrame(() => {
      if (inputRef.current) {
        const nextCursor = calculateCursorPosition(
          rawInput,
          newFormatted,
          oldCursor,
        );
        inputRef.current.setSelectionRange(nextCursor, nextCursor);
      }
    });

    onChange?.({
      target: {
        value: rawVal,
        name: inputProps.name,
      },
    });
  };

  return (
    <FormField
      label={label}
      htmlFor={id}
      hint={hint}
      required={required}
      optional={optional}
    >
      <input
        ref={inputRef}
        id={id}
        required={required}
        type={shouldFormat ? "text" : type}
        inputMode={shouldFormat ? "decimal" : inputProps.inputMode}
        value={displayValue}
        onChange={handleChange}
        className={`w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl px-3.5 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...inputProps}
      />
    </FormField>
  );
}
