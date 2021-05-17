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
      <>
        <StyledDiv className="tw-mb-8">{t(s.dialog.want)}</StyledDiv>
        <FormGroup
          label={t(s.dialog.form.name.label)}
          labelFor="text-input"
          className="tw-mb-8"
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
          className="tw-mb-8"
        >
          <InputGroup
            type="email"
            id="email"
            name="email"
            value={props.email}
            onChange={props.onChange}
          />
        </FormGroup>
      </>
      <div>
        {props.formType === 'signup' && (
          <Checkbox
            name="marketing"
            checked={props.marketing}
            onChange={props.onChange}
            className="tw-mb-8 md:tw-col-span-8 sm:tw-col-span-12"
            style={{ fontSize: '11px' }}
          >
            {t(s.receive)}
          </Checkbox>
        )}
        <div>
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
  background: #fec004;
  border: 1px solid #fex004;
  color: #000000;
  border-radius: 10px;
  border-color: #fec004;
  transition: background 0.3s, color 0.3s, border 0.3s;
  cursor: pointer;
  height: 50px;
  width: 100%;
  padding: 0 25px;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: rgba(254, 192, 4, 0.5);
  }
  &:hover {
    background: rgb(254, 192, 4, 0.8);
  }
  ${media.lg`
  font-size: 18px
  `}
`;

const StyledDiv = styled.div`
  font-size: 13px;
`;
