<template>
  <v-container fluid grid-list-xl>
    <v-btn bottom color="#ff4e00" dark fab fixed right @click="dialog = !dialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card elevation="15" class="special-scroll">
        <v-card-title>Nouveau Service</v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row>
                <v-select v-model="editedService.fournisseur" :items="selectFournisseur" clearable prepend-inner-icon="mdi-camera-iris" label="Fournisseur" />
              </v-row>
            </v-col>
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-text-field v-model="editedService.nom" clearable prepend-inner-icon="mdi-buffer" label="Nom du Service" />
              </v-row>
            </v-col>
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-text-field v-model="editedService.description" clearable prepend-inner-icon="mdi-orbit" label="Description du Service"/>
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
              <div class="title font-weight-thin mb-0 white--text">Gestion des services</div>
              <div class="caption font-weight-thin white--text">Ajouter, Modifier et Supprimer des services</div>
            </v-card-text>
          </v-sheet>

          <v-card-text class="pt-0" v-if="services">
            <v-data-table v-if="services.length > 0" :headers="headers" :items="services" :items-per-page="4" class="mb-3">
              <template v-slot:item.isGeneral="{ item }">
                <span v-if="item.isGeneral">Global</span>
                <span v-if="!item.isGeneral">Personnel</span>
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
                  <v-icon small @click="editService(item)">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn dark fab class="mx-2 elevation-3" max-width="35" max-height="35" color="red">
                  <v-icon small @click="deleteService(item)">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <p class="dark mt-5">Aucun Service enrégistré pour le moment</p>
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
      editedService: {
        id: null,
        userId: null,
        fournisseur: null,
        nom: null,
        description: null,
        isGeneral: null,
        statut: null
      },
      newService: {
        id: null,
        userId: null,
        fournisseur: null,
        nom: null,
        description: null,
        isGeneral: null,
        statut: null
      },
      services: [],
      fournisseurs: [],
      selectFournisseur: [],
      headers: [
        { text: 'Nom', value: 'nom' },
        { text: 'Description', value: 'description' },
        { text: 'Fournisseur', value: 'fournisseur' },
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
      let data = JSON.stringify(this.services)
      window.localStorage.setItem('services-' + this.currentUser.username + this.currentUser.id, data)
    },
    editFournisseur (item) {
      this.editedIndex = this.services.indexOf(item)
      this.editedService = Object.assign({}, item)
      this.dialog = true
    },
    deleteFournisseur (item) {
      const index = this.services.indexOf(item)
      if (confirm('Êtes vous sûr de vouloir supprimer ce Service ?')) {
        this.services.splice(index, 1)
        this.saveToLocal()
      }
    },
    changeStatus (item) {
      if (confirm('Êtes vous sûr de vouloir changer le statut de cette Service ?')) {
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
        this.editedService = Object.assign({}, this.newService)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.services[this.editedIndex], this.editedService)
      } else {
        this.services.push({
          id: Math.floor(new Date () * Math.random() * Math.floor(9)),
          userId: this.currentUser.id,
          fournisseur: this.editedService.fournisseur,
          nom: this.editedService.nom,
          description: this.editedService.description,
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
    if (window.localStorage.getItem('fournisseurs-' + this.currentUser.username + this.currentUser.id) !== null && window.localStorage.getItem('fournisseurs-' + this.currentUser.username + this.currentUser.id).length > 0) {
      let tmpFournisseur = JSON.parse(window.localStorage.getItem('fournisseurs-' + this.currentUser.username + this.currentUser.id))
      let id = 0
      tmpFournisseur.forEach(fournisseur => {
        if (fournisseur.userId === this.currentUser.id) {
          this.fournisseurs.push(fournisseur)
          this.selectFournisseur[id] = {value: fournisseur.nom, text: fournisseur.nom}
          id++
        }
      })
    }
    if (window.localStorage.getItem('services-' + this.currentUser.username + this.currentUser.id) !== null && window.localStorage.getItem('services-' + this.currentUser.username + this.currentUser.id).length > 0) {
      let tmpService = JSON.parse(window.localStorage.getItem('services-' + this.currentUser.username + this.currentUser.id))
      tmpService.forEach(service => {
        if (service.userId === this.currentUser.id) {
          this.services.push(service)
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