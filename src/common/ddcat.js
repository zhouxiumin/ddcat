import {fetchOrFromCache} from "../util/httpCache";

const DOMParser = require('xmldom').DOMParser;
import cio from 'cheerio';
import {getTagContent} from "../util/dbSource";

class DDCatContainer {
    _configs;
    context = null;
    _config = {};
    _currentPlugin;

    supportParseOptions = ["parse", "parseUrl","parseurl", "buildUrl","buildurl", "buildArgs", "buildargs", "buildCookie", "buildcookie", "buildRef","buildref", "buildCookie", "onparse"];

    constructor(importedContext) {
        this.context = importedContext;
        this._configs = {};
    }

    getConfigs() {
        return this._configs;
    }

    setCurrentPlugin(Name) {
        this._currentPlugin = this._configs[Name];
    }

    getCurrentPlugin() {
        return this._currentPlugin;
    }

    installNewPlugin(plugin) {
        const doc = new DOMParser().parseFromString(plugin);
        const title = getTagContent(doc, 'title');
        if (this._configs.hasOwnProperty(title)) {
            return;
        }
        const expr = getTagContent(doc, 'expr');
        const url = getTagContent(doc, 'url');
        const code = getTagContent(doc, 'code');
        const encode = getTagContent(doc, 'encode') || 'utf-8';

        const mainConfig = this.parseMainNode(plugin);
        this.injectFunc(mainConfig, code);

        this._configs[title] = {
            sited: plugin,
            expr: expr,
            url: url,
            encode:encode,
            code: code.replace(/"\s*use\s+strict\s*"\s*;/g, ""),
            main: mainConfig
        };
    };

    matchTagByUrl(url) {
        const plugin = this.getCurrentPlugin();

        const tag = plugin.main.tag;
        if (!tag) {
            return null;
        }
        for (let i=0;i<tag.length;i++) {
            let t = tag[i];
            if (t && t.expr) {
                let re = new RegExp(t.expr);
                if (url.match(re)) {
                    return t;
                }
            }
        }
        return null;
    }

    injectFunc(mainConfig, code) {
        let cheerio = cio;
        let SiteD = {
            ver: 32,
            udid: 'isl3ld9dl2',
            uid: '302',
            uvip:2,
            ulevel: 10
        };
        let Base64 = require('./base64').Base64;
        console.log(Base64);
        let self = this;
        let opts = self.supportParseOptions;
        eval(code);
        const replaceArrayFunc = (array, config) =>{
            array.forEach(item => {
                let nodes = config[item];
                if (nodes && nodes.length > 0) {
                    nodes.forEach(function (item) {
                        for (let i = 0; i < opts.length; i++) {
                            if (item['attribs'].hasOwnProperty(opts[i])) {
                                let p = item['attribs'][opts[i]];
                                if (eval("typeof "+p+" !=='undefined'")){
                                    eval('item[\'attribs\'][opts[i]] = ' + p + ';');
                                }else {
                                    item['attribs'][opts[i]] = function (url, html) {
                                        return [];
                                    }
                                }
                            }
                        }
                    });
                }
            });
        };
        const replaceFunc = (obj) =>{
            if (obj) {
                for (let i = 0; i < opts.length; i++) {
                    if (obj.hasOwnProperty(opts[i])) {
                        let p = obj[opts[i]];
                        if (eval("typeof "+p+" !=='undefined'")){
                            eval('obj[opts[i]] = ' + p + ';');
                        }else {
                            obj[opts[i]] = function (url, html) {
                                return [];
                            }
                        }
                    }
                }
            }
        };
        replaceArrayFunc(['tag', 'book', 'section'], mainConfig);
        if(mainConfig['book'] &&mainConfig['book'].length>0){
            for(let j=0;j<mainConfig['book'].length;j++){
                let bookConfig =mainConfig['book'][j];
                if (bookConfig['sections'] &&bookConfig['sections'].length>0) {
                    replaceArrayFunc(['sections'], bookConfig);
                }
            }
        }
        replaceArrayFunc(['sections'], mainConfig);

        replaceFunc(mainConfig['search']);

        let home = mainConfig['home'];
        if (home) {
            replaceFunc(home['hots']);
            replaceFunc(home['updates']);
            if (home['tags']){
                replaceFunc(home['tags']['attribs']);

            }
        }
    }

