/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-10-16 12:09:46
 * @version $Id$
 */

var func = function (message) {
  var userName = '';
  var passward = '';

  // 登陆
  if (message === 'loginIn') {
    this.loginState = 'loginIn';
  }

  // 注册
  else if(message === 'loginOn') {
    this.loginState = 'loginOn';
  }

  // 登陆校验
  else if (message === 'loginInConfirm') {
    userName = 'lvhongbin';
    passward = '12345687';
    if (this.loginInUserName === userName && this.loginInPassward === passward){
      this.loginState = 'loginInSuccess';
    }
    else {
      this.loginState = 'default';
      alert('loginInFail');
    }
  }
  else if(message === 'loginInCancle') {
    this.loginState = 'default';
  }

  // 注册校验
  else if (message === 'loginOnConfirm') {
    userName = 'lvhongbin';
    passward = '12345687';
    if (this.loginOnUserName === userName &&
        this.loginOnPassward1 === passward &&
        this.loginOnPassward2 === passward){
        alert('loginOnSuccess');
        this.loginState = 'default';
    }
    else {
      this.loginState = 'default';
      alert('loginOnFail');
    }
  }
  else if(message === 'loginOnCancle') {
    this.loginState = 'default';
  }
  else if(message === 'inputData') {
    this.loginState = 'inputData';
  }

  // 输入数据校验
  else if (message === 'inputConfirm') {
    var data = {
      userId: this.userId,
      data: this.date,
      hour: this.hour,
      passengerNum: this.passengerNum
    }
    alert(`数据校验\n
      ${JSON.stringify(data)}`);
    this.loginState = 'loginInSuccess';
  }
  else if(message === 'inputCancle') {
    this.loginState = 'loginInSuccess';
  }

  // 登出
  else if(message === 'logout') {
    this.loginState = 'default';
    clearLoginInfo();
  }
}

var clearLoginInfo = function() {
	this.loginInUserName = '';
  this.loginInPassward = '';
  this.loginOnUserName = '';
  this.loginOnPassward1 = '';
  this.loginOnPassward2 = '';
}

export {func}

