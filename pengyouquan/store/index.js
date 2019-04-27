import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
 state : {
	user1:{
		token:"0ExjP/OGFiwVUkQr9CZ7TMwxLTktepHlVz5rwjvAMSdu7bJZitlixwRst4JkgbX2tnwdmrSapDCZDlblAo2zVg==",
		targetUserId:"user2"
		},
	user2:{
			token:"fDByIWGM7oBzNYUdXhRdwQ/MeVAFbziQOLcKtSFa1/HZ/+mI5iBT9GWastd8WZoAVQH94PBty+rx8rj4t7XkXg==",
			targetUserId:"user1"
			}
 },
 mutations : {
  change : function(state, nickname){
   state.nickname = nickname;
  }
 }
});
export default store