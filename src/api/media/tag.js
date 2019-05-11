import {Config} from '../../doc/config';

export function serviceCreateTag(group,name){ 
    let formdata = new FormData();
    formdata.append("tag[group]", name);
    formdata.append("tag[name]", group);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/tags", {
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


export function serviceUpdateTag(id,group,name){    
    let formdata = new FormData();
    formdata.append("tag[group]", name);
    formdata.append("tag[name]", group);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/tags/" + id, {
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

export function serviceDeleteTag(group,id){        
    let formdata = new FormData();
    formdata.append("tag[group]", group);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/tags/" + id, {
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
export function serviceGetAllTags(group){
    let formdata = new FormData();
    formdata.append("tag[group]", group);    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"media/tags", {
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

export function serviceGetTags(){    
    var url = Config.BASE_URL + "tags?type=Medium";
    return new Promise(function(resolve, reject) {        
        fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV2,
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

export function serviceGetTag(id){    
    var url = Config.BASE_URL + "tags/" + id + "?type=Medium";
    return new Promise(function(resolve, reject) {        
        fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV2,
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
            console.warn('Error' + error);
            reject(error);
        });
    });    
}

export function serviceSearch(name,type,tags,page){    
    var url = Config.BASE_URL + "media/search";
    let formdata = new FormData();
    formdata.append("name", name);
    formdata.append("type", type);
    formdata.append("tags", tags);
    formdata.append("per_page", 25);
    formdata.append("page", page);
    console.warn(formdata);
    return new Promise(function(resolve, reject) {        
        fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.AcceptV2,
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
            console.warn('Error' + error);
            reject(error);
        });
    });    
}

