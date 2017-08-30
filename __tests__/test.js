function getIpsByKey(key) {
    let ret = [];
    let r = /^\d{1,3}(\.\d{0,3}){0,3}$/;
    if (!r.test(key)) {
        return ret;
    }
    let fields = key.split('.');
    for (let i= fields.length-1; i>=0;i--) {
        if(fields[i]==='') {
            fields.splice(i, 1);
        }
    }
    for(let i=0;i<fields.length;i++) {
        let number = Number.parseInt(fields[i]);
        if(number > 255){
            return ret;
        }
    }
    if (fields.length > 4) {
        return ret;
    }

    for (let i=0; i< 4 - fields.length; i++) {
        let str = '';
        for(let j=0; j<i;j++) {
            str += '*.';
        }
        for(let j=0;j<fields.length;j++) {
            str += fields[j] + '.'
        }
        for(let j=0; j<4 - fields.length - i;j++) {
            str += '*.';
        }
        ret.push(str.substring(0, str.length-1));
    }
    return ret;
}


console.log(getIpsByKey('22.2'));