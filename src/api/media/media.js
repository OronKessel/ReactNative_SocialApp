import {Config} from '../../doc/config';
import {Platform} from 'react-native';
export function serviceGetAllMedia(owner,group){ 
    let formdata = new FormData();
    formdata.append("media[owner]", owner);
    formdata.append("media[group]", group);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media", {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept
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


export function serviceGetSingleMedia(id,owner,group){    
    let formdata = new FormData();
    formdata.append("media[owner]", owner);
    formdata.append("media[group]", group);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/" + id, {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept
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

export function serviceCreateMedia(mediaInfo){        
    let formdata = new FormData();
    formdata.append("media[owner]", mediaInfo.owner);
    formdata.append("media[group]", mediaInfo.group);
    formdata.append("media[oauth_token]", mediaInfo.token);
    formdata.append("media[oauth_secret]", mediaInfo.secret);
    //formdata.append("media[object]", Platform.OS === "android" ? mediaInfo.uri : mediaInfo.uri.replace("file://", ""));
    //formdata.append("media[object]", mediaInfo.file);
    var date = new Date();
    formdata.append('media[object]', {
        uri:
            Platform.OS === "android" ? mediaInfo.uri : mediaInfo.uri.replace("file://", ""),
        type:'image/jpeg',
        name:date.getTime().toString()
    });
    formdata.append("media[name]", "");

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/upload", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept,
            'Content-Type': 'multipart/form-data'
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
export function serviceUpdateMedia(id,mediaInfo){
    let formdata = new FormData();
    formdata.append("media[owner]", mediaInfo.owner);
    formdata.append("media[group]", mediaInfo.group);
    formdata.append("media[oauth_token]", mediaInfo.token);
    formdata.append("media[oauth_secret]", mediaInfo.secret);
    formdata.append("media[object]", mediaInfo.obj);
    formdata.append("media[name]", mediaInfo.name);

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"api/media/" + id, {
        method: 'PUT',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept
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

export function serviceDeleteMedia(id,owner,group){
    let formdata = new FormData();
    formdata.append("media[owner]", owner);    
    formdata.append("media[group]", group);    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/" + id, {
        method: 'DEL',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept
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

export function serviceAddTagToMedia(id,owner,group,tag){
    let formdata = new FormData();
    formdata.append("media[owner]", owner);    
    formdata.append("media[group]", group);    
    formdata.append("media[tag]", tag);    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/" + id + "/add_tag", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept
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

export function serviceRemoveTagFromMedia(id,owner,group,tag){
    let formdata = new FormData();
    formdata.append("media[owner]", owner);    
    formdata.append("media[group]", group);    
    formdata.append("media[tag]", tag);    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/" + id + "/remove_tag", {
        method: 'DEL',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept
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

export function serviceSearch(searchInfo){
    let formdata = new FormData();
    formdata.append("media[owner]", searchInfo.owner);    
    formdata.append("media[group]", searchInfo.group);    
    formdata.append("name", searchInfo.name);    
    formdata.append("type", searchInfo.type);
    formdata.append("tags", searchInfo.tag);

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/search", {
        method: 'DEL',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept
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
