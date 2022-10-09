<template>
  <v-container fluid grid-list-xl>
    <v-btn bottom color="#ff4e00" dark fab fixed right @click="dialog = !dialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card elevation="15" class="special-scroll">
        <v-card-title>Nouvel Utilisateur</v-card-title>
        <v-container>
          <v-form v-model="valid" class="mx-5">
            <v-row>
              <v-col cols="4" md="4">
                <v-text-field v-model="editedUser.nom" :rules="nameRules" :counter="30" label="Nom" required></v-text-field>
              </v-col>
              <v-col cols="8" md="8">
                <v-text-field v-model="editedUser.prenom" :rules="nameRules" :counter="30" label="Prénom"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedUser.login" :rules="textRules" :counter="30" label="Login" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedUser.password" :rules="psswordRules" label="Mot de passe" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedUser.email" :rules="emailRules" label="E-mail" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="editedUser.adminLevel" :items="adminLevel" clearable label="Rôle" />
              </v-col>
            </v-row>
          </v-form>
          <v-row>
            <v-col cols="12">
              <v-btn color="indigo" dark small fab class="ml-3 white--text" @click="save">
                <v-icon small>
                  mdi-telegram
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <v-layout wrap class="px-0 py-12">
      <v-flex sm12 xs12 md12 lg12>
        <v-card tile class="mx-auto mt-8">
          <v-sheet class="v-sheet--offset mx-auto py-3 px-3" color="orange darken-4" elevation="10" max-width="calc(100% - 32px)">
            <v-card-text class="pt-0">
              <div class="title font-weight-thin mb-0 white--text">Gestion des Utilisateurs</div>
              <div class="caption font-weight-thin white--text">Ajouter, Modifier et Supprimer des utilisateurs à la plateforme</div>
            </v-card-text>
          </v-sheet>

          <v-card-text class="pt-0" v-if="users">
            <v-data-table v-if="users.length > 0" :headers="headers" :items="users" :items-per-page="4" class="mb-3">
              <template v-slot:item.fullName="{ item }">
                <span>{{ item.userDetails.nom + ' ' + item.userDetails.prenom }}</span>
              </template>
              <template v-slot:item.statut="{ item }">
                <v-chip v-if="item.statut === 0" pill color="success" text-color="white">
                  <v-avatar left>
                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                  </v-avatar>
                  Activé
                </v-chip>
                <v-chip v-if="item.statut !== 0" pill color="red" text-color="white">
                  <v-avatar left>
                    <v-icon>mdi-bookmark-remove</v-icon>
                  </v-avatar>
                  Désctivé
                </v-chip>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn dark fab class="elevation-3" max-width="35" max-height="35" color="secondary">
                  <v-icon small @click="changeStatus(item)">mdi-sync</v-icon>
                </v-btn>
                <v-btn dark fab class="elevation-3 ml-2" max-width="35" max-height="35" color="orange">
                  <v-icon small @click="editCategory(item)">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn dark fab class="mx-2 elevation-3" max-width="35" max-height="35" color="red">
                  <v-icon small @click="deleteCategory(item)">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <p class="dark mt-15">Aucune Catégorie enrégistrée pour le moment</p>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      currentUser: null,
      editedIndex: -1,
      dialog: false,
      editedUser: {
        id: null,
        userId: null,
        nom: null,
        description: null,
        isGeneral: null,
        statut: null
      },
      newUser: {
        id: null,
        userId: null,
        nom: null,
        description: null,
        isGeneral: null,
        statut: null
      },
      users: [],
      headers: [
        { text: 'Login', value: 'login' },
        { text: 'Nom Complet', value: 'fullName' },
        { text: 'E-mail', value: 'email' },
        { text: 'Rôle', value: 'role' },
        { text: 'Statut', value: 'statut' },
        { text: '', value: 'action', sortable: false }
      ],
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    editCategory (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.dialog = true
    },
    deleteCategory (item) {
      const index = this.users.indexOf(item)
      if (confirm('Êtes vous sûr de vouloir supprimer cette Categorie ?')) {
        this.users.splice(index, 1)
        this.saveToLocal()
      }
    },
    changeStatus (item) {
      if (confirm('Êtes vous sûr de vouloir changer le statut de cette Categorie ?')) {
        if (item.statut === 0) {
          item.statut = 1
        } else {
          item.statut = 0
        }
        this.saveToLocal()
      }
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedUser = Object.assign({}, this.newCategory)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedUser)
      } else {
        this.users.push({
          id: Math.floor(new Date () * Math.random() * Math.floor(9)),
          userId: this.currentUser.id,
          nom: this.editedUser.nom,
          description: this.editedUser.description,
          isGeneral: false,
          statut: 0
        })
      }
      this.saveToLocal()
      this.close()
    }
  },
  mounted () {
    this.currentUser = JSON.parse(window.localStorage.getItem('alpha-user-connected'))
    if (window.localStorage.getItem('users-' + this.currentUser.username + this.currentUser.id) !== null && window.localStorage.getItem('users-' + this.currentUser.username + this.currentUser.id).length > 0) {
      let tmpCategory = JSON.parse(window.localStorage.getItem('users-' + this.currentUser.username + this.currentUser.id))
      tmpCategory.forEach(category => {
        if (category.userId === this.currentUser.id) {
          this.users.push(category)
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
  .card-prepend {
    width: 90%;
    margin-left: 5%;

    .card-offset {
      height: 200px;
    }

    .card-content {
      position: absolute;
      top: 0;
    }
  }
</style>