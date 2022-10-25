import { Box, BoxProps, LayoutProps } from '@chakra-ui/react';
import Image from 'next/image';

export type LogoType = {
    containerProps?: BoxProps;
    size?: LayoutProps['w'];
};

export const Logo: React.FC<LogoType> = ({
    containerProps,
    size = 20,
    ...props
}) => {
    return (
        <Box position="relative" w={size} h={size} {...containerProps}>
            <Image src="/assets/img/logo.png" layout="fill" {...props} />
        </Box>
    );
};
