import React, { Fragment, useRef, useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import SidebarHeading from '../../atoms/headings/SidebarHeading/index';

import { themeColors, grayScaleColors, utilityColors } from './colors.json';

import './styles.css';

const Color = ({ color, value, name }) => {
  return (
    <li style={{ width: 300, margin: 10, padding: 10 }}>
      <h3 className="ma__sidebar-heading">{color}</h3>
      <div className="sg-swatch" style={{ background: value, borderRadius: 0 }} />
      <div className="sg-info">
        <span>{value}</span>
        <br />
        <code style={{ fontSize: '1rem' }}>{name}</code>
      </div>
    </li>
  );
};

const GradientTile = ({ color, name, index }) => {
  const colorRef = useRef(null);
  const [rgb, setRgb] = useState('');
  useEffect(() => {
    const computedStyles = window.getComputedStyle(colorRef.current).getPropertyValue('background-color');
    setRgb(() => computedStyles);
  });
  const hex = (x) => `0 ${parseInt(x, 10).toString(16)}`.slice(-2);
  const rgbToHex = (rgbVal) => {
    const rgbValues = rgbVal && rgbVal.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const hexValue = rgbValues && `#${hex(rgbValues[1])}${hex(rgbValues[2])}${hex(rgbValues[3])}`;
    return hexValue;
  };
  return(
    <li className={`${name}--tint`}>
      <h3 className="ma__sidebar-heading">{`${color} ${index * 10} %`}</h3>
      <div className="sg-swatch" ref={colorRef} />
      <div className="sg-info">
        <span>{rgbToHex(rgb)}</span>
        <br />
        <code style={{ fontSize: '1rem' }}>{`${name}-${index * 10}`}</code>
      </div>
    </li>
  );
};

const GradientSpectrum = ({ name, color }) => {
  const tiles = 10;
  let i;
  const tilesArray = [];
  for (i = 0; i < tiles; i++) {
    tilesArray.push(i);
  }
  return(
    <ul className="sg-colors">
      {
        tilesArray.map((index) => <GradientTile color={color} name={name} index={index} />)
      }
    </ul>
  );
};

storiesOf('base/colors', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add('Colors', (() => (
    <Fragment>
      <SidebarHeading title="Theme Colors" level={2} />
      <ul className="sg-colors">
        {
          themeColors.map((color) => <Color {...color} />)
        }
      </ul>
      <SidebarHeading title="Gray Scale Colors" level={2} />
      <ul className="sg-colors">
        {
          grayScaleColors.map((color) => <Color {...color} />)
        }
      </ul>
      <SidebarHeading title="Utility Colors" level={2} />
      <ul className="sg-colors">
        {
          utilityColors.map((color) => <Color {...color} />)
        }
      </ul>
    </Fragment>
  )))
  .add('Gradients', (() => (
    <Fragment>
      <GradientSpectrum name="c-primary" color="Bay Blue" />
      <GradientSpectrum name="c-primary-alt" color="" />
      <GradientSpectrum name="c-highlight" color="" />
      <GradientSpectrum name="c-independence-cranberry" color="" />
      <GradientSpectrum name="c-gray-dark" color="" />
    </Fragment>
  )));
