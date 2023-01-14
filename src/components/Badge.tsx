import { useState } from 'react';

import { Button, ButtonProps, Text } from '@chakra-ui/react';

export type BadgeType = ButtonProps;

export const Badge: React.FC<ButtonProps> = ({
    onClick = () => {},
    ...otherProps
}) => {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    return (
        <Button
            leftIcon={<Text>🍷</Text>}
            variant={isSelected ? 'solid' : 'outline'}
            onClick={(e) => {
                setIsSelected((previousValue) => !previousValue);
                onClick(e);
            }}
            colorScheme="primary"
            {...otherProps}
        />
    );
};
