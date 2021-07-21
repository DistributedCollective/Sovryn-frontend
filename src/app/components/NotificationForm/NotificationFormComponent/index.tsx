import { Checkbox, FormGroup, Icon, InputGroup } from '@blueprintjs/core';
/**
 *
 * NotificationForm
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { translations } from 'locales/i18n';

import { media } from '../../../../styles/media';

interface Props {
  name: string;
  email: string;
  response: string;
  marketing: boolean;
  onChange: (e: any) => void;
  onSubmit: (e: any, formType) => void;
  formType: 'signup' | 'update';
}

export function NotificationFormComponent(props: Props) {
  const { t } = useTranslation();
  const s = translations.notificationFormContainer;
  const text = {
    signup: {
      buttonText: t(s.dialog.wantBtn),
      title: (
        <p>
          <span className="tw-mr-2">
            <Icon icon="issue" iconSize={20} />
          </span>
          {t(s.want)}
        </p>
      ),
    },
    update: {
      buttonText: t(s.dialog.updateBtn),
      title: <p>{t(s.update)}</p>,
    },
  };

  return (
    <form>
      {text[props.formType].title}
      <div className="tw-grid tw-gap-8 tw-grid-cols-12">
        <FormGroup
          label={t(s.dialog.form.name.label)}
          labelFor="text-input"
          labelInfo={t(s.dialog.form.name.info)}
          className="md:tw-col-span-6 sm:tw-col-span-12"
        >
          <InputGroup
            id="name"
            name="name"
            value={props.name}
            onChange={props.onChange}
          />
        </FormGroup>
        <FormGroup
          label={t(s.dialog.form.email.label)}
          labelFor="email-input"
          labelInfo={t(s.dialog.form.email.info)}
          className="md:tw-col-span-6 sm:tw-col-span-12"
        >
          <InputGroup
            type="email"
            id="email"
            name="email"
            value={props.email}
            onChange={props.onChange}
          />
        </FormGroup>
      </div>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-px-4">
        {props.formType === 'signup' && (
          <Checkbox
            name="marketing"
            checked={props.marketing}
            onChange={props.onChange}
            className="md:tw-col-span-8 sm:tw-col-span-12"
            style={{ fontSize: '11px' }}
          >
            {t(s.receive)}
          </Checkbox>
        )}
        <div
          className={`${
            props.formType === 'update'
              ? 'tw-float-right tw-w-full'
              : 'md:tw-col-span-4 sm:tw-col-span-12'
          }`}
        >
          <StyledButton
            className="sovryn-border tw-float-right"
            type="submit"
            onClick={e => props.onSubmit(e, props.formType)}
            disabled={!props.email || !props.name}
          >
            {text[props.formType].buttonText}
          </StyledButton>
        </div>
        {props.response !== 'success' && props.response && (
          <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12 tw-p-4">
            <p className="tw-text-red-500">{t(s.dialog.error)}</p>
          </div>
        )}
      </div>
    </form>
  );
}

const StyledButton = styled.button`
  color: var(--white);
  background-color: var(--primary);
  border-radius: 20px;
  padding: 5px 30px;
  font-size: 12px;
  &:disabled {
    opacity: 0.7;
  }
  &:hover:not(:disabled) {
    color: var(--Gold);
  }
  ${media.lg`
  font-size: 14px
  `}
`;
