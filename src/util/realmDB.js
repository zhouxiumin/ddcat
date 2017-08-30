const Realm = require('realm');

const SitedSchema = {
    name: 'Sited',
    properties: {
        title: {type: 'string'},
        guid:{type:'string'},
        author:{type:'string'},
        intro:{type:'string'},
        xml: 'string'
    }
};

const HttpCacheSchema = {
    name: 'HttpCache',
    primaryKey: 'url',
    properties: {
        url: {type: 'string'},
        body:{type: 'string', optional: true},
        createDate:{type: 'date'}
    }
};

export default new Realm({
    path:'njust.realm',
    schema: [
        SitedSchema, HttpCacheSchema
    ]
});
