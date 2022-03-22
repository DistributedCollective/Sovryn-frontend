import React, { useMemo } from 'react';
import { Breakpoint, BreakpointWidths } from 'types/tailwind';

type SourceProps = {
  imageSrc: string;
  density?: number;
  width?: Breakpoint;
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
      if (typeof source.src !== 'string') {
        const sourceArray = source.src.map(
          source =>
            `${source.imageSrc} ${
              source.width
                ? `${BreakpointWidths[source.width]}w`
                : `${source.density}x`
            }`,
        );
        return <source srcSet={`${sourceArray.join(', ')}`} />;
      }
      return (
        <source
          key={`source-${index}`}
          srcSet={`${source.src}`}
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
