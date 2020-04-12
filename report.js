const puppeteer = require("puppeteer");

const autoScroll = (page) => {
    return page.evaluate(() => {
        return new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            // 每200毫秒让页面下滑100像素的距离
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        })
    });
};

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1500, height: 968 });

    var word = "word";

    await page.goto("http://ehall.seu.edu.cn/new/index.html");

    login = await page.waitForSelector("#ampHasNoLogin");
    await login.click();
    await page.waitForNavigation();

    // 登录
    await page.type("#username", "220191746");
    await page.type("#password", "Wsz123456789");
    word = await page.$eval("#xsfw", ele => ele.innerText);
    console.log(word)
    await page.click("#xsfw");

    while (1) {
        try {
            // 进入每日申报页面
            await page.goto("http://ehall.seu.edu.cn/appShow?appId=5821102911870447");
            await page.waitForNavigation();
            url = await page.url();
            console.log("current url: " + url);
            // 进入基本信息填写
            add = await page.waitForSelector("body > main > article > section > div.bh-mb-16 > div.bh-btn.bh-btn-primary");
            await add.click();
            break;
        } catch (e) {
            console.log("超时");
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        }
    }

    await page.waitFor(2000)

    isReported = await page.waitForSelector(".bh-bhdialog-container > div.bh-modal > div.bh-pop.bh-card.bh-card-lv4.bh-dialog-con > div.bh-dialog-center > div.bh-dialog-btnContainerBox > a");
    if (isReported) {
        await isReported.click();    // 今日健康信息已填报
        console.log("今日已填报！");
    }
    else {
        // 填报今日信息
        await autoScroll(page);
        await page.waitFor(3000);

        save = await page.waitForSelector("#save");
        console.log("保存按钮已加载");
        await save.click();

        await page.waitFor(2000);

        submit = await page.waitForSelector("#dialog6182e9c0-91bf-4864-a5f6-23a7e6eef354 > div.bh-modal > div.bh-pop.bh-card.bh-card-lv4.bh-dialog-con > div.bh-dialog-center > div.bh-dialog-btnContainerBox > a.bh-dialog-btn.bh-bg-primary.bh-color-primary-5");
        console.log("确定数据并提交吗？");
        await submit.click();
        console.log("今日情况申报完成！");
    }

    // 登出
    await page.goto("http://ehall.seu.edu.cn/new/index.html");
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    avatar = await page.waitForSelector("#ampHeaderToolUserName");
    await avatar.click();
    await page.waitFor(1000);
    await page.click("#ampHeaderUserInfoLogoutBtn");
    console.log("安全退出");
    await page.waitFor(2000);
    await browser.close();
})();