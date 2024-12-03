// @ts-ignore
import logoImage from './extensions/Logo-Alcaldia-Texto.webp';

const config = {
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    // 'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
  translations: {
    en: {
      "Auth.form.welcome.title": "Bienvenidos a Fomento",
      "Auth.form.welcome.subtitle": "Inicia sesión para comenzar",
    },
  },
  auth: {
    logo: logoImage,
  },
  menu: {
    logo: logoImage,
  },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};