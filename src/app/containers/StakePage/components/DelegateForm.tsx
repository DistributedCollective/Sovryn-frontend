import React, { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  address: string;
  onChangeAddress: (value: string) => void;
  isValid: boolean;
  onCloseModal: () => void;
}

export function DelegateForm(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="tw-text-center tw-mb-10 tw-leading-10 tw-text-3xl">
        {t(translations.stake.actions.delegate)}
      </h3>
      <form onSubmit={props.handleSubmit}>
        <div className="tw-mb-9 md:tw-px-9 tw-tracking-normal">
          <label
            className="tw-leading-4 tw-block tw-text-theme-white tw-text-md tw-font-medium tw-mb-2"
            htmlFor="address"
          >
            {t(translations.stake.delegation.delegateTo)}:
          </label>
          <div className="tw-flex tw-space-x-4 tw-relative">
            <input
              className="tw-appearance-none tw-border tw-text-md tw-font-semibold tw-text-center tw-h-10 tw-rounded-lg tw-w-full tw-py-2 tw-px-2 tw-bg-theme-white tw-text-black tw-tracking-normal focus:tw-outline-none focus:tw-shadow-outline"
              id="address"
              type="text"
              value={props.address}
              placeholder={t(translations.stake.delegation.address)}
              onChange={e => props.onChangeAddress(e.currentTarget.value)}
            />
          </div>

          <p className="tw-block tw-text-theme-white tw-text-md tw-font-light tw-mb-2 tw-mt-7">
            {t(translations.stake.txFee)}: 0.0006 rBTC
          </p>
        </div>
        <div className="tw-grid tw-grid-rows-1 tw-grid-flow-col tw-gap-4">
          <button
            type="submit"
            className={`tw-uppercase tw-w-full tw-text-black tw-bg-gold tw-text-xl tw-font-extrabold tw-px-4 hover:tw-bg-opacity-80 tw-py-2 tw-rounded-lg tw-transition tw-duration-500 tw-ease-in-out ${
              !props.isValid &&
              'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-opacity-100'
            }`}
            disabled={!props.isValid}
          >
            {t(translations.stake.actions.confirm)}
          </button>
          <button
            type="button"
            onClick={() => {
              props.onCloseModal();
              props.onChangeAddress('');
            }}
            className="tw-border tw-border-gold tw-rounded-lg tw-text-gold tw-uppercase tw-w-full tw-text-xl tw-font-extrabold tw-px-4 tw-py-2 hover:tw-bg-gold hover:tw-bg-opacity-40 tw-transition tw-duration-500 tw-ease-in-out"
          >
            {t(translations.stake.actions.cancel)}
          </button>
        </div>
      </form>
    </>
  );
}
