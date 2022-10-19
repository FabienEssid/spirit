import React from 'react';

import { FieldProps, useField } from '@formiz/core';

export const FieldInput: React.FC<
    FieldProps &
        Pick<HTMLInputElement, 'type'> & {
            id?: HTMLInputElement['id'];
            className?: HTMLInputElement['className'];
            disabled?: HTMLInputElement['disabled'];
            required?: HTMLInputElement['required'];
        }
> = (props) => {
    const { value, setValue } = useField(props);

    const {
        type = 'text',
        id = undefined,
        disabled = false,
        required = false,
        className = undefined,
        defaultValue,
        ...otherProps
    } = props;

    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    return (
        <div>
            <input
                {...(id ? { id } : {})}
                type={type}
                className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 border-gray-300 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-primary-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed sm:text-sm ${
                    className || ''
                }`}
                onChange={handleChange}
                value={value || ''}
                disabled={disabled}
                required={required}
                {...otherProps}
            />
        </div>
    );
};
