function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
GetAppleID=function(){

    var e=document.getElementById('email');
    //window.alert(e.value);
    var email= e.value;
    var req_result=document.getElementById('request_result');
    req_result.innerHTML='لطفا صبر کنید';
    if(validateEmail(email)) {

        console.log('Calling url');
        var theUrl = "/getID/?email=" + email;
        console.log('email: ' + email);
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        var res = xmlHttp.responseText;

        req_result.innerHTML=res;
        //window.alert(res);
    }
    else
    {
        var s="<p class=\"email_error\">ایمیل درست نیست</p>";
        req_result.innerHTML=s;
    }

};
sendMessage=function()
{
    //alert("daryaft shod");
    var name=document.getElementById('name_email').value;
    var email=document.getElementById('email_email').value;
    var text=document.getElementById('text_email').value;
    console.log(text);
    console.log(document.getElementById('text_email').textContent);
    var result=document.getElementById('result_email');

    console.log("Yeki lotf kar message dad "+email+" "+name+" "+text);
    if(validateEmail(email))
    {
        console.log('Calling url');
        var theUrl = "/receiveEmail?email=" + email+"&name="+name+"&text="+text;
        console.log('email: ' + email);
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        var res = xmlHttp.responseText;
        result.innerHTML=res;
    }
    else{
        var error=document.getElementById('p_bottom');
        if (error==null) {
            error= document.createElement('p');
            error.setAttribute('id','p_bottom');
        }
        error.innerHTML="ایمیل درست نیست";
        result.appendChild(error);

    }

};