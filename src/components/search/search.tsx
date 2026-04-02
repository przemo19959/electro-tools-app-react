import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useRef, useState } from "react";

type SearchProps = {
    value: string;
    onChange: (value: string) => void;
}

export const Search = ({
    value,
    onChange
}: SearchProps) => {
    const timeoutId = useRef<number | null>(null);
    const [localValue, setLocalValue] = useState<string>(value);

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setLocalValue("");
        onChange("");
    }

    const debouncedOnChange = (value: string) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        setLocalValue(value);
        timeoutId.current = window.setTimeout(() => {
            onChange(value);
        }, 300);
    }

    return (
        <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={localValue}
            onChange={e => debouncedOnChange(e.target.value)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            {localValue && (
                                <IconButton onClick={handleClear} size="small" data-cy="search_clear_btn">
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                },
            }}
            data-cy="search_tf"
        />
    )
};
