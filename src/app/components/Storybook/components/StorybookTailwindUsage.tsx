import React from 'react';

type StorybookTailwindUsageProps = {
  text: string | string[];
  documentationHref: string;
};

export const StorybookTailwindUsage: React.FC<StorybookTailwindUsageProps> = ({
  text,
  documentationHref,
}) => (
  <p className="tw-text-gray-8">
    <span className="tw-font-medium">Tailwind:</span>{' '}
    {Array.isArray(text) ? (
      <ul className="tw-ml-4 tw-list-disc">
        {text.map(line => (
          <li style={{ fontFamily: 'monospace' }}>{line}</li>
        ))}
      </ul>
    ) : (
      <span style={{ fontFamily: 'monospace' }}>{text}</span>
    )}{' '}
    <a
      href={documentationHref}
      className="tw-text-secondary"
      target="_blank"
      rel="noreferrer"
    >
      docs
    </a>
  </p>
);
