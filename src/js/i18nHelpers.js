import i18n from './i18n';
import countryCodes from '../data/countriesInformation.json';

export function getEnglishCountryName(countryName) {
  const currentLocale = i18n.global.locale;
  const messages = i18n.global.messages;

  if (!messages.en?.countries || !messages[currentLocale]?.countries) {
    return countryName;
  }

  const englishKey = Object.keys(messages.en.countries).find(
    key => messages[currentLocale].countries[key] === countryName
  );

  return englishKey || countryName;
}

export function getFlagUrl(countryName) {
  const locale = i18n.global.locale; // "no" or "en"
  const allCodes = countryCodes.countryCodes; // your outer object

  // Make sure this locale exists
  const map = allCodes[locale];
  if (!map) {
    console.warn(`No country code mapping found for locale: ${locale}`);
    return '';
  }

  // Try to find by current locale first (e.g. "Italia" → "IT")
  let code = map[countryName];

  // If not found (maybe you’re using a translated name),
  // try to convert to English and look again
  if (!code) {
    const englishName = getEnglishCountryName(countryName);
    code = allCodes.en[englishName];
  }

  // Return the correct URL or nothing if missing
  return code ? `https://flagcdn.com/w20/${code.toLowerCase()}.png` : '';
}
