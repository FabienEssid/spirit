import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    Box,
    Center,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Icon,
    IconButton,
    Input,
    InputProps,
    Text,
} from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

import { useDownloadMedia, useUploadMedia } from '@/services/media';

type FieldUploadGroupContextType = {
    isWrappedByGroup: boolean;
};

type FieldUploadGroupType = PropsWithChildren & {
    label: string;
};

type FieldUploadType = FieldProps &
    InputProps & {
        label?: string;
    };

const FieldUploadGroupContext = createContext<FieldUploadGroupContextType>({
    isWrappedByGroup: false,
});

const useFieldUploadGroupContext = () => useContext(FieldUploadGroupContext);

export const FieldUploadGroup: React.FC<FieldUploadGroupType> = ({
    label,
    children,
}) => {
    return (
        <FieldUploadGroupContext.Provider value={{ isWrappedByGroup: true }}>
            <FormControl>
                <FormLabel>{label}</FormLabel>
                {children}
            </FormControl>
        </FieldUploadGroupContext.Provider>
    );
};

export const FieldUpload: React.FC<FieldUploadType> = (props) => {
    const { isWrappedByGroup } = useFieldUploadGroupContext();

    const [file, setFile] = useState<Blob | null>(null);
    const { errorMessage, isSubmitted, isValid, setValue } = useField(props);

    const {
        data: uploadedMediaResponse,
        mutate: uploadMedia,
        isLoading: isUploadLoading,
    } = useUploadMedia();
    const { data: uploadedMedia } = uploadedMediaResponse || { data: null };

    const {
        data: downloadedMediaResponse,
        mutate: downloadMedia,
        isLoading: isDownloadLoading,
    } = useDownloadMedia();
    const { data: downloadedMedia } = downloadedMediaResponse || { data: null };

    const { defaultValue, required, type, isDisabled, ...otherProps } = props;

    useEffect(() => {
        if (uploadedMedia) {
            setValue(uploadedMedia);
            downloadMedia({ mediaId: uploadedMedia.id });
        }
    }, [downloadMedia, uploadedMedia, setValue]);

    useEffect(() => {
        if (downloadedMedia) {
            setFile(downloadedMedia);
        }
    }, [downloadedMedia, setFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            uploadMedia({ media: event.target.files[0] });
        }
    };

    return (
        <FormControl
            isRequired={!!props.required}
            isInvalid={isSubmitted && !isValid}
            isDisabled={isDisabled || isUploadLoading || isDownloadLoading}
        >
            {!isWrappedByGroup && (
                <FormLabel cursor="pointer" fontSize="sm" htmlFor={props.name}>
                    {props.label}
                </FormLabel>
            )}
            <Box position="relative">
                <Input
                    display="none"
                    id={props.name}
                    type="file"
                    onChange={handleFileChange}
                    {...otherProps}
                />
                <Center
                    as="label"
                    htmlFor={props.name}
                    cursor="pointer"
                    background="white"
                    bgGradient="repeating-linear-gradient(45deg, white, white 1px, gray.50 2px, gray.50 3px)"
                    p={file ? '0' : 6}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    transition="borderColor 0.2s"
                    _hover={{ borderColor: 'gray.300' }}
                >
                    {!file ? (
                        <Text fontSize="sm">
                            <Text
                                as="span"
                                color="primary.500"
                                textDecoration="underline"
                            >
                                Add a file
                            </Text>{' '}
                            or drag one here
                        </Text>
                    ) : (
                        <Box width="100%" height="100%">
                            <Image
                                src={downloadedMedia}
                                alt="Uploaded image"
                                object-fit="cover"
                                width="100px"
                                height="100px"
                            />
                        </Box>
                    )}
                </Center>
                {file && (
                    <IconButton
                        size="xs"
                        position="absolute"
                        top="1"
                        right="1"
                        cursor="pointer"
                        aria-label="Remove media"
                        colorScheme="primary"
                        onClick={() => {
                            setFile(null);
                            setValue(null);
                        }}
                        icon={<Icon as={XMarkIcon} />}
                    />
                )}
            </Box>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
    );
};
