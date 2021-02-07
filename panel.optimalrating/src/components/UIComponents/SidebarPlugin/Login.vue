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
            <h4>Panel Giriş</h4>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <form @submit.prevent="login(user)">
              <div class="form-group">
                <input
                  class="form-control"
                  type="text"
                  name="username"
                  autocomplete="off"
                  :placeholder="$t('auth.username')"
                  v-model="user.username"
                >
              </div>
              <div class="form-group">
                <input
                  class="form-control"
                  type="password"
                  name="username"
                  autocomplete="off"
                  :placeholder="$t('auth.password')"
                  v-model="user.password"
                >
                <!-- <span class="forgot-pass">
                  <small><router-link :to="{ name: 'auth.forgot_password' }">{{$t('auth.forgot_pass')}}</router-link></small>
                </span> -->
              </div>
              <template v-if="errorMessage">
                <small class="error-message text-danger">{{errorMessage}}</small>
              </template>
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
        user: {
          username: null,
          password: null
        },
        errorMessage: null
      }
    },
    methods: {
      login(user){
        var _this = this;
        this.$store.dispatch('auth/login', user).catch(function(response){
          response.message ? _this.errorMessage = response.message : null;
        });
      }
    }
  }

</script>
<style lang="scss">

</style>
