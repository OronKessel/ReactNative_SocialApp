import {Config} from '../../doc/config';

export function serviceGetInbox(){ 
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages/inbox", {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV3,
            'X-Auth-Token':Config.AuthToken
        }
        })
        .then((response) => {
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceGetConversation(id){ 
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages/" + id + "/conversation", {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV3,
            'X-Auth-Token':Config.AuthToken
        }
        })
        .then((response) => {
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}


export function serviceGetMessages(){        
    var url = Config.BASE_URL+"messages" + "?include_all=false";
    return new Promise(function(resolve, reject) {        
        fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV4,
            'X-Auth-Token':Config.AuthToken
        }
        })
        .then((response) => {
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceGetMessage(id){        
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages/" + id, {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV4,
            'X-Auth-Token':Config.AuthToken
        }
        })
        .then((response) => {
            response.json()
            .then((res)=>{                
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceCreateMessage(msgInfo){    
    let formdata = new FormData();
    formdata.append("message[body]", msgInfo.body);
    formdata.append("message[athlete_ids]", msgInfo.athletes);
    formdata.append("message[filter_ids]", msgInfo.filters);
    formdata.append("message[send_at]", msgInfo.sendat);
    //if (msgInfo.media_id != '')
    formdata.append("message[media_id]", msgInfo.media_id);
    formdata.append("message[send_when_most_active]", msgInfo.mostactive);
    formdata.append("message[platform]", msgInfo.platform);

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV4,
            'X-Auth-Token':Config.AuthToken
        },
        body: formdata
        })
        .then((response) => {
            response.json()
            .then((res)=>{
                resolve(res);
                // console.warn(res);
                // if(response.status == '200')
                //     resolve(res);
                // else
                //     reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}


export function serviceCreateSms(body,recip,sendat,media_id,platform){    
    let formdata = new FormData();
    formdata.append("message[body]", body);
    formdata.append("message[recipients]", recip);
    formdata.append("message[send_at]", sendat);
    if (media_id != '')
        formdata.append("message[media_id]", media_id);
    formdata.append("message[platform]", platform);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV3,
            'X-Auth-Token':Config.AuthToken
        },
        body: formdata
        })
        .then((response) => {
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceCreateDM(body,recip,sendat,media_id,platform){        
    let formdata = new FormData();
    formdata.append("message[body]", body);
    formdata.append("message[recipients]", recip);
    formdata.append("message[send_at]", sendat);
    if (media_id != '')
        formdata.append("message[media_id]", media_id);
    formdata.append("message[platform]", platform);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV3,
            'X-Auth-Token':Config.AuthToken
        },
        body: formdata
        })
        .then((response) => {
            response.json()
            .then((res)=>{                
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}
export function serviceUpdateMessage(messageInfo,id){
    let formdata = new FormData();
    formdata.append("message[platform]", messageInfo.platform);
    formdata.append("message[body]", messageInfo.body);
    formdata.append("message[athlete_ids]", messageInfo.athletes);
    formdata.append("message[filter_ids]", messageInfo.filters);
    formdata.append("message[send_at]", messageInfo.sendat);
    formdata.append("message[media_id]", messageInfo.media_id);

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages/" + id, {
        method: 'PUT',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV4,
            'X-Auth-Token':Config.AuthToken
        },
        body: formdata
        })
        .then((response) => {
            response.json()
            .then((res)=>{                
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}
export function serviceCancelMessage(id){
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"cancel/" + id, {
        method: 'PUT',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV3,
            'X-Auth-Token':Config.AuthToken
        }
        })
        .then((response) => {
            response.json()
            .then((res)=>{                
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceDeleteMessage(status,id){    
    var url = Config.BASE_URL+"messages/" + id + "?message[status]=" + status;
    return new Promise(function(resolve, reject) {        
        fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV3,
            'X-Auth-Token':Config.AuthToken
        }
        })
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceMarkAsRead(id,type){
    let formdata = new FormData();
    formdata.append("id", id);   
    formdata.append("type", type);   

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages/mark_as_read", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV3,
            'X-Auth-Token':Config.AuthToken
        },
        body: formdata
        })
        .then((response) => {
            response.json()
            .then((res)=>{                
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceMarkAsUnread(id,type){
    let formdata = new FormData();
    formdata.append("id", id);   
    formdata.append("type", type);   

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"messages/mark_as_unread", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV3,
            'X-Auth-Token':Config.AuthToken
        },
        body: formdata
        })
        .then((response) => {
            response.json()
            .then((res)=>{                
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}