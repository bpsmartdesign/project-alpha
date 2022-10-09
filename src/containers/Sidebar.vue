<template>
  <div class="sidebar elevation-20">
    <v-list class="v-list-sidebar" ref="sidebar">
      <v-list-item-group v-model="model">
        <v-list-item v-for="(item, index) in items" :key="index" :to="item.uri">
          <v-list-item-icon>
            <v-icon light v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item @click="setSubMenu()">
          <v-list-item-icon>
            <v-icon light>mdi-cogs</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
              <v-list-item-title>Paramètres</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
      </v-list-item-group>
    </v-list>
    <!-- <div class="sub-menu fade-in-left" transition="slide-x-transition" v-show="subMenu">
      <span class="close-sub-menu elevation-4" @click="setSubMenu()">x</span>
      <v-list class="inherit" rounded>
        <v-subheader class="caption">Souscriptions</v-subheader>
        <v-list-item-group v-model="setModel">
          <v-list-item to="/app/category-settings">
            <v-list-item-icon class="mr-1">
              <v-icon small>mdi-buffer</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="caption">Catégories</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/app/fournisseur-settings">
            <v-list-item-icon class="mr-1">
              <v-icon small>mdi-graph-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="caption">Fournisseurs</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/app/service-settings">
            <v-list-item-icon class="mr-1">
              <v-icon small>mdi-puzzle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="caption">Services</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-subheader class="caption">Utilisateur</v-subheader>
        <v-list-item-group v-model="setModel">
          <v-list-item to="/app/user-settings">
            <v-list-item-icon class="mr-1">
              <v-icon small>mdi-account-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="caption">Utilisateurs</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div> -->
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
  data () {
    return {
      items: [
        { icon: 'mdi-desktop-mac-dashboard', text: 'Accueil', uri: '/app/reports' },
        // { icon: 'mdi-desktop-mac-dashboard', text: 'Tableau de Bord', uri: '/app/dashboard' },
        { icon: 'mdi-calendar-multiple', text: 'Diagramme', uri: '/app/services' }
        // { icon: 'mdi-plus', text: 'Autres', uri: '/app/others' }
      ],
      model: 1,
      setModel: 0,
      subMenu: false
    }
  },
  methods: {
    setSubMenu () {
      if (!this.subMenu) {
        this.$refs.sidebar.$el.classList.add('hide-sidebar')
      } else {
        this.$refs.sidebar.$el.classList.remove('hide-sidebar')
      }
      this.subMenu = !this.subMenu
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-menu {
  position: absolute;
  top: 80px;
  left: 0px;
  background: #eee;
  width: 200px;
  height: 100%;
  z-index: 9999;
  padding-top: 20px;

  .close-sub-menu {
    position: absolute;
    right: -15px;
    display: block;
    width: 40px;
    height: 40px;
    background: #eee;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    cursor: pointer;

    &:hover {
      background: #ddd;
      transition-duration: .3s;
      transform: scale(.9) rotate(360deg);
    }
  }
}
.inherit {
  background: inherit !important;
  margin: 0 !important;
}
.fade-in-left {
  animation : fadeInLeft .3s both;
}
@keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
</style>