    getSingleNode($doc, selector) {
        let nodes = $doc(selector);
        if (nodes && nodes.length > 0) {
            return nodes[0];
        } else {
            return null;
        }
    }

    parseMainNode(plugin) {
        let $ = cio.load(plugin);
        let main = $('main')[0];
        let config = {
            dtype: main.attribs.dtype,
            durl: main.attribs.durl
        };
        let homeConfig = {};
        let home = this.getSingleNode($, 'main home');
        if (home !== null) {
            let hots = this.getSingleNode($, 'main home hots');
            if (hots) {
                Object.assign(homeConfig, {hots: hots.attribs});
            }
            let tags = this.getSingleNode($, 'main home tags');
            if (tags) {
                Object.assign(homeConfig, {tags: {attribs: tags.attribs}});
                let items = [];
                let itemNodes = $('main home tags item');
                if (itemNodes && itemNodes.length > 0) {
                    itemNodes.each(function (index, item) {
                        items.push(item.attribs);
                    });
                    homeConfig['tags']['items'] = items;
                }
            }
            let updates = this.getSingleNode($, 'main home updates');
            if (updates) {
                Object.assign(homeConfig, {updates: updates.attribs});
            }
            Object.assign(config, {home: homeConfig});
        }
        let search = this.getSingleNode($, 'main search');
        if (search) {
            Object.assign(config, {search: search.attribs});
        }
        ['tag', 'book', 'section'].forEach(function (item) {
            let nodes = $('main ' + item);
            if (nodes && nodes.length > 0) {
                let items = [];
                // nodes.each(function (index, item) {
                //     items.push({attribs:item.attribs});
                // });
                for (let i=0;i<nodes.length;i++){
                    let node_item = {attribs:nodes.eq(i)[0].attribs};
                    items.push(node_item);
                    let inerfunc = nodes.eq(i);
                    if(item==='book') {
                        let sections = inerfunc.find('sections');
                        // console.log(sections);
                        if(sections &&sections.length>0) {
                            node_item['sections'] = [];
                            for(let j=0;j<sections.length;j++){
                                if (sections.eq(i)[0] && sections.eq(i)[0].attribs){
                                    node_item['sections'].push({attribs:sections.eq(i)[0].attribs});
                                }
                            }
                        }
                    }
                }
                config[item] = items;
            }
        });
        return config;
    }

