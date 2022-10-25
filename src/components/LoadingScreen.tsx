import { Container } from '@chakra-ui/react';

import { Loading, LoadingType } from './Loading';

export type LoadingScreenType = {
    containerProps?: LoadingType;
};

export const LoadingScreen: React.FC<LoadingScreenType> = ({
    containerProps,
    ...props
}) => {
    return (
        <Container variant="full" {...containerProps}>
            <Loading
                containerProps={{ p: '3' }}
                variant="full"
                color="primary.400"
                {...props}
            />
        </Container>
    );
};
