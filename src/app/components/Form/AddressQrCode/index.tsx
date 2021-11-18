import React, { useState } from 'react';
import { Text } from '@blueprintjs/core';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { prettyTx } from 'utils/helpers';
import cn from 'classnames';

export enum URIType {
  BITCOIN = 'bitcoin:',
}

type AddressQrCodeProps = {
  label?: string;
  address: string;
  uri?: URIType;
  hideClickToCopy?: boolean;
};

const CopySuccess = ({ copied }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'tw-absolute tw--bottom-2 tw-left-0 tw-transform tw-translate-y-full tw-border tw-border-secondary tw-text-sov-white tw-bg-secondary tw-bg-opacity-70 tw-px-6 tw-py-2 tw-text-center tw-w-full tw-transition-opacity tw-rounded-sm',
        {
          'tw-opacity-100': copied,
          'tw-opacity-0': !copied,
          'tw-invisible': !copied,
        },
      )}
    >
      {t(translations.onCopy.address)}
    </div>
  );
};

export const AddressQrCode: React.FC<AddressQrCodeProps> = ({
  label,
  address,
  uri,
  hideClickToCopy,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  return (
    <>
      <div className="tw-text-lg tw-text-sov-white tw-ml-8 tw-mb-2.5">
        {t(translations.fastBtcDialog.qr.title)}
      </div>
      <div className="tw-qrcode-container">
        {label && <div className="tw-qrcode-label">{label}</div>}
        <div className="tw-qrcode-wrapper">
          <QRCode
            value={`${uri || ''}${address}`}
            renderAs="svg"
            bgColor="var(--white)"
            fgColor="var(--gray-1)"
            includeMargin={false}
            className="rounded"
          />
        </div>
        {!hideClickToCopy && (
          <div className="tw-qrcode-clipboard">
            <CopySuccess copied={copied} />
            <CopyToClipboard
              text={address}
              onCopy={() => {
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            >
              <div className="tw-qrcode-address-wrapper">
                <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-w-full">
                  <div className="tw-flex-shrink tw-flex-grow-0 tw-overflow-hidden tw-text-sov-white">
                    <Text ellipsize>
                      {address.length > 0 ? (
                        <>{prettyTx(address, 15, 12)}</>
                      ) : (
                        <>{t(translations.fastBtcDialog.qr.generating)}</>
                      )}
                    </Text>
                  </div>
                  <div className="tw-flex-shrink-0 tw-flex-grow-0 tw-ml-4">
                    <svg
                      id="content_copy-24px"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                    >
                      <path
                        id="Path_11"
                        data-name="Path 11"
                        d="M0,0H20V20H0Z"
                        fill="none"
                      />
                      <path
                        id="Path_12"
                        data-name="Path 12"
                        d="M13.053,1H3.579A1.613,1.613,0,0,0,2,2.636V14.091H3.579V2.636h9.474Zm2.368,3.273H6.737A1.613,1.613,0,0,0,5.158,5.909V17.364A1.613,1.613,0,0,0,6.737,19h8.684A1.613,1.613,0,0,0,17,17.364V5.909A1.613,1.613,0,0,0,15.421,4.273Zm0,13.091H6.737V5.909h8.684Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </CopyToClipboard>
          </div>
        )}
      </div>
    </>
  );
};
