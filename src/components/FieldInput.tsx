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

type FieldInputType = FieldProps &
    InputProps &
    TextareaProps & {
        label: string;
    };

export const FieldInput: React.FC<FieldInputType> = (props) => {
    const { value, setValue, errorMessage, isSubmitted, isValid } =
        useField(props);

    const { required, type, isDisabled, ...otherProps } = props;

    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    return (
        <FormControl
            isRequired={!!props.required}
            isInvalid={isSubmitted && !isValid}
            isDisabled={isDisabled}
        >
            <FormLabel cursor="pointer" fontSize="sm" htmlFor={props.name}>
                {props.label}
            </FormLabel>
            {type === 'textarea' ? (
                <Textarea
                    id={props.name}
                    onChange={handleChange}
                    value={value || ''}
                    {...otherProps}
                />
            ) : type === 'file' ? (
                <Input
                    id={props.name}
                    type="file"
                    onChange={handleChange}
                    value={value || ''}
                    {...otherProps}
                />
            ) : (
                <Input
                    id={props.name}
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