    getNodeData(url, config, encode='utf-8',page = 1,forceUpdate = false) {
        if (config.onparse && ! config.parse) {
            config.parse = config.onparse;
        }
        if (config.parseurl && ! config.parseUrl) {
            config.parseUrl = config.parseurl;
        }
        if (config.buildurl && ! config.buildUrl) {
            config.buildUrl = config.buildurl;
        }
        if (config.buildargs && ! config.buildArgs) {
            config.buildArgs = config.buildargs;
        }
        if (config.buildcookie && ! config.buildCookie) {
            config.buildCookie = config.buildcookie;
        }
        if (config.buildref && ! config.buildRef) {
            config.buildRef = config.buildref;
        }
        let request = this.prepareNewRequest(url, config, page);
        url = request.url;
        let expire  = 0;
        if(config.cache && !forceUpdate){
            expire = 1;
        }
        return fetchOrFromCache(url, request, expire, encode)
            .then((html)=>{
            let promises;
            let parseUrlResultSet;
            let parseUrlResult;
            if (config.parseUrl) {
                parseUrlResult = config.parseUrl(url, html);
                if (parseUrlResult) {
                    parseUrlResultSet = parseUrlResult.split(";").filter((item)=>(item &&item.length>0));
                }
            }
            if (parseUrlResultSet && (parseUrlResultSet.length > 1 || parseUrlResultSet[0] !== url)) {
                promises = this.prepareNewRequests(parseUrlResultSet, config).map(function (option, index) {

                    return fetchOrFromCache(option.url, option, expire, encode).then(function (html) {
                        if (parseUrlResultSet[index].toUpperCase().startsWith("CALL")) {
                            return config.parseUrl(option.url, html);
                        } else {
                            return [{url: option.url, body: html}];
                        }
                    }, function (reason) {
                        console.log('reason');
                        console.log(option.url);
                        console.log(reason);
                        return [{url: url, body: html}];
                    });
                });
            }
            return new Promise((resolve, reject)=>{
                if (promises && Array.isArray(promises) && promises.length > 0) {
                    Promise.all(promises).then(function (results) {
                        const r = [];
                        for(let i=0;i<results.length;i++) {
                            r.push(results[i][0]);
                        }
                        resolve(r);
                    },function (reason) {
                        console.log(reason, "something went wrong at promises");
                        throw reason;
                    });
                } else {
                    resolve([{url: url, body: html}]);
                }
            });
        }).then(function (results) {
            let listObj = [];
            // console.log(results);
            // console.log(config);
            results.forEach(function (result) {
                try {
                    const obj = JSON.parse(config.parse(result.url, result.body));
                    if (Array.isArray(obj)) {
                        listObj = listObj.concat(obj);
                    } else {
                        listObj.push(obj);
                    }
                } catch (e) {
                    console.log(e);
                    listObj.push(config.parse(result.url, result.body));
                }
            });
            return listObj;
        }, function (reason) {
            console.log(reason, "something went wrong at parseUrl");
            throw reason;
        })
    }

    prepareNewRequest(url, config, page =1) {
        const parseUrlResult = url.split("::");
        const request = {};
        const header = new Headers();
        let newMethod = "";
        let newUrl = url;
        let args = "";
        if (parseUrlResult.length > 1) {
            newUrl = parseUrlResult[parseUrlResult.length - 1];
            if (parseUrlResult.length > 2) {
                newMethod = parseUrlResult[parseUrlResult.length - 2];
            }
        } else {
            newUrl = parseUrlResult[0];
        }
        if (config.buildUrl) {
            newUrl = config.buildUrl(newUrl, page);
        }
        if (config.buildArgs) {
            args += config.buildArgs(newUrl);
            // args = parseQueryString(args);
            // request.body = JSON.stringify(args);
            request.body = args.replace(/;/g, "&");
        }
        if (config.buildRefer) {
            header.set("Referer", config.buildRefer(newUrl));
        }
        if (config.buildHeader) {
            let k, v;
            config.buildHeader(newUrl).split(";").forEach(function (x) {
                [k, v] = x.split("=");
                header.append(k, v);
            });
        }
        if (config.buildCookies) {
            let cookie = config.buildCookies(newUrl, config.cookie);
            this.updateCookie(cookie, config);
            request.credentials = "same-origin";
        }
        header.set("Cache-Control", 'no-cache');
        request.url = newUrl;
        request.method = newMethod || config.method;
        request.headers = header;
        return request;
    }

    prepareNewRequests(urlCallSet, config) {
        const cacheThis = this;
        return urlCallSet.map(function (callUrl) {
            return cacheThis.prepareNewRequest(callUrl,config);
        });
    };


    // 以下代码暂时没用


    parseQueryString(search) {
        let json = {};
        search.split(";").forEach(function (pair) {
            let [k, v] = pair.split("=");
            json[k] = v;
        });
        return json;
    };

    getFirstLevelHostName() {
        let hostname = location.hostname;
        return hostname.replace("www.", "");
    };

    updateCookie(newCookie, config) {
        this.removeAllCookie(config);
        newCookie.split(";").forEach(function (currentValue) {
            config.cookies = currentValue + ";path=/;domain=" + this.getFirstLevelHostName();
        });
    };

    removeAllCookie(config) {
        config.cookies.split(";").forEach(function (currentValue, index, array) {
            config.cookies = currentValue + ";expires=" + new Date().toGMTString() + ";path=/;domain=" + this.getFirstLevelHostName();
        });
    };

}


export default new DDCatContainer()