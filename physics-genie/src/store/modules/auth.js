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
    await axios.post('wp-json/physics_genie/register', form);
    let UserForm = new FormData();
    UserForm.append('username', form.username);
    UserForm.append('password', form.password);
    await dispatch('LogIn', UserForm);
  },
  async LogIn({commit, dispatch}, User) {
    let response = await axios.post('wp-json/jwt-auth/v1/token', User);
    await Promise.all([commit('setUser', response.data), dispatch('GetUserMetadata'), dispatch('GetProblemMetadata', {root: true}), dispatch('GetUserInfo', {root: true})]);
    await Promise.all([dispatch('GetUserStats', {root: true}), dispatch('GetSubmittedProblems', {root: true}), dispatch('GetCurrProblem', {root: true})]);
  },
  async PasswordReset(form) {
    await axios.post('wp-json/physics_genie/password-reset', form);
  },
  async GetUserMetadata({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/user-metadata', {headers: {'Authorization': 'Bearer ' + getters.Token}});
    commit('setUserMetadata', response.data);
  },
  async LogOut({commit}){
    let user = null;
    commit('logOut', user);
  },
  async SetUserName({commit, getters}, name) {
    commit('setUserName', name);
    await axios.put('wp-json/physics_genie/user-name', {'name': name}, {headers: {'Authorization': 'Bearer ' + getters.Token}});
  }
};
const mutations = {
  setUser(state, data) {
    state.user = data.user_nicename;
    state.token = data.token;
  },
  setUserName(state, name) {
    state.user = name;
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
