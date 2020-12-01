/**
 *
 * NotificationForm
 *
 */

import React from 'react';
import { FormGroup, InputGroup, Checkbox, Icon } from '@blueprintjs/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from '../../../../styles/media';

interface Props {
  name: string;
  email: string;
  response: string;
  marketing: boolean;
  onChange: (e: any) => void;
  onSubmit: (e: any) => void;
  formType: 'signup' | 'update';
}

export function NotificationFormComponent(props: Props) {
  const { t } = useTranslation();
  const s = translations.notificationFromContainer;
  const text = {
    signup: {
      buttonText: 'submit',
      title: (
        <p>
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
          label="Name / Pseudonym"
          labelFor="text-input"
          labelInfo="(required)"
          className="col-md-6 col-sm-12"
        >
          <InputGroup
            id="name"
            name="name"
            value={props.name}
            onChange={props.onChange}
            placeholder="name / pseudonym"
          />
        </FormGroup>
        <FormGroup
          label="Email Address"
          labelFor="email-input"
          labelInfo="(required)"
          className="col-md-6 col-sm-12"
        >
          <InputGroup
            type="email"
            id="email"
            name="email"
            value={props.email}
            onChange={props.onChange}
            placeholder="email@email.com"
          />
        </FormGroup>
      </div>
      <div className="row px-3">
        <Checkbox
          name="marketing"
          checked={props.marketing}
          onChange={props.onChange}
          className="col-md-8 col-sm-12"
          style={{ fontSize: '11px' }}
        >
          {t(s.recieve)}
        </Checkbox>
        <div className="col-md-4 col-sm-12">
          <StyledButton
            className="sovryn-border float-right"
            type="submit"
            onClick={props.onSubmit}
            disabled={!props.email || !props.name}
          >
            {text[props.formType].buttonText}
          </StyledButton>
        </div>
        <div className="row p-3">
          {props.response !== 'success' && props.response && (
            <p className="text-red">There was an error submitting your form</p>
          )}
        </div>
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
