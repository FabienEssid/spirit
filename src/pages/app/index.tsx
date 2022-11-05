import { Button, Heading, VStack } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';

import {
    Card,
    FieldInput,
    FieldRadio,
    FieldSlider,
    Loading,
    useToastError,
    useToastSuccess,
} from '@/components';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { useDownloadImage, useUploadImage } from '@/services/aws';
import { useAddWine } from '@/services/wines';
import { FALSE, TRUE } from '@/utils/constants/global';

export const PageHome = () => {
    const toastSuccess = useToastSuccess();
    const toastError = useToastError();

    const { data: imageSrc } = useDownloadImage();

    const { mutate: upload } = useUploadImage();
    const handleUploadFile = async (e: any) => {
        upload(e.target.files[0]);
    };

    const form = useForm();
    const { mutate, isLoading } = useAddWine({
        onSuccess: () => {
            form.reset();
            toastSuccess({
                title: 'Wine added',
                description: 'Wine successfully added',
            });
        },
        onError: (error) => {
            toastError({
                title: 'Error',
                description: `An error occurred. Please try again later. The error is : ${
                    error?.response?.data || 'unknown'
                }`,
            });
        },
    });

    const handleValidSubmit = (values: any) => {
        const { isFavorite, ...otherValues } = values;
        const wineToCreate = {
            ...otherValues,
            isFavorite: isFavorite === TRUE,
        };

        mutate(wineToCreate);
    };

    const shouldDisableSubmitButton =
        (form.isSubmitted && !form.isValid) || isLoading;

    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody>
                {imageSrc && <img src={imageSrc} />}
                <Card
                    flexDirection="column"
                    boxShadow={{ base: 'none', md: 'md' }}
                >
                    <Heading as="h2" size="sm">
                        Add a wine
                    </Heading>
                    <Formiz
                        autoForm
                        onValidSubmit={handleValidSubmit}
                        connect={form}
                    >
                        <VStack mt="4" spacing="4" alignItems="stretch">
                            <FieldInput
                                name="photo"
                                label="Photo"
                                type="file"
                                onChange={handleUploadFile}
                            />
                            <FieldInput
                                name="name"
                                label="Name"
                                required="The name is required"
                            />
                            <FieldInput
                                type="textarea"
                                name="description"
                                label="Description"
                            />
                            <FieldSlider
                                name="rating"
                                label="Rating"
                                min={0}
                                max={10}
                                step={1}
                                colorScheme="primary"
                                mb="4"
                                sliderMarksProps={{
                                    top: '0.75em',
                                }}
                                sliderMarks={[
                                    { value: 0, label: '0' },
                                    { value: 1, label: '1' },
                                    { value: 2, label: '2' },
                                    { value: 3, label: '3' },
                                    { value: 4, label: '4' },
                                    { value: 5, label: '5' },
                                    { value: 6, label: '6' },
                                    { value: 7, label: '7' },
                                    { value: 8, label: '8' },
                                    { value: 9, label: '9' },
                                    { value: 10, label: '10' },
                                ]}
                            />
                            <FieldRadio
                                name="isFavorite"
                                label="Is it one of your favorite ?"
                                as={VStack}
                                alignItems="flex-start"
                                colorScheme="primary"
                                options={[
                                    { value: TRUE, label: 'Yes' },
                                    { value: FALSE, label: 'No' },
                                ]}
                                defaultValue={FALSE}
                            />

                            <Button
                                type="submit"
                                colorScheme="primary"
                                isDisabled={shouldDisableSubmitButton}
                            >
                                {isLoading && <Loading size="sm" mr="2" />}
                                Add
                            </Button>
                        </VStack>
                    </Formiz>
                </Card>
            </LayoutBody>
        </Layout>
    );
};

export default PageHome;
