const puppeteer = require('puppeteer-extra');
const {log} = require('./logger');
const executablePath = require('puppeteer').executablePath();
const _15sec = 15 * 1000;
const _2min = 2 * 60 * 1000;

async function run() {
    const now = new Date();
    const runId = now.getHours() * 60 + now.getMinutes();

    const browser = await puppeteer.launch({ headless: true, executablePath: executablePath });
    const page = await browser.newPage();

    await page.goto('https://online.mfa.gov.ua/application');
    await page.click('.MuiDialog-container button');
    await page.waitForNetworkIdle();
    await selectValueFromList(page, '.jss53 .jss56:nth-child(1)', 'Португалія');
    await solveCaptcha('prd', page);
    await selectValueFromList(page, '.jss53 .jss56:nth-child(2)', 'ПУ в Португалії');

    const runTimes = 5;
    for (let i = 1; i <= runTimes; i++) {
        const time1 = Date.now();
        await selectAction(`${runId}_${i}`, page, 'Нотаріальні дії', 'Оформлення довіреності');
        await selectAction(`${runId}_${i}`, page, 'Дії з витребування документів', 'Замовлення довідки про відсутність судимості');
        const time2 = Date.now();
        if (i != runTimes)
            await page.waitForTimeout(_2min - (time2 - time1));
    }

    await browser.close();
}

async function selectValueFromList(page, selector, value) {
    await page.click(selector);
    const optionElems = await page.$x(`//li[contains(., '${value}')]`);
    await optionElems[0].click();
    await page.waitForNetworkIdle();
}

async function isTimeSlotAvailable(page) {
    const optionElems = await page.$x(`//p[contains(., 'Наразі вільні слоти відсутні')]`);
    if (optionElems.length > 0)
        return false;
    return true;
}

async function selectAction(opId, page, action1, action2) {
    await selectValueFromList(page, '.jss53 .jss56:nth-child(3)', action1);
    await selectValueFromList(page, '.jss53 .jss56:nth-child(4)', action2);

    if (!await isTimeSlotAvailable(page))
      log.info(`${opId}: ${action2}. No time slots.`);
    else 
      log.info(`${opId}: ${action2}. Time slot available!`);
}

async function solveCaptcha(env, page) {
    switch (env) {
        case 'prd': 
            await page.solveRecaptchas();
            await page.waitForNetworkIdle();
            break; 
        case 'dev':
            await page.waitForTimeout(_15sec);
            break;
    }    
}

module.exports = {
    run: run
}