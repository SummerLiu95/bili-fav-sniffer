export function getCookieConfigList(setCookieHeader: string): Array<object> {
    let cookiesConfigList: Array<any> = [];
    const regex = /Expires=([^;]+GMT[;,]?)/g;
    const cookies = setCookieHeader.replace(regex, (match, expiresValue) => {
        const expiresTimestamp = new Date(expiresValue).getTime() / 1000;
        let symbol = ''
        if (expiresValue.endsWith('GMT;') || expiresValue.endsWith('GMT,')) {
            symbol = expiresValue.slice(-1);
        }
        return `Expires=${expiresTimestamp}${symbol}`;
    });
    const cookiesArray = cookies.split(',').map(str => str.trim());
    cookiesArray.forEach(cookie => {
        let temp = {} as any;
        const cookieKeyValArray = cookie.split(';').map(str => str.trim());
        cookieKeyValArray.forEach(attribute => {
            const [attrName, attrValue] = attribute.split('=');
            temp[attrName] = attrValue || true;
        });
        cookiesConfigList.push(temp)
    });
    return cookiesConfigList;
}

export function getNetscapeCookieText(setCookieHeader: string) {
    let cookiesConfigList = getCookieConfigList(setCookieHeader);
    let cookieFileText = '# Netscape HTTP Cookie File\n';
    cookiesConfigList.forEach((cookie: any) => {
        let cookieLine: string;
        let cookieName = '';
        for (const attrName of Object.keys(cookie)) {
            if (!(['Path', 'Domain', 'Expires', 'HttpOnly', 'Secure'].includes(attrName))) {
                cookieName = attrName;
            }
        }
        cookieLine = `.${cookie['Domain']}\tTRUE\t${cookie['Path']}\tFALSE\t${cookie['Expires']}\t${cookieName}\t${cookie[cookieName]}`
        cookieFileText += `${cookieLine}\n`;
    });
    return cookieFileText;
}