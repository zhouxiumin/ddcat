import {decodeXml, getTagContent} from "./dbSource";
import realm from './realmDB'

const DOMParser = require('xmldom').DOMParser;
const uuid = require('react-native-uuid');
const _ = require('lodash');

export function saveSited(item) {
    return fetch(item.url)
        .then((response) => {
            return response.text()
        }).then((xml) => {
            let decodedXml = decodeXml(xml);
            const doc = new DOMParser().parseFromString(decodedXml);
            let title = getTagContent(doc, 'title');
            let author = getTagContent(doc, 'author');
            let intro = getTagContent(doc, 'intro');

            let guid = getTagContent(doc, 'guid') || _.replace(uuid.v4(), /-/g, '');
            // console.log(decodedXml);
            let Sited = realm.objects('Sited');
            let siteds = Sited.filtered('title == $0', title);
            console.log('siteds:');
            console.log(siteds);
            if (siteds.length > 0) {
            } else {
                try {
                    realm.write(() => {
                        realm.create('Sited', {
                            title: title,
                            author: author,
                            intro: intro,
                            guid: guid,
                            xml: decodedXml
                        });
                    });
                } catch (e) {
                    console.log("Error on creation");
                }
                console.log("write");
            }
        })
}

export function deleteSited(item) {

    let Sited = realm.objects('Sited');
    let siteds = Sited.filtered('title == $0', item.title);
    if (siteds.length > 0) {
        try {
            realm.write(() => {
                realm.delete(siteds);
            });
        } catch (e) {
            console.log("Error on creation");
        }
    }
}

export function getSiteds() {
    return realm.objects('Sited').map((sited) => {
        return {title: sited.title}
    });
}