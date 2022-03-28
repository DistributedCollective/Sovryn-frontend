import React, { useMemo } from 'react';
import { Breakpoint, BreakpointWidths } from 'types/tailwind';

type SourceProps = {
  imageSrc: string;
  density?: number;
  width?: number;
};

type Sources = {
  src: string | SourceProps[];
  media?: Breakpoint;
};

type PictureProps = {
  src: string;
  srcSet?: Sources[];
  alt?: string;
  className?: string;
};

export const Picture: React.FC<PictureProps> = ({
  src,
  srcSet,
  alt = 'image',
  className,
}) => {
  const renderSources = useMemo(() => {
    if (!srcSet) {
      return null;
    }
    const mappedSources = srcSet.map((source, index) => {
      let src = source.src;
      if (typeof src !== 'string') {
        const sourceArray = src.map(
          source =>
            `${source.imageSrc} ${
              source.width ? `${source.width}w` : `${source.density}x`
            }`,
        );
        src = sourceArray.join(', ');
      }
      return (
        <source
          key={`source-${index}`}
          srcSet={src}
          media={
            source.media && `(max-width: ${BreakpointWidths[source.media]}px)`
          }
        />
      );
    });

    return mappedSources;
  }, [srcSet]);

  return (
    <div className={className}>
      <picture>
        {renderSources}
        <img className="tw-max-w-full" src={src} alt={alt} />
      </picture>
    </div>
  );
};
