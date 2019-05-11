import {Config} from '../../doc/config';

export function serviceGetTeamMembers(){
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"team/members", {
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


export function serviceGetTeamMember(id){    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"team/members/" + id, {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':'application/json; version=1',
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

export function serviceInviteTeamMember(userInfo){    
    let formdata = new FormData();
    formdata.append("user[email]", userInfo.email);
    formdata.append("user[first_name]", userInfo.firstName);
    formdata.append("user[last_name]", userInfo.lastName);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"team/members", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':'application/json; version=1',
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