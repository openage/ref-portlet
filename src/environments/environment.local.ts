export const environment = {
  // enviroment = tenant
  production: false,
  silent: false,
  env: 'local',

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

  theme: null,
  styles: [],

  captcha: {
    provider: 'google',
    type: 'recaptcha',
    key: null
  },
  session: {
    timeout: 0,
    cache: {
      duration: 0,
      storage: 'local'
    }
  },
  errors: [],

  // if services section exists then it would be used

  services: [{
    //   code: 'directory',
    //   // url: 'http://localhost:3001/api'
    //   url: 'https://stage.openage.in/directory/api'
    // }, {
    //   code: 'drive',
    //   // url: 'http://localhost:3002/api'
    //   url: 'https://stage.openage.in/drive/api'
    // }, {
    // code: 'gateway',
    // url: 'http://localhost:3005/api'
    // url: 'https://stage.openage.in/gateway/api'
    // }, {
    //   code: 'insight',
    //   // url: 'http://localhost:3004/api'
    //   url: 'https://stage.openage.in/insight/api'
    // }, {
    //   code: 'sendIt',
    //   // url: 'http://localhost:3005/api'
    //   url: 'https://stage.openage.in/send-it/api'
    // }, {
    //   code: 'bap',
    //   // url: 'http://localhost:3005/api'
    //   url: 'https://stage.openage.in/billing/api'
  }],

  // if navs section exists then it would be used
  navs: [
    {
      code: 'landing',
      src: '/assets/data/nav/landing/nav.json'
    },
    {
      code: 'home',
      src: '/assets/data/nav/home/nav.json'
    },
    {
      code: 'work',
      src: '/assets/data/nav/work/nav.json'
    },
    {
      code: 'master',
      src: '/assets/data/nav/master/nav.json'
    },
    {
      code: 'reports',
      src: '/assets/data/nav/reports/nav.json'
    },
    {
      code: 'settings',
      src: '/assets/data/nav/settings/nav.json'
    }
  ]
};
