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
      <div className="tw-container tw-mx-auto tw-px-4 py-3">
        <div className="row tw-mb-3">
          <div className="col-4">
            <Skeleton />
          </div>
          <div className="col-6">
            <Skeleton />
          </div>
          <div className="col-2">
            <Skeleton />
          </div>
        </div>
        <div className="row tw-mb-3">
          <div className="col-2">
            <Skeleton />
          </div>
          <div className="col-2">
            <Skeleton />
          </div>
          <div className="col-3">
            <Skeleton />
          </div>
          <div className="col-5">
            <Skeleton />
          </div>
        </div>
        <div className="row tw-mb-3">
          <div className="col-6 col-lg-4">
            <Skeleton height="100%" />
          </div>
          <div className="col-6 col-lg-8">
            <div className="row tw-mb-3">
              <div className="col-2">
                <Skeleton />
              </div>
              <div className="col-2">
                <Skeleton />
              </div>
              <div className="col-3">
                <Skeleton />
              </div>
              <div className="col-5">
                <Skeleton />
              </div>
            </div>
            <div className="row tw-mb-3">
              <div className="col-2">
                <Skeleton />
              </div>
              <div className="col-2">
                <Skeleton />
              </div>
              <div className="col-3">
                <Skeleton />
              </div>
              <div className="col-5">
                <Skeleton />
              </div>
            </div>
            <div className="row tw-mb-3">
              <div className="col-2">
                <Skeleton />
              </div>
              <div className="col-2">
                <Skeleton />
              </div>
              <div className="col-3">
                <Skeleton />
              </div>
              <div className="col-5">
                <Skeleton />
              </div>
            </div>
            <div className="row">
              <div className="col-2">
                <Skeleton />
              </div>
              <div className="col-2">
                <Skeleton />
              </div>
              <div className="col-3">
                <Skeleton />
              </div>
              <div className="col-5">
                <Skeleton />
              </div>
            </div>
          </div>
        </div>
        <div className="row tw-mb-3">
          <div className="col-4">
            <Skeleton />
          </div>
          <div className="col-6">
            <Skeleton />
          </div>
        </div>
        <div className="row tw-mb-3">
          <div className="col-6">
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
        <div className="row my-3" key={index}>
          {index % 2 !== 0 && (
            <>
              <div className="col-4">
                <Skeleton />
              </div>
              <div className="col-8">
                <Skeleton />
              </div>
            </>
          )}
          {index % 2 === 0 && (
            <>
              <div className="col-3">
                <Skeleton />
              </div>
              <div className="col-6">
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
