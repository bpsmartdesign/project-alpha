<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-alert transition="scale-transition" dismissible v-show="errorConnection" v-model="alert" dense outlined type="error">{{ errorConnection }}</v-alert>
            <v-tabs dark background-color="indigo">
              <v-tab>Sign In</v-tab>
              <v-tab>Sign Up</v-tab>

              <v-tab-item>
                <v-card class="elevation-12" flat tile>
                  <v-card-text>
                    <v-form>
                      <v-text-field label="Login" v-model="userConnect.username" name="login" prepend-icon="mdi-account-arrow-right-outline" type="text"/>
                      <v-text-field id="password" v-model="userConnect.password" label="Password" name="password" @keyup.enter="login" prepend-icon="mdi-lock-outline" type="password"/>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-dialog v-model="forgetPass" width="500px">
                      <v-card elevation="15" tile flat min-height="200px">
                        <v-container>
                          <v-card-text>
                            <div>Mot de Passe oublié</div>
                            <v-row>
                              <v-col cols='10'>
                                <v-text-field class="mb-0 mt-5" outlined label="Prepend inner" prepend-inner-icon="mdi-alert-decagram-outline"></v-text-field>
                              </v-col>
                              <v-col cols='2' class="mb-0 mt-7">
                                <v-btn fab dark small color="indigo">
                                  <v-icon dark>mdi-telegram</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                            <span class="text--primary caption mt-0">Entrer votre adresse mail pour récupérer votre mot de passe</span>
                          </v-card-text>
                        </v-container>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="activateAccount" width="500px">
                      <v-card elevation="15" tile flat min-height="200px">
                        <v-container>
                          <v-card-text>
                            <div class="indigo--text">Activation de compte</div>
                            <p class="title text--primary mb-0">Code de confirmation</p>
                            <span class="caption mt-0">Entrez le code de confirmation que vous avez reçu par l'adresse : {{ email }}</span>
                            <v-row>
                              <v-col cols='10'>
                                <v-text-field v-model="confirmationCode" :rules="confirmCodeRule" :counter="6" class="mb-0 mt-5" outlined label="Code de confirmation" prepend-inner-icon="mdi-alert-decagram-outline"></v-text-field>
                              </v-col>
                              <v-col cols='2' class="mb-0 mt-7">
                                <v-btn fab dark small color="indigo" v-show="confirmationCode !== null && confirmationCode.length === 6">
                                  <v-icon dark class="hoverPointer" @click="confirmCode(confirmationCode)">mdi-telegram</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-container>
                      </v-card>
                    </v-dialog>
                    <span class="hoverPointer ml-4 mt-0 caption font-weight-light indigo--text" @click="forgetPass = true">Mot de passe oublié ?</span>
                    <v-spacer />
                    <v-btn color="indigo" dark tile class="elevation-5" @click="login">Sign</v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card class="elevation-12" flat tile>
                  <v-card-text>
                    <v-form v-model="valid">
                      <v-container>
                        <v-row>
                          <v-col cols="4" md="4">
                            <v-text-field v-model="firstname" :rules="nameRules" :counter="30" label="Nom" required></v-text-field>
                          </v-col>
                          <v-col cols="8" md="8">
                            <v-text-field v-model="lastname" :rules="nameRules" :counter="30" label="Prénom" required></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="username" :rules="textRules" :counter="10" label="Login" required></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field type="password" :rules="passwordRules" v-model="password" label="Mot de passe" required></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field type="password" :rules="passwordRules" v-model="confirmPassword" label="Confirmer" required></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-dialog v-model="activateAccount" width="500px">
                      <v-card elevation="15" tile flat min-height="200px">
                        <v-container>
                          <v-card-text>
                            <div class="indigo--text">Activation de compte</div>
                            <p class="title text--primary mb-0">Code de confirmation</p>
                            <span class="caption mt-0">Entrez le code de confirmation que vous avez reçu par l'adresse : {{ email }}</span>
                            <v-row>
                              <v-col cols='10'>
                                <v-text-field v-model="confirmationCode" :rules="confirmCodeRule" :counter="6" class="mb-0 mt-5" outlined label="Code de confirmation" prepend-inner-icon="mdi-alert-decagram-outline"></v-text-field>
                              </v-col>
                              <v-col cols='2' class="mb-0 mt-7">
                                <v-btn fab dark small color="indigo" v-show="confirmationCode !== null && confirmationCode.length === 6">
                                  <v-icon dark class="hoverPointer" @click="confirmCode(confirmationCode)">mdi-telegram</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-container>
                      </v-card>
                    </v-dialog>
                    <v-btn v-show="valid" color="indigo" dark tile class="elevation-5" @click="signup">Sign</v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    tab: null,
    alert: false,
    forgetPass: false,
    activateAccount: false,
    confirmationCode: "",
    users: [],
    currentUser: null,
    userConnect: {
      username: null,
      password: null
    },
    valid: false,
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstname: "",
    lastname: "",
    errorConnection: null,
    nameRules: [
      v => !!v || "Ce champs est requis",
      v =>
        v.length <= 30 || "Ce champ ne peux pas contenir plus de 30 caractères"
    ],
    confirmCodeRule: [
      v => !!v || "Ce champs est requis",
      v =>
        v.length <= 6 || "Ce champ doit contenir exactement 6 caractères"
    ],
    textRules: [
      v => !!v || "Ce champs est requis",
      v =>
        v.length <= 15 || "Ce champ ne peux pas contenir plus de 15 caractères"
    ],
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "Entrer une adresse email valide"
    ],
    passwordRules: [
      v => !!v || "Ce chammps est requis",
      v =>
        v.length >= 6 || "Le mot de passe doit contenir au moins 6 carractères"
    ],
    baseUserUri: "http://api.wayfoster.com/api/users/"
  }),
  watch: {
    alert (val) {
      console.log(val)
      val || !val
    },
  },
  methods: {
    setRandomId() {
      let result = "";
      let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 15; i++) {
        result += char.charAt(Math.floor(Math.random() * char.length));
      }

      return result;
    },

    login() {
      axios.get(this.baseUserUri + 'GetAuthentification?login=' + this.userConnect.username + '&password=' + this.userConnect.password)
      .then((user) => {
        if (user.data[0] !== undefined) {
          if (!user.data[0].isActive) {
            let data = JSON.stringify(user.data)
            window.localStorage.setItem("current-alpha-user", data)
            this.activateAccount = true
          } else {
            console.log('connected')
            let data = JSON.stringify(user.data[0])
            window.localStorage.setItem("alpha-user-connected", data)
            this.$router.push({ path: "/" })
          }
        } else {
          this.errorConnection = "Identifiants invalides";
        }
      })
      .catch((e) => {
        console.error(e)
        this.errorConnection = "Erreur Authentification !, verifier votre accès à Internet";
      })
    },

    signup() {
      this.activateAccount = true
      let createdUser = {
        userID: 0,
        login: this.username,
        password: this.password,
        isActive: false,
        activationCode: null,
        adminLevel: 0,
        creationDate: '2020-04-07T13:54:48.324Z',
        userDetailID: 0,
        userDetail: {
          userDetailID: 0,
          nom: this.firstname,
          prenom: this.lastname,
          email: this.email
        },
        souscriptionList: null,
        categorieList: null
      }
      axios.post(this.baseUserUri + 'PostUser', createdUser)
      .then((user) => {
        let data = JSON.stringify(user.data)
        window.localStorage.setItem("current-alpha-user", data)
      }).catch((e) => {
        this.errorConnection = "Erreur de Création !, verifier votre accès à Internet";
        console.log(e)
      })
    },

    confirmCode (code) {
      this.currentUser = JSON.parse(window.localStorage.getItem('current-alpha-user'))
      axios.post(this.baseUserUri + 'enableUserByCode/' + this.currentUser.userID + '?code=' + code)
      .then((user) => {
        let data = JSON.stringify(user.data[0])
        window.localStorage.setItem("alpha-user-connected", data)
        this.$router.push({ path: "/" })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.hoverPointer {
  cursor: pointer;
}
</style>