function login(){
    document.getElementById("loginindicator").style.visibility = "visible";
    var Request= new XMLHttpRequest();
    Request.open("POST", "/login", true);
    Request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    Request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          window.location.replace(this.responseURL);
        }
      };

    var un=document.getElementById("lusername").value;
    var pw=document.getElementById("lpassword").value;
    Request.send("username="+un+"&password="+pw);
}

function signup(){
    document.getElementById("signupindicator").style.visibility = "visible";
    var Request= new XMLHttpRequest();
    Request.open("POST", "/signup", true);
    Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    const un=document.getElementById("susername").value;
    const pw=document.getElementById("spassword").value;
    Request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          window.location.replace(this.responseURL);
        }
      };
    Request.send("username="+un+"&password="+pw);
}

function annotate(id,type){
  var Request= new XMLHttpRequest();
  if(type==1){
  Request.open("POST", "/toread/"+id, true);
  }
  else{
    Request.open("POST", "/completed/"+id, true);
  }
  Request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  const note=document.getElementById(id).getElementsByTagName("textarea")[0];

  if(note.value==""){
    note.value="";
  }
  Request.onreadystatechange = function() {
      if (this.readyState == 4) {
        note.value=""
        document.getElementById(id).getElementsByTagName("P")[0].innerHTML=this.responseText;

      }
    };

  Request.send("notes="+note.value);

}



