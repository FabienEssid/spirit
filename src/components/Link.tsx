import { ReactNode } from 'react';

import {
    Button,
    ButtonProps,
    Link as ChakraLink,
    LinkOverlayProps,
} from '@chakra-ui/react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

export type LinkProps = {
    buttonProps?: LinkOverlayProps & ButtonProps;
    children: ReactNode;
};

export const Link: React.FC<NextLinkProps & LinkProps> = ({
    buttonProps,
    children,
    ...props
}) => {
    return (
        <NextLink passHref {...props}>
            <Button
                _hover={{ textDecoration: 'none' }}
                as={ChakraLink}
                {...buttonProps}
                colorScheme="primary"
            >
                {children}
            </Button>
        </NextLink>
    );
};
