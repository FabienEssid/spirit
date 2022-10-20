import { Center, CenterProps, Spinner, SpinnerProps } from '@chakra-ui/react';

export type LoadingType = {
    variant?: 'full';
    containerProps?: CenterProps;
};

export const Loading: React.FC<SpinnerProps & LoadingType> = ({
    variant,
    containerProps,
    ...props
}) => {
    if (variant === 'full') {
        return (
            <Center
                width="full"
                height="full"
                display="flex"
                justifyContent="center"
                alignItems="center"
                {...containerProps}
            >
                <Spinner {...props} />
            </Center>
        );
    }

    return <Spinner {...props} />;
};
