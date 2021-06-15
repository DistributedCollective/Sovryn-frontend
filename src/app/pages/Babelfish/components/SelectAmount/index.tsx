import React, { useMemo, useState } from 'react';
import { Input } from 'app/components/Form/Input';
import { FieldGroup } from 'app/components/FieldGroup';
import { bignumber } from 'mathjs';
import { AmountButton } from 'app/pages/BuySovPage/components/AmountButton';
import { Button } from 'app/components/Button';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import walletIcon from 'assets/images/wallet-icon.svg';
import { stringToFixedPrecision } from 'utils/display-text/format';

type Props = {
  updateAmount: Function;
};

export function SelectAmount({ updateAmount }: Props) {
  const [amount, setAmount] = useState('');

  const changeAmount = value => {
    setAmount(value.toFixed(0));
  };

  const weiAmount = useWeiAmount(amount);

  const validate = useMemo(() => {
    return bignumber(weiAmount).greaterThan(0);
  }, [weiAmount]);

  const submit = () => {
    updateAmount({
      title: amount,
      icon: (
        <img
          className={'tw-object-contain tw-h-3 tw-w-3'}
          src={walletIcon}
          alt="wallet"
        />
      ),
    });
  };

  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        Enter amount to deposit
      </div>
      <div>
        <FieldGroup label={'Deposit Amount:'} labelColor="#E9EAE9">
          <Input
            value={stringToFixedPrecision(amount, 2)}
            type="text"
            onChange={value => setAmount(value)}
            placeholder="0.0000"
            className="tw-mb-2"
          />
          <AmountButton onChange={changeAmount} />
        </FieldGroup>

        <Button
          className="tw-mt-10 tw-w-full"
          text={'Next'}
          disabled={!validate}
          onClick={submit}
        />
      </div>
    </div>
  );
}
