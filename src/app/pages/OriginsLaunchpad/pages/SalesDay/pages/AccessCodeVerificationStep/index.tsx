import React, { useCallback, useState } from 'react';
import imgLargeNFT from 'assets/images/OriginsLaunchpad/FishSale/large_NFT.svg';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DialogTitle, DialogWrapper } from './styled';
import { FieldGroup } from 'app/components/FieldGroup';
import { ActionButton } from 'form/ActionButton';
import { InputField } from 'app/components/InputField';

export const AccessCodeVerificationStep: React.FC = () => {
  const { t } = useTranslation();

  const [code, setCode] = useState('');

  const handleSubmit = useCallback(
    () => console.log(`Submitting the following access code: ${code}`),
    [code],
  );

  return (
    <>
      <img src={imgLargeNFT} alt="Dialog NFT" />
      <DialogWrapper>
        <DialogTitle>
          {t(
            translations.originsLaunchpad.saleDay.accessCodeVerificationStep
              .dialogTitle,
            { token: 'FISH' },
          )}
        </DialogTitle>
        <div className="tw-text-xl tw-font-thin tw-mb-16">
          {t(
            translations.originsLaunchpad.saleDay.accessCodeVerificationStep
              .instructions,
          )}
        </div>

        <div className="tw-max-w-20rem tw-mx-auto">
          <FieldGroup
            label={`${t(
              translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                .inputLabel,
            )}:`}
            className="tw-text-sm tw-tracking-normal tw-font-thin tw-text-left"
          >
            <InputField
              type="text"
              onChange={event => setCode(event.target.value)}
              value={code}
              isOnDarkBackground={true}
              inputClassName="tw-text-black"
              wrapperClassName="tw-rounded-lg"
            />
          </FieldGroup>

          <ActionButton
            text={t(
              translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                .inputButton,
            )}
            onClick={handleSubmit}
            className="tw-block tw-w-full tw-h-10 tw-px-9 tw-mt-8 tw-rounded-10px tw-bg-primary tw-bg-opacity-5"
            textClassName="tw-text-lg tw-tracking-normal tw-leading-5.5"
          />
        </div>

        <div className="tw-mt-32">
          <Trans
            i18nKey={
              translations.originsLaunchpad.saleDay.accessCodeVerificationStep
                .footer
            }
            components={[
              <a
                href="#"
                target="_blank"
                rel="noreferrer noopener"
                className="tw-text-secondary tw-text-underline"
              >
                Don't have a code?
              </a>,
            ]}
          />
        </div>
      </DialogWrapper>
    </>
  );
};
