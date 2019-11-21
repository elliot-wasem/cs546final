function login(){

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




