import React, { useState, useEffect } from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import background from 'assets/images/tutorial/mobile-not-ready-bg.svg';
import successBg from 'assets/images/tutorial/email_success_bg.svg';
import close from 'assets/images/tutorial/close.svg';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function MobileNotReady(props) {
  const { t } = useTranslation();
  const s = translations.mobileNotReady;
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const url = process.env.REACT_APP_MAILCHIMP;

  const CustomForm = ({ status, message, onValidated }) => {
    let email;
    useEffect(() => setStatus(status), [status]);
    useEffect(() => {
      if (message) {
        if (message.includes('already')) {
          setStatus('success');
        } else {
          setMessage(message);
        }
      }
    }, [message]);
    const submit = () =>
      email &&
      email.value.indexOf('@') > -1 &&
      onValidated({
        EMAIL: email.value,
      });

    return (
      <div className="email-form position-absolute">
        <input
          style={{ fontSize: '2em', padding: 5 }}
          ref={node => (email = node)}
          type="email"
          placeholder="Your email"
        />
        <br />
        <button className="px-3 py-1" onClick={submit}>
          {t(s.submit)}
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="wallet-tutorial-mobile_container position-absolute mx-auto">
        {status !== 'success' && (
          <>
            <div className="mobile-not-ready-img position-absolute">
              <div
                className="close position-absolute"
                onClick={() => props.handleClose()}
              >
                <img src={close} alt="close" className="w-100 h-100" />
              </div>
              <img src={background} alt="" className="h-100 w-100" />
              <div className="mobile-not-ready-text position-absolute">
                <p>{t(s.p1)}</p>

                <p>{t(s.p2)}</p>
              </div>

              <MailchimpSubscribe
                url={url}
                render={({ subscribe, status, message }) => (
                  <CustomForm
                    status={status}
                    message={message}
                    onValidated={formData => subscribe(formData)}
                  />
                )}
              />
              <div className="mobile-not-ready-text2 position-absolute">
                {status === 'sending' && <p>Sending...</p>}
                {status === 'error' && !message.includes('already') && (
                  <p style={{ color: 'var(--red)' }}>{t(s.errorText)}</p>
                )}
                {!status && <p>{t(s.p3)}</p>}
              </div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="email-success position-absolute">
              <img className="h-100 w-100" src={successBg} alt="" />
              <div className="mobile-not-ready-text--success position-absolute">
                <p>{t(s.success)}</p>

                <p>{t(s.successText)}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
