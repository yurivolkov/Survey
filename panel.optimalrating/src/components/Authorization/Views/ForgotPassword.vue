<template>
  <div class="content">
    <div class="container">
      <div class="login-wrapper">
        <div class="row">
          <div class="col">
            <span class="logo"><img src="static/img/logo.png" alt="" /></span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h4>Şifre Hatırtlatma</h4>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <form @submit.prevent="forgotPassword(username)">
              <div class="form-group">
                <input
                  class="form-control"
                  type="text"
                  name="username"
                  autocomplete="off"
                  :placeholder="$t('auth.username')"
                  v-model="username">
                <span class="forgot-pass">
                  <small><router-link :to="{ name: 'auth.login' }">{{$t('auth.login')}}</router-link></small>
                </span>
              </div>
              <div class="row justify-content-center">
                <div class="col-8">
                    <button type="submit" class="btn btn-danger btn-round btn-fill">{{$t('auth.send')}}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data(){
      return {
        username: null
      }
    },
    methods: {
      login(user){
        this.$store.dispatch('auth/login', user);
      }
    }
  }
</script>

<style lang="scss">
</style>
