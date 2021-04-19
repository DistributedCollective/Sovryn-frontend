import React from 'react';
import { Text } from '@blueprintjs/core';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { toastSuccess } from 'utils/toaster';
import { translations } from 'locales/i18n';
import styles from './index.module.css';

export enum URIType {
  BITCOIN = 'bitcoin:',
}

interface Props {
  address: string;
  uri?: URIType;
  hideClickToCopy?: boolean;
}

export function AddressQrCode({ address, uri, hideClickToCopy }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.qrCodeContainer}>
        <QRCode
          value={`${uri || ''}${address}`}
          renderAs="svg"
          bgColor="var(--white)"
          fgColor="var(--primary)"
          includeMargin={true}
          className="rounded w-75 h-75"
        />
      </div>
      {!hideClickToCopy && (
        <CopyToClipboard
          text={address}
          onCopy={() =>
            toastSuccess(<>{t(translations.onCopy.address)}</>, 'copy')
          }
        >
          <div className={styles.addressWrapper}>
            <div className="d-flex flex-row justify-content-between align-items-center w-100">
              <div className="flex-shrink-1 flex-grow-0 overflow-hidden">
                <Text ellipsize>{address}</Text>
              </div>
              <div className="flex-shrink-0 flex-grow-0 ml-3">
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
                    fill="#2274a5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </CopyToClipboard>
      )}
    </>
  );
}
