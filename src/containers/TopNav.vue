<template>
  <v-app-bar app color="#4128de" dark>
    <v-app-bar-nav-icon @click.stop="setSidebar" />
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      <span class="hidden-sm-and-down">Projet Alpha <span class="font-style-italic caption font-weight-light">[Pré-developpement]</span></span>
    </v-toolbar-title>
    <!-- <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Rechercher ..." class="hidden-sm-and-down"/> -->
    <v-spacer />
    <!-- <v-btn icon><v-icon>mdi-apps</v-icon></v-btn> -->
    <v-badge v-if="forNotifications.length === 0" color="warning" content="0" value="0" overlap>
      <v-menu transition="slide-y-transition" :offset-y="true" bottom>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" fab small dark v-on="on">
            <v-icon small>mdi-bell</v-icon>
          </v-btn>
        </template>
      </v-menu>
    </v-badge>
    <v-badge v-if="forNotifications.length > 0" color="warning" :content="forNotifications.length" :value="forNotifications.length" overlap>
      <v-menu transition="slide-y-transition" :offset-y="true" bottom>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" fab small dark v-on="on">
            <v-icon small>mdi-bell</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in forNotifications" :key="i">
            <v-list-item-title v-if="souscriptions">La souscription au service <strong class="indigo--text">{{ item.service }}</strong> de <strong class="indigo--text">{{ item.fournisseur }}</strong> se termine dans <strong class="indigo--text">{{ item.nbrDaysRemaining }}</strong> Jour(s)</v-list-item-title>
            <v-divider class="mx-4 my-0"></v-divider>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-badge>
    <!-- <v-btn text icon dense class="mr-2 ml-2">
      <v-icon icon large>mdi-fullscreen</v-icon>
    </v-btn> -->
    <!-- <span>{{ currentUser.login }}</span> -->
    <div class="text-center ml-2">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-chip class="ma-2" color="indigo" text-color="white" v-on="on">
            <v-avatar left><v-icon>mdi-account-circle</v-icon></v-avatar>
            <span>{{ username }}</span>
            <!-- {{ currentUser.login }} -->
          </v-chip>
        </template>
        <v-list class="mt-3">
          <v-list-item @click="logout">
            <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>Se déconnecter</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TopNav',
  data () {
    return {
      sidebarVisible: true,
      forNotifications: [],
      souscriptions: [],
      currentUser: null,
      username: '',
      baseSouscriptionUri: 'http://api.wayfoster.com/api/souscriptions/'
    }
  },
  methods: {
    setSidebar () {
      let sidebar = document.querySelector('.sidebar')

      if (this.sidebarVisible) {
        sidebar.classList.add('hide-sidebar')
        setTimeout(() => {
          sidebar.classList.add('no-width')
        }, 100);
      } else {
        sidebar.classList.remove('hide-sidebar')
        sidebar.classList.remove('no-width')
      }

      this.sidebarVisible = !this.sidebarVisible
    },
    async loadSouscriptions () {
      let today = new Date()
      let id = 0
      
      this.forNotifications = []

      await axios.get(this.baseSouscriptionUri + 'GetSouscriptionPerUser/' +this.currentUser.userID)
      .then(response => (this.souscriptions = response.data))
      .catch(e => (console.log(e)))

      this.souscriptions.forEach(souscription => {
        let lastDay = new Date(souscription.dateFin)
        if (Math.round(this.msToDay(lastDay - today)) < souscription.delaisAlertePaiement && Math.round(this.msToDay(lastDay - today)) > 0) {
          this.forNotifications.push(souscription)
          this.forNotifications[id].nbrDaysRemaining = Math.round(this.msToDay(lastDay - today))
          id += 1
        }
      })
    },
    msToDay (nbr) { return nbr / (1000 * 3600 * 24)},
    logout () {
      localStorage.removeItem('alpha-user-connected')
      window.location.reload()
    }
  },
  mounted () {
    this.currentUser = JSON.parse(window.localStorage.getItem('alpha-user-connected'))
    this.loadSouscriptions()
    this.username = this.currentUser.login
  }
}
</script>