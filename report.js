const puppeteer = require("puppeteer");
let test = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://app.amardata.com:8443/PiraSignTerrace/main/login.jsp");

    await page.type("#form-username", "A12");
    await page.type("#form-password", "A12");

    await page.click(".btn");

    await page.waitForNavigation();

    await page.screenshot({ path: 'tag.png' });

    let word = await page.$eval("#logout > a", ele => ele.innerText);
    console.log(word);
    await browser.close();
};
test();