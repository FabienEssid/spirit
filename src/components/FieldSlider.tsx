import React from 'react';

import {
    BoxProps,
    FormControl,
    FormLabel,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
} from '@chakra-ui/react';
import type { SliderMarkProps, SliderProps } from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

export type FieldSliderType = {
    sliderMarks?: (SliderMarkProps & { label: string })[];
    sliderMarksProps?: BoxProps;
};

export const FieldSlider: React.FC<
    FieldProps & SliderProps & FieldSliderType & { label: string }
> = (props) => {
    const { value, setValue } = useField(props);

    const {
        defaultValue,
        required,
        sliderMarks,
        sliderMarksProps,
        ...otherProps
    } = props;

    const handleChange = (value: number) => {
        // console.log({ e });
        setValue(value);
    };

    return (
        <FormControl isRequired={!!props.required}>
            <FormLabel fontSize="sm" htmlFor={props.name}>
                {props.label}
            </FormLabel>
            <Slider onChange={handleChange} value={value || 0} {...otherProps}>
                {(sliderMarks || []).map(
                    ({ value, label, ...sliderMarkOtherProps }) => (
                        <SliderMark
                            key={value}
                            value={value}
                            {...sliderMarksProps}
                            {...sliderMarkOtherProps}
                        >
                            {label}
                        </SliderMark>
                    )
                )}
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </FormControl>
    );
};
