const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log("Navigating to http://localhost:3000");
        await page.goto("http://localhost:3000");

        console.log("Logging in...");
        await page.type('input[type="email"]', 'ruangomes221102@gmail.com');
        await page.type('input[type="password"]', '123456');
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => {}),
            page.click('button#btn-do-login')
        ]);
        
        await page.waitForTimeout(1500);

        console.log("Clicking Histórico...");
        // Use evaluate to perfectly click the button in DOM
        await page.evaluate(() => {
            const btn = document.querySelector('.nav-btn[data-target="audits-list-view"]');
            if(btn) btn.click();
        });

        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: 'test_history_puppeteer.png' });
        console.log("Success! Screenshot saved to test_history_puppeteer.png");
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await browser.close();
    }
})();
