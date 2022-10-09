<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap class="pt-12">
      <v-flex sm4 xs6 md6 lg3>
        <v-card class="mt-4" tile>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Bilan des Dépenses</div>
              <v-list-item-title class="secondary--text display-1" v-if="formatter">{{ formatter.format(depenses) }}</v-list-item-title>
              <v-list-item-subtitle class="ml-2 caption grey--text font-weight-light">De toutes les souscriptions</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" tile color="secondary" style="border-radius: 5px" class="elevation-5">
              <v-icon dark size="40">mdi-cash-multiple</v-icon>
            </v-list-item-avatar>
          </v-list-item>

          <v-divider class="mx-4 my-0"></v-divider>

          <v-card-text>
            <v-icon class="mr-2" small>mdi-clock-outline</v-icon>
            <span class="caption grey--text font-weight-light">il y'a 5 minutes ...</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm4 xs6 md6 lg3>
        <v-card class="mt-4" tile>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Dépenses avec Remise</div>
              <v-list-item-title class="warning--text display-1" v-if="formatter">{{ formatter.format(depensesRemise) }}</v-list-item-title>
              <v-list-item-subtitle class="ml-2 caption grey--text font-weight-light">De toutes les souscriptions</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" tile color="warning" style="border-radius: 5px" class="elevation-5">
              <v-icon dark size="40">mdi-currency-eur</v-icon>
            </v-list-item-avatar>
          </v-list-item>

          <v-divider class="mx-4 my-0"></v-divider>

          <v-card-text>
            <v-icon class="mr-2" small>mdi-clock-outline</v-icon>
            <span class="caption grey--text font-weight-light">il y'a 5 minutes ...</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm4 xs6 md6 lg3>
        <v-card class="mt-4" tile>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Montant économisé</div>
              <v-list-item-title class="success--text display-1" v-if="formatter">{{ formatter.format(depenses - depensesRemise) }}</v-list-item-title>
              <v-list-item-subtitle class="ml-2 caption grey--text font-weight-light">Depuis le début</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" tile color="success" style="border-radius: 5px" class="elevation-5">
              <v-icon dark size="40">mdi-currency-sign</v-icon>
            </v-list-item-avatar>
          </v-list-item>

          <v-divider class="mx-4 my-0"></v-divider>

          <v-card-text>
            <v-icon class="mr-2" small>mdi-calendar</v-icon>
            <span class="caption grey--text font-weight-light">il y'a 2 jours ...</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm4 xs6 md6 lg3>
        <v-card class="mt-4" tile>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">Pertes possibles</div>
              <v-list-item-title class="red--text display-1" v-if="formatter">{{ formatter.format(2715) }}</v-list-item-title>
              <v-list-item-subtitle class="ml-2 caption grey--text font-weight-light">les 3 prochains mois</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" tile color="red" style="border-radius: 5px" class="elevation-5">
              <v-icon dark size="40">mdi-database-lock</v-icon>
            </v-list-item-avatar>
          </v-list-item>

          <v-divider class="mx-4 my-0"></v-divider>

          <v-card-text>
            <v-icon class="mr-2" small>mdi-clock-outline</v-icon>
            <span class="caption grey--text font-weight-light">il y'a 5 minutes ...</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm6 xs12 md6 lg4 class="mt-5">
        <v-card tile :loading="loading" class="mx-auto">
          <v-sheet class="v-sheet--offset mx-auto py-3 px-3" elevation="10" max-width="calc(100% - 32px)">
            <pie-chart height="135px" legend="right" :donut="true" :data="[['Eau', 44], ['Electricité', 23], ['Gaz', 16], ['Transport', 23]]"></pie-chart>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2">Catégorie de services</div>
            <div class="subheading font-weight-light grey--text">Les plus utilisés</div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>mdi-clock</v-icon>
            <span class="caption grey--text font-weight-light">Selon les 15 dernières heures</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm6 xs12 md6 lg4 class="mt-5">
        <v-card tile :loading="loading" class="mx-auto">
          <v-sheet class="v-sheet--offset mx-auto py-3 px-3" elevation="10" max-width="calc(100% - 32px)">
            <column-chart height="135px" :colors="['indigo', '#fff']" :data="[['Sun', 32], ['Mon', 46], ['Tue', 28], ['Wed', 22], ['Thu', 39], ['Fri', 30], ['Sat', 18]]"></column-chart>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2">Bilan Hebdomadaire</div>
            <div class="subheading font-weight-light grey--text">Relatif à la semaine en cours</div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>mdi-calendar</v-icon>
            <span class="caption grey--text font-weight-light">Mis à jour toutes les semaines</span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Chartkick.use(Chart))

export default {
  data () {
    return {
      alert: true,
      loading: false,
      selection: 1,
      souscriptions: null,
      plusChers: 0,
      moinsChers: 0,
      depenses: 0,
      depensesRemise: 0,
      economie: null,
      formatter: null,
      headers: [
        { text: 'Souscription', value: 'souscription' },
        { text: 'Fournisseurs', value: 'abonnement' },
        { text: 'Services', value: 'categorie' },
        { text: 'Coût', value: 'prixAvecRemise' },
        { text: 'Début', value: 'date_debut' },
        { text: 'Fin', value: 'date_fin' },
        { text: 'Description', value: 'description' },
        { text: 'Statut', value: 'statut' }
      ],
      color: ['red', 'warning', 'success']
    }
  },
  mounted () {
    this.formatter = new Intl.NumberFormat('fr-Fr', {
      style: 'currency',
      currency: 'EUR'
    })
    if (window.localStorage.getItem('souscriptions') !== null && window.localStorage.getItem('souscriptions').length > 0) {
      this.souscriptions = JSON.parse(window.localStorage.getItem('souscriptions'))
      this.moinsChers = this.souscriptions[0].prixAvecRemise

      this.souscriptions.forEach(souscription => {
        this.depenses += parseInt(souscription.prixSansRemise)
        this.depensesRemise += parseInt(souscription.prixAvecRemise)

        if (souscription.prixAvecRemise > this.plusChers) {
          this.plusChers = parseInt(souscription.prixAvecRemise)
        }
        if (souscription.prixAvecRemise < this.moinsChers) {
          this.moinsChers = parseInt(souscription.prixAvecRemise)
        }
      })
    }
  }
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