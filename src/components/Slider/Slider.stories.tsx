import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Slider } from './';

export default {
    title: 'Slider',
    component: Slider,
} as ComponentMeta<typeof Slider>;

const Slider_Story: ComponentStory<typeof Slider> = (args) => (
    <Slider {...args} />
);

const sliderArgs: Object = {
    ariaLabel: 'Slider',
    autoFocus: false,
    className: 'my-slider',
    disabled: false,
    id: 'mySliderId',
    min: 100,
    max: 200,
    name: 'mySlider',
    onChange: (value: number | number[]) => {
        console.log(value);
    },
};

export const StandardSlider = Slider_Story.bind({});
StandardSlider.args = {
    ...sliderArgs,
    autoFocus: true,
    min: 1,
    max: 5,
    showLabels: false,
    value: 2,
};

export const RangeSlider = Slider_Story.bind({});
RangeSlider.args = {
    ...sliderArgs,
    min: 0,
    showLabels: true,
    showMarkers: true,
    step: 10,
    value: [110, 150],
};
