import { useDispatch, useSelector } from 'react-redux';
import { selectEmailNotification } from 'app/components/NotificationForm/selectors';

export function useNotificationSignUp() {
  return useSelector(selectEmailNotification);
}
