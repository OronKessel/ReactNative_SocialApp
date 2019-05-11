import {Platform} from 'react-native';
export function formatDate(date) {
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    m = m < 10 ? "0" + m : m;      
    h = h < 10 ? "0" + h : h;   
    var pattern = new RegExp("0?" + hh + ":" + m);  
    var replacement = h + ":" + m;
    replacement += " " + dd;  
    return replacement;
}

export function getDay(date) {
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return days[date.getDay()];
}

export function getFormattedDate(date) {
  if (date == undefined) return "";
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var res = date.toString().split('-');
  //console.warn(res);
  var dateObj = new Date();
  dateObj.setYear(parseInt(res[0]));
  dateObj.setMonth(parseInt(res[1]) - 1);
  dateObj.setDate(parseInt(res[2]));
  month = months[parseInt(res[1]) - 1];
  day = days[dateObj.getDay()];
  date = dateObj.getDate();
  return day + ", " + month + " " + date + ", "
}

export function validateTime(hour,min,zone)
{
  var date = new Date();
  var pickDate = new Date();  
  if (zone == 1)
  {
    pickDate.setHours(hour + 12)
  }
  else
  {
    pickDate.setHours(hour);
  }  
  pickDate.setMinutes(min);
  if (date.getTime() < pickDate.getTime())
  {
    return true;
  }
  return false;
}

export function getDateString(date)
{  
  
  var res = date.toString().split('-');
  sendAtString = res[1] + "/" + res[2] + "/" + res[0];
  return sendAtString;
}

export function getDateTimeStringQuote(date)
{  
  
  sendAtString = ("0" + (date.getMonth() + 1)).slice(-2) + "/" 
            +  ("0" + date.getDate()).slice(-2)  + "/"  + date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  if (date.getHours() >= 12)
    sendAtString = sendAtString + " PM";
  else sendAtString = sendAtString + " AM";
  return sendAtString;
}

export function getDateTimeString(date)
{ 
  sendAtString = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  if (date.getHours() >= 12)
    sendAtString = sendAtString + " PM";
  else sendAtString = sendAtString + " AM";
  return sendAtString;
}
export function validateDate(date)
{
  if (date == undefined) return 2;
  var dateObj = new Date();
  var res = date.toString().split('-');
  dateObj.setYear(parseInt(res[0]));
  dateObj.setMonth(parseInt(res[1]) - 1);
  dateObj.setDate(parseInt(res[2]));

  var now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);

  dateObj.setHours(0);
  dateObj.setMinutes(0);
  dateObj.setSeconds(0);
  
  if (now.getTime() < dateObj.getTime())      
  {
     return 0;
  }
  else if (now.getTime() == dateObj.getTime())      
  {
    return 1;
  }
  else 
  {
    return 2;
  }  
}