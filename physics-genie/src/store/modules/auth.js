import axios from 'axios';

const state = {
  user: null,
  token: null,
  contributor: null
};
const getters = {
  isAuthenticated: state => !!state.user,
  StateUser: state => state.user,
  Token: state => state.token,
  Contributor: state => state.contributor
};
const actions = {
  async Register({dispatch}, form) {
    await axios.post('register', form);
    let UserForm = new FormData();
    UserForm.append('username', form.username);
    UserForm.append('password', form.password);
    await dispatch('LogIn', UserForm);
  },
  async LogIn({commit, dispatch}, User) {
    let response = await axios.post('wp-json/jwt-auth/v1/token', User);
    commit('setUser', response.data);
    dispatch('GetUserMetadata', response.data.token);
  },
  async GetUserMetadata({commit}, token) {
    let response = await axios.get('wp-json/physics_genie/user-metadata', {headers: {'Authorization': 'Bearer ' + token}});
    commit('setUserMetadata', response.data);
  },
  async LogOut({commit}){
    let user = null;
    commit('logOut', user);
  }
};
const mutations = {
  setUser(state, data) {
    state.user = data.user_nicename;
    state.token = data.token;
  },
  setUserMetadata(state, data) {
    state.contributor = data.contributor;
  },
  logOut(state){
    state.user = null;
    state.token = null;
    state.contributor = null;
  },
};
export default {
  state,
  getters,
  actions,
  mutations
};
