import React from 'react';

import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

export const FieldInput: React.FC<
    FieldProps & InputProps & { label: string }
> = (props) => {
    const { value, setValue } = useField(props);

    const { defaultValue, required, ...otherProps } = props;

    const handleChange = (e: any) => {
        setValue(e.target.value);
    };

    return (
        <FormControl isRequired={!!props.required}>
            <FormLabel fontSize="sm" htmlFor={props.name}>
                {props.label}
            </FormLabel>
            <Input
                onChange={handleChange}
                value={value || ''}
                {...otherProps}
            />
        </FormControl>
    );
};
