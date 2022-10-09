<template>
  <v-container fluid grid-list-xl>
    <v-dialog v-model="dialog" width="800px">
      <v-card elevation="15" class="special-scroll">
        <v-card-title>Ajouter Souscription</v-card-title>
        <v-stepper v-model="e6" vertical>
          <v-stepper-step :complete="e6 > 1" step="1">Enrégistrement <small>Renseigner les détails sur la souscription</small></v-stepper-step>
          <v-stepper-content step="1">
            <v-row class="mx-2">
              <v-col cols="4">
                <v-text-field v-model="editedSouscription.fournisseur" clearable prepend-inner-icon="mdi-camera-iris" label="Fournisseur" />
                <!-- <v-select v-model="editedSouscription.fournisseur" :items="fournisseur" clearable prepend-inner-icon="mdi-camera-iris" label="Fournisseur" /> -->
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="editedSouscription.service" clearable prepend-inner-icon="mdi-camera-control" label="Service" />
                <!-- <v-select v-model="editedSouscription.service" :items="service" clearable prepend-inner-icon="mdi-camera-control" label="Service" /> -->
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="editedSouscription.cout" type="number" min="0" clearable prepend-inner-icon="mdi-orbit" label="Prix de la souscription"/>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedSouscription.syntheseOffre" clearable prepend-inner-icon="mdi-text" label="Synthèse de l'offre" />
              </v-col>
              <v-col cols="3">
                <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="editedSouscription.dateDebut" prepend-inner-icon="mdi-calendar" label="Début ..." readonly v-on="on"/>
                  </template>
                  <v-date-picker v-model="editedSouscription.dateDebut" @input="menu2 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="3">
                <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="editedSouscription.dateFin" prepend-inner-icon="mdi-calendar" label="Fin ..." readonly v-on="on"/>
                  </template>
                  <v-date-picker v-model="editedSouscription.dateFin" @input="menu3 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="editedSouscription.delaisAlertePaiement" type="number" min="2" clearable prepend-inner-icon="mdi-orbit" label="Delai d'alerte (en Jrs)"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-show="editedSouscription.fournisseur && editedSouscription.service && editedSouscription.cout && editedSouscription.syntheseOffre && editedSouscription.dateDebut && editedSouscription.dateFin && editedSouscription.delaisAlertePaiement">
                <v-btn color="green darken-3" dark small fab class="ml-3 white--text" @click="save">
                  <v-icon small>
                    mdi-telegram
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-dialog>
    <v-layout wrap class="px-0 py-12">
      <v-flex sm12 xs12 md12 lg12 class="my-0 py-0" v-show="souscriptions" v-for="(item, i) in forNotifications" :key="i">
        <v-alert outlined class="mt-1 mb-0" dismissible border="left" elevation="2" type="error">
          La souscription au service <strong class="indigo--text">{{ item.service }}</strong> de <strong class="indigo--text">{{ item.fournisseur }}</strong> se termine dans <strong class="indigo--text">{{ item.nbrDaysRemaining }}</strong> Jour(s)
        </v-alert>
      </v-flex>
      <v-flex sm4 xs4 md4 lg4>
        <v-card class="mx-auto" tile>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Nombre de service(s)</div>
              <v-list-item-title class="indigo--text display-1" v-if="souscriptions">{{ souscriptions.length }} <small class="caption font-weight-light">service(s)</small></v-list-item-title>
              <v-list-item-subtitle class="ml-2 caption grey--text font-weight-light">En cours ...</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" tile color="indigo" style="border-radius: 5px" class="elevation-5">
              <v-icon dark size="40">mdi-currency-sign</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-flex>
      <v-flex sm4 xs4 md4 lg4>
        <v-card class="mx-auto" tile>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">service le plus chers</div>
              <v-list-item-title class="red--text display-1" v-if="formatter">{{ formatter.format(parseInt(plusChers.cout)) }}</v-list-item-title>
              <v-list-item-subtitle class="ml-2 caption grey--text font-weight-light">{{ plusChers.fournisseur + ' / ' + plusChers.service }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" tile color="red" style="border-radius: 5px" class="elevation-5">
              <v-icon dark size="40">mdi-currency-sign</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-flex>
      <v-flex sm4 xs4 md4 lg4>
        <v-card class="mx-auto" tile>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">service le moins chers</div>
              <v-list-item-title class="warning--text display-1" v-if="formatter">{{ formatter.format(parseInt(moinsChers.cout)) }}</v-list-item-title>
              <v-list-item-subtitle class="ml-2 caption grey--text font-weight-light">{{ moinsChers.fournisseur + ' / ' + moinsChers.service }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" tile color="warning" style="border-radius: 5px" class="elevation-5">
              <v-icon dark size="40">mdi-currency-sign</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-flex>
      <v-flex sm12 xs12 md12 lg12>
        <v-card tile :loading="loading" class="mx-auto mt-5">
          <v-sheet class="v-sheet--offset mx-auto py-3 px-3" color="orange darken-4" elevation="10" max-width="calc(100% - 32px)">
            <v-card-text class="pt-0">
              <div class="title font-weight-thin mb-0 white--text">
                Liste des Souscriptions
                <div class="float-right" style="position: relative; top: 30px">
                  <v-tooltip top class="float-right">
                    <template v-slot:activator="{ on }">
                      <v-btn bottom color="green darken-2" dark fab @click="dialog = !dialog" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Ajouter une nouvelle souscription</span>
                  </v-tooltip>
                </div>
              </div>
            </v-card-text>
          </v-sheet>

          <v-card-text class="pt-0" v-if="souscriptions">
            <v-data-table :headers="headers" :items="souscriptions" :items-per-page="10" class="mb-3">
              <template v-slot:item.dateDebut="{ item }">
                <span>{{ new Date(item.dateDebut).toLocaleDateString() }}</span>
              </template>
              <template v-slot:item.dateFin="{ item }">
                <span>{{ new Date(item.dateFin).toLocaleDateString() }}</span>
              </template>
              <template v-slot:item.statut="{ item }">
                <span v-if="Math.round(msToDay(new Date(item.dateFin) - new Date())) >= 0">En cours ...</span>
                <span v-if="Math.round(msToDay(new Date(item.dateFin) - new Date())) < 0">Terminé</span>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn dark fab class="elevation-3" max-width="35" max-height="35" color="orange">
                  <v-icon small @click="editSouscription(item)">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn dark fab class="mx-2 elevation-3" max-width="35" max-height="35" color="red">
                  <v-icon small @click="deleteSouscription(item)">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <p class="dark mt-5">Aucune souscription enrégistrée pour le moment</p>
              </template>
            </v-data-table>
            <v-btn fab to="/app/services" dark small color="orange darken-3" width="35" height="35">
              <v-icon dark small>mdi-chart-timeline</v-icon>
            </v-btn>
            <span class="ml-3 caption grey--text font-weight-light">Visualiser avec le diagramme</span>
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
      e6: 1,
      currentDate: new Date(),
      modalHide: true,
      edit: false,
      oldId: null,
      addStep: 0,
      countUpdate: 0,
      totalNbrDay: 0,
      currentYear: null,
      menu2: false,
      menu3: false,
      fournisseur: [
        { text: 'TV', value: 'TV'},
        { text: 'Téléphone', value: 'Téléphone'},
        { text: 'Chauffage', value: 'Chauffage'},
        { text: 'Data', value: 'Data'},
        { text: 'Electricité', value: 'Electricité'},
        { text: 'Assurance', value: 'Assurance'},
        { text: 'Eau', value: 'Eau'},
        { text: 'Sport', value: 'Sport'}
      ],
      service: [
        { text: 'SFR Adsl fixe', value: 'SFR Adsl fixe' },  
        { text: 'Total Gaz', value: 'Total Gaz' },  
        { text: 'AWS Cloud', value: 'AWS Cloud' },  
        { text: 'Energie', value: 'Energie' },  
        { text: 'AXA', value: 'AXA' },  
        { text: 'Véolia eau', value: 'Véolia eau' },  
        { text: 'Illimité', value: 'Illimité' }  
      ],
      editedSouscription: {
        souscriptionID: null,
        fournisseur: null,
        service: null,
        cout: null,
        syntheseOffre: null,
        alerteMail: true,
        dateDebut: null,
        dateFin: null,
        delaisAlertePaiement: null,
        delaisAlerteResiliation: null,
        userID: null
      },
      newSouscription: {
        souscriptionID: null,
        fournisseur: null,
        service: null,
        cout: null,
        syntheseOffre: null,
        alerteMail: true,
        dateDebut: null,
        dateFin: null,
        delaisAlertePaiement: null,
        delaisAlerteResiliation: null,
        userID: null
      },
      alert: true,
      loading: false,
      selection: 1,
      souscriptions: [],
      echeance: [],
      plusChers: { cout: 0, fournisseur: '...', service: '...' },
      moinsChers: { cout: 0, fournisseur: '...', service: '...' },
      depenses: 0,
      depensesRemise: 0,
      economie: null,
      formatter: null,
      forNotifications: [],
      headers: [
        { text: 'Fournisseur', value: 'fournisseur' },
        { text: 'Service', value: 'service' },
        { text: 'Coût', value: 'cout' },
        { text: 'Début', value: 'dateDebut' },
        { text: 'Fin', value: 'dateFin' },
        { text: 'Synthèse de l\'offre', value: 'syntheseOffre' },
        { text: 'Statut', value: 'statut' },
        { text: '', value: 'action', sortable: false }
      ],
      editedSouscriptionId: null,
      baseSouscriptionUri: 'http://api.wayfoster.com/api/souscriptions/'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    msToDay (nbr) { return nbr / (1000 * 3600 * 24)},
    dayToMs (nbr) { return nbr * (1000 * 3600 * 24)},
    setYearDayNbr (year) {
      for (let i = 0; i < this.month.length; i++) {
        this.month[i].nbrJour = new Date(year, i + 1, -1).getDate() + 1
        this.totalNbrDay += this.month[i].nbrJour
      } // Algormithme pour attribuer correctement le nombre de jours en fonction de l'année en cours
    },

    editSouscription (item) {
      this.editedIndex = this.souscriptions.indexOf(item)
      this.editedSouscription = Object.assign({}, item)
      this.editedSouscription.dateDebut = item.dateDebut.split('T')[0]
      this.editedSouscription.dateFin = item.dateFin.split('T')[0]
      this.editedSouscriptionId = item.souscriptionID
      this.dialog = true
    },

    async loadSouscriptions () {
      let today = new Date()
      let id = 0
      this.forNotifications = []

      await axios.get(this.baseSouscriptionUri + 'GetSouscriptionPerUser/' +this.currentUser.userID)
      .then(response => (this.souscriptions = response.data))
      .catch(e => (console.log(e)))

      if(this.souscriptions.length > 0) {
        this.moinsChers = this.souscriptions[0]
        this.souscriptions.forEach(souscription => {
          if (souscription.cout > this.plusChers.cout) { this.plusChers = souscription }
          if (souscription.cout < this.moinsChers.cout) { this.moinsChers = souscription }
  
          let lastDay = new Date(souscription.dateFin)
          if (Math.round(this.msToDay(lastDay - today)) <= souscription.delaisAlertePaiement && Math.round(this.msToDay(lastDay - today)) > 0) {
            this.forNotifications.push(souscription)
            console.log(Math.round(this.msToDay(lastDay - today)))
            this.forNotifications[id].nbrDaysRemaining = Math.round(this.msToDay(lastDay - today)) + 1
            id += 1
          }
        })
      }
        console.log(this.forNotifications)
        console.log('lol')
    },
    async deleteSouscription (item) {
      const index = item.souscriptionID
      if (confirm('Êtes vous sûr de vouloir supprimer cette souscription ?')) {
        await axios.delete(this.baseSouscriptionUri + 'DeleteSouscription/' + index)
        this.loadSouscriptions()
      }
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedSouscription = Object.assign({}, this.newSouscription)
        this.editedIndex = -1
        this.e6 = 1
      }, 300)
    },
    async save () {
      if (this.editedIndex > -1) {
        let tmp = {
          souscriptionID: this.editedSouscriptionId,
          fournisseur: this.editedSouscription.fournisseur,
          service: this.editedSouscription.service,
          cout: this.editedSouscription.cout,
          syntheseOffre: this.editedSouscription.syntheseOffre,
          alerteMail: false,
          dateDebut: this.editedSouscription.dateDebut,
          dateFin: this.editedSouscription.dateFin,
          delaisAlertePaiement: this.editedSouscription.delaisAlertePaiement,
          delaisAlerteResiliation: 0,
          userID: this.currentUser.userID
        }
        await axios.put(this.baseSouscriptionUri + 'PutSouscription/' + this.editedSouscriptionId, tmp)
        .catch(e => (console.error(e)))
      } else {
        let tmp = {
          souscriptionID: 13,
          fournisseur: this.editedSouscription.fournisseur,
          service: this.editedSouscription.service,
          cout: this.editedSouscription.cout,
          syntheseOffre: this.editedSouscription.syntheseOffre,
          alerteMail: false,
          dateDebut: this.editedSouscription.dateDebut,
          dateFin: this.editedSouscription.dateFin,
          delaisAlertePaiement: this.editedSouscription.delaisAlertePaiement,
          delaisAlerteResiliation: 0,
          userID: this.currentUser.userID
        }
        await axios.post(this.baseSouscriptionUri + 'PostSouscription/' + this.currentUser.userID, tmp)
        .catch(e => (console.error(e)))
      }
      this.loadSouscriptions()
      this.close()
    }
  },
  mounted () {
    this.formatter = new Intl.NumberFormat('fr-Fr', {
      style: 'currency',
      currency: 'EUR'
    })
    this.currentUser = JSON.parse(window.localStorage.getItem('alpha-user-connected'))
    this.loadSouscriptions()
    console.log('lolololol')
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
