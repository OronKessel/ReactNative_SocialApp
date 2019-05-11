import {Config} from '../../doc/config';

export function serviceRegisterDevice(userid,type,token){
    let formdata = new FormData();
    formdata.append("push[identity]", userid);
    formdata.append("push[type]", type);
    formdata.append("push[address]", token);
    //console.warn(token);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"push_notifications/register", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept,
            'X-Auth-Token':Config.AuthToken
        },
        body: formdata
        })
        .then((response) => {
            resolve(res);
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

