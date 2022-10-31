import React from 'react';

import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Textarea,
} from '@chakra-ui/react';
import type { InputProps, TextareaProps } from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

export const FieldInput: React.FC<
    FieldProps & InputProps & TextareaProps & { label: string }
> = (props) => {
    const { value, setValue, errorMessage, isSubmitted, isValid } =
        useField(props);

    const { defaultValue, required, type, ...otherProps } = props;

    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    return (
        <FormControl
            isRequired={!!props.required}
            isInvalid={isSubmitted && !isValid}
        >
            <FormLabel fontSize="sm" htmlFor={props.name}>
                {props.label}
            </FormLabel>
            {type === 'textarea' ? (
                <Textarea
                    onChange={handleChange}
                    value={value || ''}
                    {...otherProps}
                />
            ) : (
                <Input
                    type="text"
                    onChange={handleChange}
                    value={value || ''}
                    {...otherProps}
                />
            )}
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
    );
};
