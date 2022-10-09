<template>
  <v-container fluid grid-list-xl>
    <v-btn bottom color="#ff4e00" dark fab fixed right @click="dialog = !dialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card elevation="15" class="special-scroll">
        <v-card-title>Nouveau Fournisseur</v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row>
                <v-select v-model="editedFournisseur.categorie" :items="selectCategory" clearable prepend-inner-icon="mdi-camera-iris" label="Catégorie" />
              </v-row>
            </v-col>
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-text-field v-model="editedFournisseur.nom" clearable prepend-inner-icon="mdi-buffer" label="Nom du Fourniseur" />
              </v-row>
            </v-col>
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-text-field v-model="editedFournisseur.description" clearable prepend-inner-icon="mdi-orbit" label="Description du Fournisseur"/>
              </v-row>
            </v-col>
          </v-row>
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
              <div class="title font-weight-thin mb-0 white--text">Gestion des Fournisseurs</div>
              <div class="caption font-weight-thin white--text">Ajouter, Modifier et Supprimer des fournisseurs</div>
            </v-card-text>
          </v-sheet>

          <v-card-text class="pt-0" v-if="fournisseurs">
            <v-data-table :headers="headers" :items="fournisseurs" :items-per-page="4" class="mb-3">
              <template v-slot:item.isGeneral="{ item }">
                <span v-if="item.isGeneral">Globale</span>
                <span v-if="!item.isGeneral">Personnelle</span>
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
                  <v-icon small @click="editFournisseur(item)">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn dark fab class="mx-2 elevation-3" max-width="35" max-height="35" color="red">
                  <v-icon small @click="deleteFournisseur(item)">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <p class="dark mt-5">Aucun Fournisseur enrégistrée pour le moment</p>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      currentUser: null,
      editedIndex: -1,
      dialog: false,
      editedFournisseur: {
        id: null,
        userId: null,
        categorie: null,
        nom: null,
        description: null,
        isGeneral: null,
        statut: null
      },
      newFournisseur: {
        id: null,
        userId: null,
        categorie: null,
        nom: null,
        description: null,
        isGeneral: null,
        statut: null
      },
      fournisseurs: [],
      categories: [],
      baseCategoryUri: 'http://api.wayfoster.com/api/categories/',
      selectCategory: [],
      headers: [
        { text: 'Nom', value: 'nom' },
        { text: 'Description', value: 'description' },
        { text: 'Catégorie', value: 'categorie' },
        { text: 'Vision', value: 'isGeneral' },
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
    saveToLocal () {
      let data = JSON.stringify(this.fournisseurs)
      window.localStorage.setItem('fournisseurs-' + this.currentUser.username + this.currentUser.id, data)
    },
    editFournisseur (item) {
      this.editedIndex = this.fournisseurs.indexOf(item)
      this.editedFournisseur = Object.assign({}, item)
      this.dialog = true
    },
    loadCategories() {
      axios.get(this.baseCategoryUri + 'GetCategoriesPerUser/' + this.currentUser.userID).then(response => (this.categories = response.data))
    },
    deleteFournisseur (item) {
      const index = this.fournisseurs.indexOf(item)
      if (confirm('Êtes vous sûr de vouloir supprimer ce Fournisseur ?')) {
        this.fournisseurs.splice(index, 1)
        this.saveToLocal()
      }
    },
    changeStatus (item) {
      if (confirm('Êtes vous sûr de vouloir changer le statut de cette Fournisseur ?')) {
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
        this.editedFournisseur = Object.assign({}, this.newFournisseur)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.fournisseurs[this.editedIndex], this.editedFournisseur)
      } else {
        this.fournisseurs.push({
          id: Math.floor(new Date () * Math.random() * Math.floor(9)),
          userId: this.currentUser.id,
          categorie: this.editedFournisseur.categorie,
          nom: this.editedFournisseur.nom,
          description: this.editedFournisseur.description,
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
    
    if (window.localStorage.getItem('categories-' + this.currentUser.username + this.currentUser.id) !== null && window.localStorage.getItem('categories-' + this.currentUser.username + this.currentUser.id).length > 0) {
      let tmpCategory = JSON.parse(window.localStorage.getItem('categories-' + this.currentUser.username + this.currentUser.id))
      let id = 0
      tmpCategory.forEach(category => {
        if (category.userId === this.currentUser.id) {
          this.categories.push(category)
          this.selectCategory[id] = {value: category.nom, text: category.nom}
          id++
        }
      })
    }
    if (window.localStorage.getItem('fournisseurs-' + this.currentUser.username + this.currentUser.id) !== null && window.localStorage.getItem('fournisseurs-' + this.currentUser.username + this.currentUser.id).length > 0) {
      let tmpFournisseur = JSON.parse(window.localStorage.getItem('fournisseurs-' + this.currentUser.username + this.currentUser.id))
      tmpFournisseur.forEach(fournisseur => {
        if (fournisseur.userId === this.currentUser.id) {
          this.fournisseurs.push(fournisseur)
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