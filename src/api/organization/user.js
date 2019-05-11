import {Config} from '../../doc/config';

export function serviceLogin(email,password){    
    let formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"login", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':'application/json; version=1'
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


export function serviceLogout(email){    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"logout", {
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

export function serviceRequestPassword(email){    
    let formdata = new FormData();
    formdata.append("email", email);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"password_resets", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':'application/json; version=1',
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
export function serviceResetPassword(pw,confirm,id){    
    let formdata = new FormData();
    formdata.append("user[passwor]", pw);
    formdata.append("user[password_confirmation]", confirm);
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"password_resets/" + id, {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':'application/json; version=1',
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

export function serviceMyAccount(){        
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"me", {
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
export function serviceCreateUser(userInfo){
    let formdata = new FormData();
    formdata.append("user[email]", userInfo.email);
    formdata.append("user[password]", userInfo.pw);
    formdata.append("user[password_confirmation]", userInfo.confirmPw);
    formdata.append("user[name]", userInfo.name);
    formdata.append("user[phone]", userInfo.phone);

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"users", {
        method: 'POST',
        headers: {
            'Authorization': Config.Authorization,
            'Accept':'application/json; version=1'
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
export function serviceUpdateUser(userInfo){
    let formdata = new FormData();
    formdata.append("user[email]", userInfo.email);
    formdata.append("user[password]", userInfo.pw);
    formdata.append("user[password_confirmation]", userInfo.confirmPw);
    formdata.append("user[name]", userInfo.name);
    formdata.append("user[phone]", userInfo.phone);

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"users", {
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