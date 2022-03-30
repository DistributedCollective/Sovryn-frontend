import React from 'react';
import { H3 } from '../../Heading';
import classNames from 'classnames';

type StorybookTextSampleProps = {
  className?: string;
  sampleClassName?: string;
  label?: string;
  value?: number | string;
  textLength?: number;
};

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat, odio vel convallis cursus, massa tellus tincidunt dui, eget sollicitudin odio purus sed magna. Quisque tempus tortor in porttitor cursus. Vestibulum non dui feugiat, dictum nisl vel, bibendum nunc. Sed eu risus maximus, consectetur nisi eu, rhoncus risus. Donec facilisis ipsum in tempor placerat. Mauris pulvinar diam at nulla hendrerit tempus. Vivamus eu vulputate nibh. Nullam elementum massa enim. Sed porttitor, ipsum et laoreet vestibulum, ante ipsum faucibus quam, vel ultrices leo tortor sit amet purus. Nam dignissim mi a lectus feugiat, sit amet auctor elit porttitor. Pellentesque ut lectus viverra, faucibus dolor dignissim, bibendum turpis. Pellentesque malesuada pharetra justo sed finibus. Sed porttitor leo eu dapibus commodo. Cras in suscipit est, a varius nisl.';

export const StorybookTextSample: React.FC<StorybookTextSampleProps> = ({
  className,
  sampleClassName: textClassName,
  label,
  value,
  textLength = 50,
}) => (
  <div className={classNames('tw-mb-4', className)}>
    <H3>
      {label} – <em>{value}</em>
    </H3>
    <p className={classNames('tw-mr-8', textClassName)}>
      {lorem.slice(0, textLength)}
    </p>
  </div>
);
