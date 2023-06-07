export const environment = {
  // enviroment = tenant
  production: true,
  env: 'qa',

  debug: {
    host: 'localhost:4207',
  },

  code: 'portlet',
  name: 'Portlet',
  host: 'portlet.applegos.in', // this is only for local debugging
  title: 'Reference Portlet',
  version: '1.0.0',
  ref: 'https://api.openage.in/system/v1/api/applications/host:{{host}}', // prod

  organization: { code: null },
  loginTypes: ['email'],
  captcha: {
    provider: 'google',
    type: 'recaptcha',
    key: '6LelHKwaAAAAAAkcYHXGeHd6UYrcnektUrkLfLSY'
  },
  theme: null,
  styles: [],
  session: {
    timeout: 0,
    cache: {
      duration: 1,
      storage: 'session'
    }
  },
  errors: [],

  // if services section exists then it would be used
  services: [],
  // if navs section exists then it would be used
  navs: [
    // {
    //   code: 'landing',
    //   src: '/assets/data/nav/landing/nav.json'
    // },
    // {
    //   code: 'home',
    //   src: '/assets/data/nav/home/nav.json'
    // },
    // {
    //   code: 'work',
    //   src: '/assets/data/nav/work/nav.json'
    // },
    // {
    //   code: 'master',
    //   src: '/assets/data/nav/master/nav.json'
    // },
    {
      code: 'reports',
      src: '/assets/data/nav/reports/nav.json'
      // },
      // {
      //   code: 'settings',
      //   src: '/assets/data/nav/settings/nav.json'
    }
  ]
};
