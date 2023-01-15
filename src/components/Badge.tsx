import { useState } from 'react';

import { Button, ButtonProps, Text } from '@chakra-ui/react';

export type BadgeType = ButtonProps & {
    isDefaultSelected?: boolean;
};

export const Badge: React.FC<BadgeType> = ({
    onClick = () => {},
    isDefaultSelected = false,
    ...otherProps
}) => {
    const [isSelected, setIsSelected] = useState<boolean>(isDefaultSelected);

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
