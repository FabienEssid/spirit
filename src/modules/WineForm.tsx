import { Button, HStack, VStack } from '@chakra-ui/react';
import { FormProps, Formiz } from '@formiz/core';

import {
    FieldInput,
    FieldRadio,
    FieldSlider,
    FieldUpload,
    FieldUploadGroup,
    Loading,
} from '@/components';
import { FALSE, TRUE } from '@/utils/constants/global';

type WineFormType = Pick<
    FormProps,
    | 'connect'
    | 'onValidSubmit'
    | 'onInvalidSubmit'
    | 'onSubmit'
    | 'initialValues'
> & {
    isLoading: boolean;
    isReadOnly?: boolean;
};

export const WineForm: React.FC<WineFormType> = ({
    onValidSubmit: handleValidSubmit,
    onInvalidSubmit: handleInvalidSubmit,
    onSubmit: handleSubmit,
    connect: form,
    initialValues,
    isLoading,
    isReadOnly,
}) => {
    const shouldDisableSubmitButton =
        (form.isSubmitted && !form.isValid) || isLoading;

    return (
        <Formiz
            autoForm
            initialValues={initialValues}
            onValidSubmit={handleValidSubmit}
            onInvalidSubmit={handleInvalidSubmit}
            onSubmit={handleSubmit}
            connect={form}
        >
            <VStack mt="4" spacing="4" alignItems="stretch">
                <FieldInput
                    name="name"
                    label="Name"
                    required="The name is required"
                    isDisabled={isReadOnly}
                />
                <FieldInput
                    type="textarea"
                    name="description"
                    label="Description"
                    isDisabled={isReadOnly}
                />
                <FieldUploadGroup label="Media">
                    <HStack spacing="2">
                        <FieldUpload name="medias[0]" isDisabled={isReadOnly} />
                        <FieldUpload name="medias[1]" isDisabled={isReadOnly} />
                        <FieldUpload name="medias[2]" isDisabled={isReadOnly} />
                    </HStack>
                </FieldUploadGroup>
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
                    isDisabled={isReadOnly}
                />
                <FieldRadio
                    name="isPinned"
                    label="Do you want to pin this wine ?"
                    as={VStack}
                    alignItems="flex-start"
                    colorScheme="primary"
                    options={[
                        { value: TRUE, label: 'Yes' },
                        { value: FALSE, label: 'No' },
                    ]}
                    defaultValue={FALSE}
                    isDisabled={isReadOnly}
                />

                {!isReadOnly && (
                    <Button
                        type="submit"
                        colorScheme="primary"
                        isDisabled={shouldDisableSubmitButton}
                    >
                        {isLoading && <Loading size="sm" mr="2" />}
                        Add
                    </Button>
                )}
            </VStack>
        </Formiz>
    );
};
