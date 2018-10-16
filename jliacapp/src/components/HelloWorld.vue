<template>
  <div class="hello login">
    <h1>{{ msg }}</h1>
    <div class="loginButton" v-if="loginState === 'default'">
      <label for="loginIn" class="text">登陆</label><button id="loginIn" class="hideButton" v-on:click="say('loginIn')"></button>
      <label for="loginOn" class="text">注册</label><button id="loginOn" class="hideButton" v-on:click="say('loginOn')"></button>
    </div>
    <div v-else-if="loginState === 'loginIn'" class="shadow">
        <ul>
          <li><span>用戶名： </span><input v-model="loginInUserName" type="" name=""></li>
          <li><span>密码： </span><input v-model="loginInPassward" type="password" name=""></li>
          <li><label for="loginInConfirm" class="text">確定</label></li>
          <li><label for="loginInCancle" class="text">取消</label></li>
        <button id="loginInConfirm" class="hideButton" v-on:click="say('loginInConfirm')"></button>
        <button id="loginInCancle" class="hideButton" v-on:click="say('loginInCancle')"></button>
        </ul>
    </div>
    <div v-else-if="loginState === 'loginOn'" class="shadow">
        <ul>
          <li><span>用戶名： </span><input v-model="loginOnUserName" type="" name=""></li>
          <li><span>密码： </span><input v-model="loginOnPassward1" type="password" name=""></li>
          <li><span>在输一次密码： </span><input v-model="loginOnPassward2" type="password" name=""></li>
          <li><label for="loginOnConfirm" class="text">确定</label></li>
          <li><label for="loginOnCancle" class="text">取消</label></li>
          <button id="loginOnConfirm" class="hideButton" v-on:click="say('loginOnConfirm')"></button>
          <button id="loginOnCancle" class="hideButton" v-on:click="say('loginOnCancle')"></button>
        </ul>
    </div>
    <div v-else-if="loginState === 'loginInSuccess'">
      <div class="loginInSuccess">
        <span>{{ loginInUserName }}, 欢迎您</span>
        <label for="logout" class="logout">&nbsp;&nbsp;登出</label><button id="logout" class="hideButton" v-on:click="say('logout')"></button>
      </div>
      <label for="inputData" class="text">输入资料</label><button id="inputData" class="hideButton" v-on:click="say('inputData')"></button>
    </div>
    <div v-else-if="loginState === 'inputData'" class="shadow">
        <div class="loginInSuccess">
          <span>{{ loginInUserName }}, 欢迎您</span>
          <label for="logout" class="logout">&nbsp;&nbsp;登出</label><button id="logout" class="hideButton" v-on:click="say('logout')"></button>
        </div>
        <ul>
          <li><span>用户id： </span><input v-model="userId" type="" name=""></li>
          <li><span>日期： </span><input v-model="date" type="" name=""></li>
          <li><span>小时： </span><input v-model="hour" type="" name=""></li>
          <li><span>乘员数量： </span><input v-model="passengerNum" type="" name=""></li>
          <li><label for="inputConfirm" class="text">确定</label></li>
          <li><label for="inputCancle" class="text">取消</label></li>
          <button id="inputConfirm" class="hideButton" v-on:click="say('inputConfirm')"></button>
          <button id="inputCancle" class="hideButton" v-on:click="say('inputCancle')"></button>
        </ul>
    </div>
    <div v-else-if="loginState === 'startAutoMode'" class="shadow">
        <div class="loginInSuccess">
          <span>{{ loginInUserName }}, 欢迎您</span>
          <label for="logout" class="logout">&nbsp;&nbsp;登出</label><button id="logout" class="hideButton" v-on:click="say('logout')"></button>
        </div>
        <ul>
          <li><h2>是否根据一下参数开启自动模式</h2></li>
          <li><span class="responseText">{{ responseText }}</span></li>
          <li><label for="startAutoModeConfirm" class="text">确定</label></li>
          <li><label for="startAutoModeCancle" class="text">取消</label></li>
          <button id="startAutoModeConfirm" class="hideButton" v-on:click="say('startAutoModeConfirm')"></button>
          <button id="startAutoModeCancle" class="hideButton" v-on:click="say('startAutoModeCancle')"></button>
        </ul>
    </div>
    <div v-else-if="loginState === 'startAutoModeConfirm'">
        <div class="loginInSuccess">
          <span>{{ loginInUserName }}, 欢迎您</span>
          <label for="logout" class="logout">&nbsp;&nbsp;登出</label><button id="logout" class="hideButton" v-on:click="say('logout')"></button>
        </div>
        <ul>
          <li><h2>已开启自动模式</h2></li>
          <li><span class="responseText">{{ responseText }}</span></li>
          <li><label for="startAutoModeCancle" class="text">取消自动模式</label></li>
          <button id="startAutoModeCancle" class="hideButton" v-on:click="say('startAutoModeCancle')"></button>
        </ul>
    </div>
  </div>
</template>

<script>
  import {func} from './login.js';
  export default {
    name: 'HelloWorld',
    props: {
      msg: String,
      loginState: String,
      responseText: String
    },
    methods: {
      say: func
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<style lang="less">
  @import '../styles/style.less';
</style>
