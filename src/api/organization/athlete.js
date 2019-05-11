import {Config} from '../../doc/config';

export function serviceNewAthleteSearch(keyword){
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"athletes/search/?search=" + keyword, {
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


export function serviceAddAthlete(athInfo){    
    let formdata = new FormData();
    formdata.append("athlete[first_name]", athInfo.firstName);
    formdata.append("athlete[last_name]", athInfo.lastName);
    formdata.append("athlete[nick_name]", athInfo.nickName);
    formdata.append("athlete[phone]", athInfo.phone);
    formdata.append("athlete[email]", athInfo.email);
    formdata.append("athlete[graduation_year]", athInfo.gradYear);
    formdata.append("athlete[high_school]", athInfo.highSchool);
    formdata.append("athlete[state]", athInfo.state);
    formdata.append("athlete[coach_name]", athInfo.coachName);
    formdata.append("athlete[mothers_name]", athInfo.motherName);
    formdata.append("athlete[fathers_name]", athInfo.fatherName);
    formdata.append("athlete[athlete_id]", athInfo.athId);//Req
    formdata.append("athlete[twitter_id]", athInfo.twitterId);//Req
    formdata.append("athlete[follow_on_twitter]", athInfo.follow);
    formdata.append("athlete[position_tags]", athInfo.posTag);
    formdata.append("athlete[team_tags]", athInfo.teamTag);


    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"athletes", {
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

export function serviceUpdateAthlete(athInfo,id){    
    let formdata = new FormData();
    formdata.append("athlete[first_name]", athInfo.firstName);
    formdata.append("athlete[last_name]", athInfo.lastName);
    formdata.append("athlete[nick_name]", athInfo.nickName);
    formdata.append("athlete[phone]", athInfo.phone);
    formdata.append("athlete[email]", athInfo.email);
    formdata.append("athlete[graduation_year]", athInfo.gradYear);
    formdata.append("athlete[high_school]", athInfo.highSchool);
    formdata.append("athlete[state]", athInfo.state);
    formdata.append("athlete[coach_name]", athInfo.coachName);
    formdata.append("athlete[mothers_name]", athInfo.motherName);
    formdata.append("athlete[fathers_name]", athInfo.fatherName);

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"athletes/" + id, {
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
export function serviceGetAthletes(paramter){
    var url = Config.BASE_URL+"athletes" + "?page=" + paramter.page 
    + "&per_page=" + paramter.ppage + "&sort_column=" + paramter.sort
    + "&sort_dir=" + paramter.sortdir + "&search=" + paramter.search;
    return new Promise(function(resolve, reject) {        
        fetch(url, {
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
export function serviceGetAthlete(id){
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"athletes/" + id, {
        method: 'GET',
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
