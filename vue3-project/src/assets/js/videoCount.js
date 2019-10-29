/* 视频播放埋点 */
export default {
    start(){
        return Date.parse(new Date()) / 1000
    },
    end(){
        return Date.parse(new Date()) / 1000
    },
    send(data={}){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("post", "", false);//http://192.168.41.11:3000/api/submit
        xmlHttp.setRequestHeader('content-type', 'application/json');
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4)
            if (xmlHttp.status == 200) {
              var data = xmlHttp.responseText;
              console.log(data);
            }
        };
        var obj = {
            actionName: '',//动作内容
            customerOpenId: '',//用户openId
            shareRecordId: '',//分享Id
            actionEndTimestamp: '',//动作结束时间
            actionStartTimestamp: '',//动作开始时间
            customerInfoActionId: ''//用户操作id
        }
        Object.assign(obj,data);
        xmlHttp.send(JSON.stringify(obj))
    }
}
