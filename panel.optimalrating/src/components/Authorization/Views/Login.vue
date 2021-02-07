<template>
  <div class="content">
    <div class="container">
      <div class="login-wrapper">
        <div class="row">
          <div class="col">
            <span class="logo"><img src="static/img/logo.png" style="filter: invert(70%);"/></span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h4>Panel Login</h4>
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
                  v-model="user.email"
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
                <small class="error-message text-danger">{{$t(errorMessage)}}</small>
              </template>
              <div class="row justify-content-center" style="margin-top: 20px">
                <div class="col-8">
                    <button type="submit" class="btn btn-primary btn-round btn-fill" :disabled="loading">{{$t('auth.send')}}</button>
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
          email: null,
          password: null
        },
        errorMessage: null,
        loading: false
      }
    },
    methods: {
      login(user){
        var _this = this;
        this.loading = true;
        this.$store.dispatch('auth/login', user).catch((response) => {
          this.loading = false;
          response.message ? _this.errorMessage = response.message : null;
        });
      }
    }
  }
</script>

<style lang="scss">
</style>
