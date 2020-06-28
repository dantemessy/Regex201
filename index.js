'use strict';

let code = ` 
// not allowed:
{{user.id}} = 22;
{{user.current_channel_id}} =33;
{{bot.variables}}
{{channel.anything}}
{{session.anything}}

{{user.email}}="whatever"`;


let checkAccess = (code) => {

    const settersRegex = /(?<=\{\{\s*)[a-z_\.]+(?=\s*\}\}\s*\=)/g;
    const protectedRegex = /^user\.id|^user\.current\_channel\_id|^bot\.variables|^channel|^session/g;
    let setters = code.match(settersRegex);
    if (!setters) return code;

    setters.forEach(val => {
        if (val.match(protectedRegex)) throw new Error(`Access Denied! ${val} is readOnly Property`);
        let replaceRegex = new RegExp(`\{\{\\s*` + val + `\\s*\}\}(?=\\s*\=)`, 'g');
        code = code.replace(replaceRegex, `state.${val}`);
    });

    return code;
}