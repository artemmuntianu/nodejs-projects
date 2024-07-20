const puppeteer = require('puppeteer-extra');
const recaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const {run} = require('./utils/functions');

puppeteer.use(
  recaptchaPlugin({
    provider: {
      id: '2captcha',
      token: '25c438de42cfa531b15943e575d9deff'
    },
    visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

run();