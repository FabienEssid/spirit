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
import { isAppRunningOnMobile } from '@/utils/functions/global';

import { Loading } from './Loading';

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
                <FormLabel fontSize="sm">{label}</FormLabel>
                {children}
            </FormControl>
        </FieldUploadGroupContext.Provider>
    );
};

export const FieldUpload: React.FC<FieldUploadType> = (props) => {
    const { isWrappedByGroup } = useFieldUploadGroupContext();

    const [file, setFile] = useState<string | null>(null);
    const { errorMessage, isSubmitted, isValid, setValue, value } =
        useField(props);

    const {
        data: uploadedMediaResponse,
        mutate: uploadMedia,
        isLoading: isUploadLoading,
    } = useUploadMedia();
    const { data: { id: uploadedMedia } = { id: undefined } } =
        uploadedMediaResponse || {
            data: { id: value },
        };

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
            downloadMedia({ mediaId: uploadedMedia });
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

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files?.[0]) {
            uploadMedia({ media: event.dataTransfer.files[0] });
        }
    };

    const handleFileDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const isLoading = isUploadLoading || isDownloadLoading;

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
            <Box
                position="relative"
                onDrop={handleFileDrop}
                onDragOver={handleFileDragOver}
            >
                <Input
                    display="none"
                    id={props.name}
                    type="file"
                    onChange={handleFileChange}
                    isDisabled={isDisabled}
                    {...otherProps}
                />
                <Center
                    as="label"
                    htmlFor={props.name}
                    cursor={isDisabled ? 'not-allowed' : 'pointer'}
                    background="white"
                    bgGradient="repeating-linear-gradient(45deg, white, white 1px, gray.50 2px, gray.50 3px)"
                    p={file ? '0' : 6}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    transition="borderColor 0.2s"
                    {...(!isDisabled
                        ? {
                              _hover: { borderColor: 'gray.300' },
                          }
                        : {})}
                >
                    {!isLoading && !file ? (
                        isAppRunningOnMobile() ? (
                            <Text fontSize="sm" opacity={isDisabled ? 0.6 : 1}>
                                Add a file or take one using your camera
                            </Text>
                        ) : (
                            <Text fontSize="sm" opacity={isDisabled ? 0.6 : 1}>
                                <Text
                                    as="span"
                                    color="primary.500"
                                    _hover={{ textDecoration: 'underline' }}
                                >
                                    Add a file
                                </Text>{' '}
                                or drag one here
                            </Text>
                        )
                    ) : isLoading ? (
                        <Loading color="primary.500" />
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
                        isDisabled={isDisabled}
                        icon={<Icon as={XMarkIcon} />}
                    />
                )}
            </Box>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
    );
};
