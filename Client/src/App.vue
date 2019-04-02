<template>
  <v-app>
    <v-toolbar color="blue darken-2 white--text">
        <v-icon>data_usage</v-icon>
        <v-toolbar-title>Headless CMS</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn class="white--text" flat to="/">Home</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer color="blue darken-2 white--text" class="pa-3">
      <v-spacer class="hidden-sm-and-down"/>
      <div>Application created by Hurdock.</div>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  },
  metaInfo: {
    title: 'Untitled page',
    titleTemplate: '%s - Headless CMS',
  }
}
</script>

<style>
.swal2-popup { font-family: 'Roboto'; }
.scrollable {
  max-height: 400px;
  overflow-y: auto;
}
</style>