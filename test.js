const puppeteer = require("puppeteer");


let test = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport:
        {
            width: 1920,
            height: 1048
        },
    });
    const page = await browser.newPage();

    var word = "word";

    await page.goto("http://106.15.231.105:8080/login.html");
    await page.type("#username", "admin");
    await page.type("#password", "admin");
    await page.click("#login_submit");
    
    await page.waitFor(3000);

    await page.click("#toolbar > button:nth-child(1)");
    await page.waitFor(1000);
    await page.type("#mcr_id", "1165165")
    await page.waitFor(5000);
    await page.click("#pjwindow > div > div > div.modal-footer > button.btn.btn-default");

    await page.waitFor(1000);

    await browser.close();
};
test();