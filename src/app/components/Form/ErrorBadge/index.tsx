import React from 'react';

interface Props {
  content: React.ReactNode;
}

export function ErrorBadge(props: Props) {
  return (
    <div className="tw-py-4 tw-my-3 tw-text-xs tw-text-red">
      {props.content}
    </div>
  );
}
