export default function (cookieArray: string[]) {
    let cookieFileText = '# Netscape HTTP Cookie File\n';
    cookieArray.forEach(cookie => {
        const cookieKeyValArray = cookie.split(';').map(str => str.trim());
        let cookieLine: string;
        const cookieObj = {} as any;
        let cookieName = '';
        cookieKeyValArray.forEach(attribute => {
            const [attrName, attrValue] = attribute.split('=');
            cookieObj[attrName] = attrValue;
            if (!(['Path', 'Domain', 'Expires', 'HttpOnly', 'Secure'].includes(attrName))) {
                cookieName = attrName;
            }
        });
        cookieLine = `.${cookieObj['Domain']}\tTRUE\t${cookieObj['Path']}\tFALSE\t${cookieObj['Expires']}\t${cookieName}\t${cookieObj[cookieName]}`
        cookieFileText += `${cookieLine}\n`;
    });
    return cookieFileText;
}