/**
 *
 * LendingPage
 *
 */

import React from 'react';
import styled from 'styled-components';
import { Footer } from '../Footer';
import { Header } from '../Header';

export function PageSkeleton() {
  return (
    <>
      <Header />
      <div className="container py-3">
        <div className="row mb-3">
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
        <div className="row mb-3">
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
        <div className="row mb-3">
          <div className="col-lg-4">
            <Skeleton height="100%" />
          </div>
          <div className="col-lg-8">
            <div className="row mb-3">
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
            <div className="row mb-3">
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
            <div className="row mb-3">
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
        <div className="row mb-3">
          <div className="col-4">
            <Skeleton />
          </div>
          <div className="col-6">
            <Skeleton />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <Skeleton />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

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
