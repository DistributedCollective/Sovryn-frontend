import i18next from 'i18next';

// Initialize dayjs
import dayjs from 'dayjs';

// Initialize dayjs locales
// dayjs locale en is not needed, it's the default.
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/fr';

// Initialize dayjs plugins
import dayjsUtc from 'dayjs/plugin/utc';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsLocalizedFormat);

i18next.on('languageChanged', (lng: string) => {
  dayjs.locale(lng);
});
