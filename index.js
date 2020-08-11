//@ts-check

const { chromium } = require('playwright');
const assert = require('assert');

const login = async (page) => {
  await page.goto('https://apps.powerapps.com/play/f581c872-9852-4100-8e25-3d6891595204?tenantId=e8954f17-a373-4b61-b54d-45c038fe3188');
  await page.fill('input[name=loginfmt]', process.env.TEST_ACCOUNT)
  await page.click('text=Next');
  await page.waitForSelector('input[name=passwd]')
  await page.fill('input[name=passwd]', process.env.TEST_ACCOUNT_PWD)
  await page.click('text=Sign in')
  await page.click('#KmsiCheckboxField')
  await page.screenshot({ path: `login.png` });
  await page.click('text=Yes')
  await page.waitForNavigation({ url: 'https://apps.powerapps.com/**' })
}

const getFrame = async (page) => {
  const frame = await page.frame({ url: 'https://pa-content.azureedge.net/**' })
  await frame.waitForLoadState();
  return frame;
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  await login(page);
  const frame = await getFrame(page);

  const add = await frame.waitForSelector('div[data-control-name=btnAdd] div[data-bind]:not(:empty)')
  await add.click()
  const counter = await frame.waitForSelector('div[data-control-name=lblCount]')
  const count = await counter.innerText();
  // @ts-ignore
  assert.strictEqual(count, '1')
  await page.screenshot({ path: `clicked.png` });
  await browser.close();
})();