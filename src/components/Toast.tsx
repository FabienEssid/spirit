import { ToastProps, useBreakpointValue, useToast } from '@chakra-ui/react';

export const useToastError = () => {
    const isOnResponsiveMode = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    return (params: ToastProps) =>
        toast({
            isClosable: true,
            duration: 3000,
            position: isOnResponsiveMode ? 'top' : 'top-right',
            ...params,
            status: 'error',
        });
};

export const useToastInfo = () => {
    const isOnResponsiveMode = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    return (params: ToastProps) =>
        toast({
            isClosable: true,
            duration: 3000,
            position: isOnResponsiveMode ? 'top' : 'top-right',
            ...params,
            status: 'info',
        });
};

export const useToastLoading = () => {
    const isOnResponsiveMode = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    return (params: ToastProps) =>
        toast({
            isClosable: true,
            duration: 3000,
            position: isOnResponsiveMode ? 'top' : 'top-right',
            ...params,
            status: 'loading',
        });
};

export const useToastSuccess = () => {
    const isOnResponsiveMode = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    return (params: ToastProps) =>
        toast({
            isClosable: true,
            duration: 3000,
            position: isOnResponsiveMode ? 'top' : 'top-right',
            ...params,
            status: 'success',
        });
};

export const useToastWarning = () => {
    const isOnResponsiveMode = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    return (params: ToastProps) =>
        toast({
            isClosable: true,
            duration: 3000,
            position: isOnResponsiveMode ? 'top' : 'top-right',
            ...params,
            status: 'warning',
        });
};
