import React from 'react';

import {
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    Text,
} from '@chakra-ui/react';
import type { RadioGroupProps, RadioProps } from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

export type FieldRadioType = {
    options: (RadioProps & { label: string })[];
};

export const FieldRadio: React.FC<
    FieldProps &
        Omit<RadioGroupProps, 'children'> &
        FieldRadioType & { label: string }
> = (props) => {
    const { value, setValue } = useField(props);

    const { defaultValue, required, options, label, name, ...otherProps } =
        props;

    const handleChange = (value: string | number) => {
        setValue(value);
    };

    return (
        <FormControl isRequired={!!required}>
            <FormLabel fontSize="sm" htmlFor={name}>
                {label}
            </FormLabel>
            <RadioGroup onChange={handleChange} value={value} {...otherProps}>
                {(options || []).map(({ value, label, ...otherRadioProps }) => (
                    <Radio key={value} value={value} {...otherRadioProps}>
                        <Text fontSize="sm">{label}</Text>
                    </Radio>
                ))}
            </RadioGroup>
        </FormControl>
    );
};
