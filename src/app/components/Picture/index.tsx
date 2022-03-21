import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { Breakpoint, BreakpointWidths } from 'types/tailwind';

type Sources = {
  src: string;
  media: Breakpoint;
};

type PictureProps = {
  src: string;
  srcSet?: Sources[];
  title?: string;
  className?: string;
};

export const Picture: React.FC<PictureProps> = ({
  src,
  srcSet,
  title = 'image',
  className,
}) => {
  const renderSources = useMemo(() => {
    if (!srcSet) {
      return <source srcSet={src} />;
    }
    const mappedSources = srcSet.map((source, index) => {
      return (
        <source
          key={`source-${index}`}
          srcSet={source.src}
          media={`(max-width: ${BreakpointWidths[source.media]}px)`}
        />
      );
    });

    return mappedSources;
  }, [srcSet, src]);

  return (
    <div className={classNames(styles.picture, className)}>
      <picture>
        {renderSources}
        <img src={src} alt={title} />
      </picture>
    </div>
  );
};
