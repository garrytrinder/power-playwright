//@ts-check

const { firefox } = require('playwright');
const assert = require('assert');

const login = async function (page) {
  await page.fill('input[name=loginfmt]', process.env.TEST_ACCOUNT)
  await page.click('text=Next');
  await page.waitForSelector('input[name=passwd]')
  await page.fill('input[name=passwd]', process.env.TEST_ACCOUNT_PWD)
  await page.click('text=Sign in')
  await page.click('#KmsiCheckboxField')
  await page.click('text=Yes')
}

const getFrame = async function (page) {
  await page.waitForSelector('#fullscreen-app-host');
  const frame = await page.frame('fullscreen-app-host');
  await frame.waitForLoadState();
  return frame;
}

describe('Playwright', function () {
  let browser, page, frame;

  before(async function () {
    browser = await firefox.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();
    await page.goto('https://apps.powerapps.com/play/f581c872-9852-4100-8e25-3d6891595204?source=iframe&hidenavbar=true');
    await login(page);
    await page.waitForNavigation({ url: 'https://apps.powerapps.com/**' });
    frame = await getFrame(page);
  });

  after(function () {
    browser.close();
  });

  beforeEach(async function () {
    frame = await getFrame(page);
  });
  
  afterEach(async function () {
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

});