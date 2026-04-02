const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    try {
        console.log('Navigating...');
        await page.goto('http://localhost:3000');
        console.log('Logging in...');
        await page.type('input[type="email"]', 'ruangomes221102@gmail.com');
        await page.type('input[type="password"]', '123456');
        await page.click('button#btn-do-login');
        await new Promise(r => setTimeout(r, 2000));
        
        console.log('Clicking button...');
        await page.evaluate(() => {
            const btn = document.querySelector('.nav-btn[data-target="audits-list-view"]');
            if(btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'test_history_puppeteer.png' });
        console.log('Screenshot saved!');
    } catch(err) {
        console.log(err);
    } finally {
        await browser.close();
    }
})();
