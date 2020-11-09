import { useDispatch, useSelector } from 'react-redux';
import { selectEmailNotification } from 'app/components/NotificationForm/selectors';
import { useAccount } from './useAccount';

export function useNotificationSignUp() {
  const address = useAccount();

  return useSelector(selectEmailNotification);
}
