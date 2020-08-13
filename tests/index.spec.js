//@ts-check

const { firefox } = require('playwright');
const assert = require('assert');
const userMock = require('../mocks/user.json');

const login = async function (page) {
  // complete username field
  await page.fill('input[name=loginfmt]', process.env.TEST_ACCOUNT);
  // click next button
  await page.click('text=Next');
  // wait for password field to appear in DOM
  await page.waitForSelector('input[name=passwd]');
  // complete password field
  await page.fill('input[name=passwd]', process.env.TEST_ACCOUNT_PWD)
  // click sign in button
  await page.click('text=Sign in');
  // check remember me box
  await page.click('#KmsiCheckboxField');
  // click yes button
  await page.click('text=Yes');
};

const getFrame = async function (page) {
  // wait for iframe container to appear in DOM
  await page.waitForSelector('#fullscreen-app-host');
  // initialise iframe
  const frame = await page.frame('fullscreen-app-host');
  // wait for iframe to complete loading power app
  await frame.waitForLoadState();
  return frame;
};

describe('Playwright', function () {
  let browser, page, frame;

  before(async function () {
    // launch new browser instance
    browser = await firefox.launch({ headless: false, slowMo: 50 });
    // create a new browser window
    page = await browser.newPage();
    // setup mock api response
    await page.route('https://uk-001.azure-apim.net/invoke', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json; charset=utf-8',
        headers: {
          'access-control-allow-origin': '*'
        },
        body: JSON.stringify(userMock)
      })
    });
    // navigate to powerapp in embed mode, removing office 365 banner
    await page.goto('https://apps.powerapps.com/play/f581c872-9852-4100-8e25-3d6891595204?source=iframe&hidenavbar=true');
    // perform azure ad login 
    await login(page);
    // wait for redirection back to power app
    await page.waitForNavigation({ url: 'https://apps.powerapps.com/**' });
    // initialise power app content iframe
    frame = await getFrame(page);
  });

  after(function () {
    // close browser instance
    browser.close();
  });

  beforeEach(async function () {
    // re-initialise power app content iframe
    frame = await getFrame(page);
  });

  afterEach(async function () {
    // reload browser tab
    await page.reload({ timeout: 0 });
  });

  it('should login and load', async function () {
    const counter = await frame.waitForSelector('div[data-control-name=lblCount]')
    const count = await counter.innerText();

    // @ts-ignore
    assert.strictEqual(count, '0');
  });

  it('when add clicked, counter should increment', async function () {
    const add = await frame.waitForSelector('div[data-control-name=btnAdd] div[data-bind]:not(:empty)');
    await add.click();
    const counter = await frame.waitForSelector('div[data-control-name=lblCount]');
    const count = await counter.innerText();

    // @ts-ignore
    assert.strictEqual(count, '1');
  });

  it('when subtract clicked, counter should decrement', async function () {
    const subtract = await frame.waitForSelector('div[data-control-name=btnSubtract] div[data-bind]:not(:empty)');
    await subtract.click();
    const counter = await frame.waitForSelector('div[data-control-name=lblCount]');
    const count = await counter.innerText();

    // @ts-ignore
    assert.strictEqual(count, '-1');
  });

  it('displays name of the current user', async function () {
    const welcome = await frame.waitForSelector('div[data-control-name=lblWelcome]');
    const text = await welcome.innerText();

    // @ts-ignore
    assert.strictEqual(text, 'Welcome User!');
  });

});