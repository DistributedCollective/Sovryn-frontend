import React from 'react';
import styled from 'styled-components/macro';

export const PageSkeleton: React.FC = () => (
  <div className="tw-container tw-flex tw-flex-col tw-flex-1 tw-justify-center">
    <div className="tw-container tw-mx-auto tw-px-4 tw-py-4">
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
        <div className="tw-col-span-4">
          <Skeleton />
        </div>
        <div className="tw-col-span-6">
          <Skeleton />
        </div>
        <div className="tw-col-span-2">
          <Skeleton />
        </div>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
        <div className="tw-col-span-2">
          <Skeleton />
        </div>
        <div className="tw-col-span-2">
          <Skeleton />
        </div>
        <div className="tw-col-span-3">
          <Skeleton />
        </div>
        <div className="tw-col-span-5">
          <Skeleton />
        </div>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
        <div className="tw-col-span-6 lg:tw-col-span-4">
          <Skeleton height="100%" />
        </div>
        <div className="tw-col-span-6 lg:tw-col-span-8">
          <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
            <div className="tw-col-span-2">
              <Skeleton />
            </div>
            <div className="tw-col-span-2">
              <Skeleton />
            </div>
            <div className="tw-col-span-3">
              <Skeleton />
            </div>
            <div className="tw-col-span-5">
              <Skeleton />
            </div>
          </div>
          <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
            <div className="tw-col-span-2">
              <Skeleton />
            </div>
            <div className="tw-col-span-2">
              <Skeleton />
            </div>
            <div className="tw-col-span-3">
              <Skeleton />
            </div>
            <div className="tw-col-span-5">
              <Skeleton />
            </div>
          </div>
          <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
            <div className="tw-col-span-2">
              <Skeleton />
            </div>
            <div className="tw-col-span-2">
              <Skeleton />
            </div>
            <div className="tw-col-span-3">
              <Skeleton />
            </div>
            <div className="tw-col-span-5">
              <Skeleton />
            </div>
          </div>
          <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12">
            <div className="tw-col-span-2">
              <Skeleton />
            </div>
            <div className="tw-col-span-2">
              <Skeleton />
            </div>
            <div className="tw-col-span-3">
              <Skeleton />
            </div>
            <div className="tw-col-span-5">
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
        <div className="tw-col-span-4">
          <Skeleton />
        </div>
        <div className="tw-col-span-6">
          <Skeleton />
        </div>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-mb-4">
        <div className="tw-col-span-6">
          <Skeleton />
        </div>
      </div>
    </div>
  </div>
);

interface ComponentSkeletonProps {
  lines?: number;
}
export const ComponentSkeleton: React.FC<ComponentSkeletonProps> = ({
  lines = 1,
}) => (
  <div className="tw-container tw-mx-auto tw-px-4">
    {Array(lines).map((_, index) => (
      <div
        className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-my-4"
        key={index}
      >
        {index % 2 !== 0 && (
          <>
            <div className="tw-col-span-4">
              <Skeleton />
            </div>
            <div className="tw-col-span-8">
              <Skeleton />
            </div>
          </>
        )}
        {index % 2 === 0 && (
          <>
            <div className="tw-col-span-3">
              <Skeleton />
            </div>
            <div className="tw-col-span-6">
              <Skeleton />
            </div>
          </>
        )}
      </div>
    ))}
  </div>
);

interface SkeletonProps {
  width?: string;
  height?: string;
  inline?: boolean;
}

export const Skeleton = styled.div.attrs(props => ({
  className: 'bp3-skeleton',
}))`
  width: ${(props: SkeletonProps) => (props.width ? props.width : '100%')};
  height: ${(props: SkeletonProps) => (props.height ? props.height : '16px')};
  display: ${(props: SkeletonProps) =>
    props.inline ? 'inline-block' : 'block'};
  margin: 5px;
`;
