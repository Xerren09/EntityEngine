export const keyList = [];

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }
    //event.code
    if (keyList.includes(event.code) == false)
    {
        keyList.push(event.code);
    }
    event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) {
        return;
    }
    //event.code
    if (keyList.includes(event.code))
    {
        const keyIndex = keyList.indexOf(event.code);
        keyList.splice(keyIndex, 1);
    }
    event.preventDefault();
}, true);