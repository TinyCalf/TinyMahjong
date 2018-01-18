"use strict";
cc._RFpush(module, '90ae61J525JQIt5taF3Nce2', 'HTTP');
// scripts\HTTP.js

//local

//var URL = "http://192.168.0.102:9000";
var URL = "http://116.62.227.93:9000";

cc.VERSION = 20180000;
var HTTP = cc.Class({
    "extends": cc.Component,

    statics: {
        sessionId: 0,
        userId: 0,
        master_url: URL,
        url: URL,
        sendRequest: function sendRequest(path, data, handler, extraUrl) {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            for (var k in data) {
                if (str != "?") {
                    str += "&";
                }
                str += k + "=" + data[k];
            }
            if (extraUrl == null) {
                extraUrl = HTTP.url;
            }
            var requestURL = extraUrl + path + encodeURI(str);
            console.log("RequestURL:" + requestURL);
            xhr.open("GET", requestURL, true);
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            }

            xhr.onreadystatechange = function () {
                console.log(xhr);
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                    console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if (handler !== null) {
                            handler(ret);
                        } /* code */
                    } catch (e) {
                        console.log("err:" + e);
                        //handler(null);
                    } finally {
                        if (cc.vv && cc.vv.wc) {
                            //       cc.vv.wc.hide();
                        }
                    }
                } else {
                        console.log("status=" + xhr.readyState);
                        //self.url = "http://139.219.224.143:9000";
                        //HTTP.url = "http://139.219.224.143:9000";
                    }
            };

            if (cc.vv && cc.vv.wc) {
                //cc.vv.wc.show();
            }
            xhr.send();
            return xhr;
        }
    }
});

cc._RFpop();