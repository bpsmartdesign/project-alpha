<template>
  <v-container fluid grid-list-xl>
    <v-btn bottom color="#ff4e00" dark fab fixed right @click="dialog = !dialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card elevation="15" class="special-scroll">
        <v-card-title>Nouvelle Categorie</v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-text-field v-model="editedCategory.nom" clearable prepend-inner-icon="mdi-buffer" label="Nom de la Catégorie" />
              </v-row>
            </v-col>
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-text-field v-model="editedCategory.description" clearable prepend-inner-icon="mdi-orbit" label="Description de la Catégorie"/>
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
              <div class="title font-weight-thin mb-0 white--text">Gestion des Catégories</div>
              <div class="caption font-weight-thin white--text">Ajouter, Modifier et Supprimer des catégories de categories</div>
            </v-card-text>
          </v-sheet>

          <v-card-text class="pt-0" v-if="categories">
            <v-data-table :headers="headers" :items="categories" :items-per-page="5" class="mb-3">
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
                  <v-icon small @click="editCategory(item)">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn dark fab class="mx-2 elevation-3" max-width="35" max-height="35" color="red">
                  <v-icon small @click="deleteCategory(item)">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <p class="dark mt-5">Aucune Catégorie enrégistrée pour le moment</p>
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
      editedCategoryId: null,
      dialog: false,
      editedCategory: {
        nom: null,
        description: null,
        isGeneral: null,
        statut: null,
        userID: null
      },
      newCategory: {
        nom: null,
        description: null,
        isGeneral: null,
        statut: null,
        userID: null
      },
      categories: [],
      headers: [
        { text: 'Nom', value: 'nom' },
        { text: 'Description', value: 'description' },
        { text: 'Vision', value: 'isGeneral' },
        { text: 'Statut', value: 'statut' },
        { text: '', value: 'action', sortable: false }
      ],
      baseCategoryUri: 'http://api.wayfoster.com/api/categories/'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    editCategory (item) {
      this.editedIndex = this.categories.indexOf(item)
      this.editedCategory = Object.assign({}, item)
      this.editedCategoryId = item.categorieID
      this.dialog = true
    },
    async deleteCategory (item) {
      const index = item.categorieID
      if (confirm('Êtes vous sûr de vouloir supprimer cette Categorie ?')) {
        await axios.delete(this.baseCategoryUri + 'DeleteCategorie/' + index)
        this.loadCategories()
      }
    },
    changeStatus (item) {
      if (confirm('Êtes vous sûr de vouloir changer le statut de cette Categorie ?')) {
        if (item.statut === 0) {
          item.statut = 1
        } else {
          item.statut = 0
        }
      }
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedCategory = Object.assign({}, this.newCategory)
        this.editedIndex = -1
      }, 300)
    },
    loadCategories() {
      axios.get(this.baseCategoryUri + 'GetCategoriesPerUser/' + this.currentUser.userID).then(response => (this.categories = response.data))
    },
    async save () {
      let currentCategory = {
        nom: this.editedCategory.nom,
        description: this.editedCategory.description,
        isGeneral: false,
        statut: 0,
        userID: this.currentUser.id,
        fournisseurList: null
      }
      if (this.editedIndex > -1) {
        await axios.put(this.baseCategoryUri + 'PutCategorie/' + this.editedCategoryId, currentCategory)
        .catch(e => (console.error(e)))
      } else {
        await axios.post(this.baseCategoryUri + 'PostCategorie/' + this.currentUser.userID, currentCategory)
        .then(response => (console.log(response.data)))
        .catch(e => (console.log(e)))

      }
      this.loadCategories()
      this.close()
    }
  },
  mounted () {
    this.currentUser = JSON.parse(window.localStorage.getItem('alpha-user-connected'))
    this.loadCategories()
    console.log(this.categories)
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