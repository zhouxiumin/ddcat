

export function imageUrlCheckAndFix(url) {
    if(typeof url !== 'string') {
        return null;
    }
    let newUrl = url;

    if (newUrl.indexOf(' ') >=0) {
        newUrl = newUrl.substring(0, newUrl.indexOf(' '));
        console.log(newUrl);
    }
    let c =newUrl.charAt(newUrl.length-1);
    if (c === '"' || c === "'"){
        newUrl = newUrl.substring(0, newUrl.length-1);
    }
    return newUrl;
}
