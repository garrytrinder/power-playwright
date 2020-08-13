# Power Playwright

A proof of concept to demonstrate how to use Microsoft Playwright Node.js automation tool to create e2e tests for Microsoft Power Apps.

![Power Playwright](power-playwright.gif)

## Features

- Automated Azure AD login
- Run multiple tests in single session
- Perform simple click actions
- Assert simple value changes after events
- Mock API requests

## Getting Started

- Clone repository
- `npm install`
- Import `app\playwright.zip` into Power App environment
- Set `APP_ID` environment variable to AppId of imported Playwright Power App
- Set `TEST_ACCOUNT` environment variable with username of account to login with
- Set `TEST_ACCOUNT_PWD` environment variable with password of account to login with
- `npm t`