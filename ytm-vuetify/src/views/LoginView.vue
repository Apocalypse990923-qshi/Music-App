<template>
  <v-content>
    <v-form id="login-form">
      <h2>Login</h2>
      <v-text-field
        label="Username"
        id="login-username"
        v-model="loginUsername"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        type="password"
        id="login-password"
        v-model="loginPassword"
        required
      ></v-text-field>
      <v-checkbox
        label="Remember me"
        id="login-remember"
        v-model="loginRemember"
      ></v-checkbox>
      <v-btn type="button" @click="login()">Submit</v-btn>
    </v-form>
    <v-form id="signup-form" class="my-10">
      <h2>Sign Up</h2>
      <v-text-field
        label="Username"
        id="signup-username"
        v-model="signupUsername"
        required
      ></v-text-field>
      <v-text-field
        label="Password"
        type="password"
        id="signup-password"
        v-model="signupPassword"
        required
      ></v-text-field>
      <v-text-field
        label="Repeat Password"
        type="password"
        id="signup-password-repeat"
        v-model="signupPasswordRepeat"
        required
      ></v-text-field>
      <v-btn type="button" @click="signup()">Submit</v-btn>
    </v-form>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-alert
            type="success"
            v-model="successAlert"
            dismissible
          >
            {{ successMessage }}
          </v-alert>
          <v-alert
            type="error"
            v-model="failureAlert"
            dismissible
          >
            {{ failureMessage }}
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js';

export default {
  name: 'LoginView',

  components: {
  },

  data() {
    return {
      key: 'password',
      successAlert: false,
      failureAlert: false,
      successMessage: '',
      failureMessage: '',
    };
  },
  methods: {
    login() {
      const username = this.loginUsername;
      const password = this.loginPassword;
      const rememberFlag = this.loginRemember;
      const encryptedPassword = CryptoJS.AES.encrypt(password, this.key).toString();
      const data = {
        user: username,
        secret: encryptedPassword,
        remember: rememberFlag,
      };
      console.log('login data submitted:', data);
      axios
        .post('http://127.0.0.1:3000/login', data)
        .then((response) => {
          console.log('received response:', response.data);
          if (response.data.status === 0) {
            // console.log('Login Success');
            this.successMessage = response.data.msg;
            this.successAlert = true;
            this.$store.commit('setUser', response.data.user);
            this.$store.commit('setLoginFlag', true);
            this.$router.push('/explore');
          } else if (response.data.status === 1) {
            // console.log('Login Fail');
            this.failureMessage = response.data.msg;
            this.failureAlert = true;
          }
        })
        .catch((error) => console.error(error));
    },
    signup() {
      const username = this.signupUsername;
      const password = this.signupPassword;
      const passwordRepeat = this.signupPasswordRepeat;
      if (password !== passwordRepeat) {
        // this.$toasted.show('Passwords do not match!');
        this.failureMessage = 'Password not match!';
        this.failureAlert = true;
        return;
      }
      const encryptedPassword = CryptoJS.AES.encrypt(password, this.key).toString();
      const data = {
        user: username,
        secret: encryptedPassword,
      };
      console.log('Sign up data submitted:', data);
      axios
        .post('http://127.0.0.1:3000/signup', data)
        .then((response) => {
          console.log('received response:', response.data);
          if (response.data.status === 0) {
            // console.log('Signup Success');
            this.successMessage = response.data.msg;
            this.successAlert = true;
          } else if (response.data.status === 1) {
            // console.log('Signup Fail');
            this.failureMessage = response.data.msg;
            this.failureAlert = true;
          }
        })
        .catch((error) => console.error(error));
    },
  },
};
</script>
