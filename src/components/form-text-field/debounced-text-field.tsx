import { useRef, useState } from "react";
import { BaseTextField, type BaseTextFieldProps } from "./base-text-field";

type DebouncedTextFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    testID: string;
} & Omit<BaseTextFieldProps, 'onChange' | 'value'>;

export const DebouncedTextField = ({ label, value, onChange, testID, ...props }: DebouncedTextFieldProps) => {
    const timeoutId = useRef<number | null>(null);
    const [inputValue, setInputValue] = useState(value);

    const debouncedOnChange = (value: string) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        setInputValue(value);
        timeoutId.current = window.setTimeout(() => {
            onChange(value);
        }, 300);
    }

    return (
        <BaseTextField
            label={label}
            value={inputValue}
            onChange={debouncedOnChange}
            testID={testID}
            {...props}
        />
    );
}