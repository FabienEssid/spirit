import { ReactNode } from 'react';

import {
    Button,
    ButtonProps,
    Link as ChakraLink,
    LinkOverlayProps,
} from '@chakra-ui/react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';

export type LinkProps = {
    buttonProps?: LinkOverlayProps & ButtonProps;
    isCurrentLocationProps?: LinkOverlayProps & ButtonProps;
    children: ReactNode;
};

export const Link: React.FC<NextLinkProps & LinkProps> = ({
    buttonProps,
    isCurrentLocationProps,
    children,
    href,
    ...props
}) => {
    const router = useRouter();
    const { pathname } = router;
    const isCurrentLocation = pathname === href;

    return (
        <NextLink passHref href={href} {...props}>
            <Button
                as={ChakraLink}
                variant={isCurrentLocation ? 'solid' : 'ghost'}
                {...buttonProps}
                {...(isCurrentLocation ? isCurrentLocationProps : {})}
            >
                {children}
            </Button>
        </NextLink>
    );
};
