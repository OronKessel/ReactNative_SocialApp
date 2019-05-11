import {Config} from '../../doc/config';

export function serviceGetFilters(){
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"filters", {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept,
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


export function serviceGetFilter(id){    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"filters/" + id, {
        method: 'GET',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':Config.Accept,
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