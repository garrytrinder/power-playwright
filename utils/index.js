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
  await page.check('#KmsiCheckboxField');
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

const getControlByName = async function (name, frame) {
  return frame.waitForSelector(`div[data-control-name=${name}]`)
};

const getLabelByName = async function (name, frame) {
  return getControlByName(name, frame);
}

const getButtonByName = async function (name, frame) {
  const button = await getControlByName(name, frame);
  return button.$('div[data-bind]:not(:empty)');
}

module.exports = {
  login,
  getFrame,
  getLabelByName,
  getButtonByName
}