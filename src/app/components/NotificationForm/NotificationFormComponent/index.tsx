/**
 *
 * NotificationForm
 *
 */

import React from 'react';
import { FormGroup, InputGroup, Checkbox, Icon } from '@blueprintjs/core';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
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
      buttonText: 'submit',
      title: (
        <p className="font-family-work-sans">
          <span className="mr-2">
            <Icon icon="issue" iconSize={20} />
          </span>
          {t(s.want)}
        </p>
      ),
    },
    update: {
      buttonText: 'update',
      title: <p>{t(s.update)}</p>,
    },
  };

  return (
    <form>
      {text[props.formType].title}
      <div className="row">
        <FormGroup
          label={t(s.dialog.form.name.label)}
          labelFor="text-input"
          labelInfo={t(s.dialog.form.name.info)}
          className="col-md-6 col-sm-12"
        >
          <InputGroup
            id="name"
            name="name"
            value={props.name}
            onChange={props.onChange}
            placeholder={t(s.dialog.form.name.placeholder)}
          />
        </FormGroup>
        <FormGroup
          label={t(s.dialog.form.email.label)}
          labelFor="email-input"
          labelInfo={t(s.dialog.form.email.info)}
          className="col-md-6 col-sm-12"
        >
          <InputGroup
            type="email"
            id="email"
            name="email"
            value={props.email}
            onChange={props.onChange}
            placeholder={t(s.dialog.form.email.placeholder)}
          />
        </FormGroup>
      </div>
      <div className="row px-3">
        {props.formType === 'signup' && (
          <Checkbox
            name="marketing"
            checked={props.marketing}
            onChange={props.onChange}
            className="col-md-8 col-sm-12"
            style={{ fontSize: '11px' }}
          >
            {t(s.recieve)}
          </Checkbox>
        )}
        <div
          className={`${
            props.formType === 'update'
              ? 'float-right w-100'
              : 'col-md-4 col-sm-12'
          }`}
        >
          <StyledButton
            className="sovryn-border float-right"
            type="submit"
            onClick={e => props.onSubmit(e, props.formType)}
            disabled={!props.email || !props.name}
          >
            {text[props.formType].buttonText}
          </StyledButton>
        </div>
        {props.response !== 'success' && props.response && (
          <div className="row p-3">
            <p className="text-red">{t(s.dialog.error)}</p>
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
