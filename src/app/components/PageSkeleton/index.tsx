/**
 *
 * LendingPage
 *
 */

import React from 'react';
import styled from 'styled-components/macro';

export function PageSkeleton() {
  return (
    <>
      <div className="tw-container tw-mx-auto tw-px-4 tw-py-4">
        <div className="tw-grid tw-grid-cols-12 tw-mb-4">
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
        <div className="tw-grid tw-grid-cols-12 tw-mb-4">
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
        <div className="tw-grid tw-grid-cols-12 tw-mb-4">
          <div className="tw-col-span-6 lg:tw-col-span-4">
            <Skeleton height="100%" />
          </div>
          <div className="tw-col-span-6 lg:tw-col-span-8">
            <div className="tw-grid tw-grid-cols-12 tw-mb-4">
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
            <div className="tw-grid tw-grid-cols-12 tw-mb-4">
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
            <div className="tw-grid tw-grid-cols-12 tw-mb-4">
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
            <div className="tw-grid tw-grid-cols-12">
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
        <div className="tw-grid tw-grid-cols-12 tw-mb-4">
          <div className="tw-col-span-4">
            <Skeleton />
          </div>
          <div className="tw-col-span-6">
            <Skeleton />
          </div>
        </div>
        <div className="tw-grid tw-grid-cols-12 tw-mb-4">
          <div className="tw-col-span-6">
            <Skeleton />
          </div>
        </div>
      </div>
    </>
  );
}

interface Props {
  lines: number;
}
export function ComponentSkeleton({ lines }: Props) {
  return (
    <div className="tw-container tw-mx-auto tw-px-4">
      {Array(lines).map((_, index) => (
        <div className="tw-grid tw-grid-cols-12 tw-my-4" key={index}>
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
}

ComponentSkeleton.defaultProps = {
  lines: 1,
};

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
