const Buffer = require('buffer').Buffer;
function unsuan(str, key) {
    let sb = '';
    for(let i=0; i<str.length;i ++) {
        if (i % 2 === 0) {
            sb += (str.charAt(i));
        }
    }
    str = sb;
    let decodedStr = new Buffer(str, 'base64');
    str = decodedStr.toString();
    key = key + 'ro4w78Jx';
    let data = new Buffer(str);
    let keyData = new Buffer(key);
    let keyIndex = 0;
    for(let x = 0; x< data.length; x++){
        data[x] = (data[x] ^ keyData[keyIndex]);
        if ( ++keyIndex === keyData.length) {
            keyIndex = 0;
        }
    }
    str = data.toString();
    decodedStr = new Buffer(str, 'base64');
    return decodedStr.toString();
}

export function urlDecoder(url) {
    if (url.startsWith('sited://')) {
        let key = 'data?';
        let index = url.indexOf(key);
        let data = url.substring(index + key.length);
        let decode = new Buffer(data, 'base64');
        return decode.toString();
    }else {
        return url;
    }
}

export function decodeXml(xml) {
    let sited;
    if (xml.startsWith('sited::')){
        let start = xml.indexOf('::') + 2;
        let end = xml.lastIndexOf('::');
        let txt = xml.substring(start, end);
        let key = xml.substring(end + 2);
        xml = unsuan(txt, key);
    }
    sited = xml;
    return xml;
}

export function getTagContent(doc, tag) {
    let t = doc.getElementsByTagName(tag);
    if (t.length > 0) {
        return t[0].textContent;
    } else {
        return null;
    }
}

function main() {
    loadSitedFile('lsm.sited')
        .then(xml => {
            let sited;
            if (xml.startsWith('sited::')){
                let start = xml.indexOf('::') + 2;
                let end = xml.lastIndexOf('::');
                let txt = xml.substring(start, end);
                let key = xml.substring(end + 2);
                xml = unsuan(txt, key);
            }
            sited = xml;
        }).catch(function (err) {
        console.log(err);
    });

    let url = 'sited://data?aHR0cDovL3NpdGVkLm5vZWFyLm9yZy9hZGRpbi9zaXRlMTA0MS5zaXRlZC54bWw=';
    console.log(urlDecoder(url));
}


