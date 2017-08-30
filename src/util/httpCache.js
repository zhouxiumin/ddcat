import realm from './realmDB'
import {Buffer} from 'buffer';

const iconv = require('iconv-lite');

export function fetchOrFromCache(url, options, expire, encode = 'utf-8') {
    let caches = realm.objects('HttpCache').filtered('url == $0', url);
    let cache = null;
    let now = new Date();
    if (caches.length > 0) {
        cache = caches[0];
        let createDate = cache.createDate;
        let diff = now.getTime() - createDate.getTime();
        let days = Math.floor(diff / (24 * 3600 * 1000));
        if (days < expire) {
            return Promise.resolve(cache.body);
        }
    }

    return fetch(url, options)
        .then((response) => {
            if (typeof response.arrayBuffer === 'function'){
                return response.arrayBuffer().then((arrayBuffer) => {
                    return iconv.decode(new Buffer(arrayBuffer), encode).toString();
                })
            }else {
                return response.text()
            }
        })
        .then((html) => {
            if (cache) {
                try {
                    realm.write(() => {
                        cache.body = html;
                    });
                } catch (e) {
                    console.log("Error on update");
                }
            } else {
                try {
                    realm.write(() => {
                        realm.create('HttpCache', {url: url, body: html, createDate: now});
                    });
                } catch (e) {
                    console.log(e);
                    console.log("Error on creation");
                }
            }
            return html;
        });
}

export function clearHttpCache() {
    let caches = realm.objects('HttpCache');
    try {
        realm.write(() => {
            realm.delete(caches);
        });
    } catch (e) {
        console.log(e);
        console.log("Error on delete");
    }
}