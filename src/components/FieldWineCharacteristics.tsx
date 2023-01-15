import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Text,
} from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';
import { WineCharacteristic } from '@prisma/client';

import { Badge, BadgeType } from './Badge';

export type FieldWineCharacteristicsType = FieldProps & {
    items: WineCharacteristic[];
    label?: string;
    isDisabled?: boolean;
    badgeProps?: BadgeType;
};

export const FieldWineCharacteristics: React.FC<
    FieldProps & FieldWineCharacteristicsType
> = (props) => {
    const { errorMessage, isSubmitted, isValid, setValue, value } =
        useField(props);
    const { badgeProps, isDisabled, items, label, required, ...otherProps } =
        props;

    const handleClick = (id: string) => {
        const index = (Array.isArray(value) ? value : [value]).findIndex(
            (item) => item === id
        );
        if (index === -1) {
            setValue([...(value || []), id]);
        } else {
            const selectedItems = [...value];
            selectedItems.splice(index, 1);
            setValue(selectedItems);
        }
    };

    return (
        <FormControl
            isRequired={!!required}
            isInvalid={isSubmitted && !isValid}
            isDisabled={isDisabled}
        >
            <FormLabel fontSize="sm">{label}</FormLabel>
            <Box display="inline" {...otherProps}>
                {items.map((item) => (
                    <Badge
                        key={item.id}
                        leftIcon={<Text>{item.icon}</Text>}
                        onClick={() => handleClick(item.id)}
                        my="1"
                        mr="1"
                        {...badgeProps}
                    >
                        {item.name}
                    </Badge>
                ))}
            </Box>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
    );
};
