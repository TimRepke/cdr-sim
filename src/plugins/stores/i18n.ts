import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export interface I18nString {
  DE?: string;
  EN?: string;
}

export const useI18nStore = defineStore('i18n', () => {
  const language: Ref<keyof I18nString> = ref('EN');

  function s(str: I18nString): string {
    if (language.value in str && str[language.value]) return str[language.value] as string;
    return '';
  }

  return { language, s };
});

export const MONTHS: Array<I18nString> = [
  {}, // offset to start January at 1
  {
    EN: 'January',
    DE: 'Januar',
  }, {
    EN: 'Feburary',
    DE: 'Februar',
  }, {
    EN: 'March',
    DE: 'März',
  }, {
    EN: 'April',
    DE: 'April',
  }, {
    EN: 'May',
    DE: 'Mai',
  }, {
    EN: 'June',
    DE: 'Juni',
  }, {
    EN: 'July',
    DE: 'Juli',
  }, {
    EN: 'August',
    DE: 'August',
  }, {
    EN: 'September',
    DE: 'September',
  }, {
    EN: 'October',
    DE: 'Oktober',
  }, {
    EN: 'November',
    DE: 'November',
  }, {
    EN: 'December',
    DE: 'Dezember',
  },
];

export const MONTHS_ABBR: Array<I18nString> = [
  {}, // offset to start January at 1
  {
    EN: 'Jan',
    DE: 'Jan',
  }, {
    EN: 'Feb',
    DE: 'Feb',
  }, {
    EN: 'Mar',
    DE: 'Mär',
  }, {
    EN: 'Apr',
    DE: 'Apr',
  }, {
    EN: 'May',
    DE: 'Mai',
  }, {
    EN: 'Jun',
    DE: 'Jun',
  }, {
    EN: 'Jul',
    DE: 'Jul',
  }, {
    EN: 'Aug',
    DE: 'Aug',
  }, {
    EN: 'Sep',
    DE: 'Sep',
  }, {
    EN: 'Oct',
    DE: 'Okt',
  }, {
    EN: 'Nov',
    DE: 'Nov',
  }, {
    EN: 'Dec',
    DE: 'Dez',
  },
];
