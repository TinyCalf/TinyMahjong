//local

// var URL = "http://192.168.0.115:9000";
var URL = "http://192.168.0.101:9000";
//DEV SERVER
//var URL = "http://139.219.224.143:9000";
//FORMAL SERVER
//var URL = "http://119.23.250.115:9000";

cc.VERSION = 20171111;
var HTTP = cc.Class({
    extends: cc.Component,

    statics:{
        sessionId : 0,
        userId : 0,
        master_url:URL,
        url:URL,
        sendRequest : function(path,data,handler,extraUrl){
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            for(var k in data){
                if(str != "?"){
                    str += "&";
                }
                str += k + "=" + data[k];
            }
            if(extraUrl == null){
                extraUrl = HTTP.url;
            }
            var requestURL = extraUrl + path + encodeURI(str);
            console.log("RequestURL:" + requestURL);
            xhr.open("GET",requestURL, true);
            if (cc.sys.isNative){
                xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
            }

            xhr.onreadystatechange = function() {
                console.log(xhr);
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                    console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if(handler !== null){
                            handler(ret);
                        }                        /* code */
                    } catch (e) {
                        console.log("err:" + e);
                        //handler(null);
                    }
                    finally{
                        if(cc.vv && cc.vv.wc){
                        //       cc.vv.wc.hide();
                        }
                    }
                }
                else{
                    console.log("status="+xhr.readyState)
                    //self.url = "http://139.219.224.143:9000";
                    //HTTP.url = "http://139.219.224.143:9000";
                }
            };

            if(cc.vv && cc.vv.wc){
                //cc.vv.wc.show();
            }
            xhr.send();
            return xhr;
        },
    },
});
