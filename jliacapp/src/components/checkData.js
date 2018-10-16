/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-10-16 16:37:35
 * @version $Id$
 */
var checkData = function (data) {
	let xhr;
	if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xhr=new XMLHttpRequest();
	} else{
			// code for IE6, IE5
			// vue中不支持使用ActiveXObject
			// xhr=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.timeout = 3000;
	xhr.ontimeout = function (event) {
		alert(event + "请求超时！");
  }
  xhr.open('POST', 'http://localhost:8080/submitData', true);
  xhr.send(data);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
			this.loginState = 'loginInSuccess';
			if (xhr.responseText !== 'OK') {
				alert(xhr.responseText);
			}
    }
    else {
			alert(xhr.statusText);
    }
  }
}

export {checkData}

