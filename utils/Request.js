const request = require('request');

exports.get = async (data, url = null, headers = {}, callback) => {
    let res = null;
    if(url) {
        res = await sendRequest(data, getUrl(data, url), 'get', headers, callback);
    }else {
        res = await sendRequest({}, data, 'get', headers, callback);
    }
    return res;
}

exports.post = async (data, url = null, headers = {}, callback) => {
    let res = null;
    if(url) {
        res = await sendRequest(data, url, 'post', headers, callback);
    }else {
        res = await sendRequest({}, data, 'post', headers, callback);
    }
    return res;
}

getUrl = (data, url) => {
    let _url = `${url}?`;
    for(let key in data) {
        _url += `&${key}=${data[key]}`;
    }
    return _url;
}

sendRequest = (data, url, type, headers, callback) => {
    return new Promise ((resolve, reject) => {
        if(type == 'get') {
            request.get(url, (error, response, body) => {
                if(callback) callback(JSON.parse(body));
                resolve(JSON.parse(body));
            })
        }else {
            request({
                    method: 'POST',
                    uri: url,
                    headers: headers,
                    body: JSON.stringify(data)
                },
                (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        if(callback) callback(JSON.parse(body));
                        resolve(JSON.parse(body));
                    }
                })
        }
    });
}