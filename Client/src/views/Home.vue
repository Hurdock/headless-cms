<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 lg3 v-for="(collection, index) in collections" :key=index>
        <v-card>
          <v-card-title class="mb-0 headline" primary-title>{{collection.title}}</v-card-title>
          <v-card-actions>
            <v-btn flat :to="'/manage-collection/' + collection._id">Manage documents</v-btn>
            <v-btn flat :to="'/edit-collection/' + collection._id">Edit</v-btn>
            <v-btn flat @click="deleteCollection(collection._id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 v-if="collections && collections.length == 0">
        <div class="subheading">There are no collections available yet.</div>
      </v-flex>
    </v-layout> 
    <v-btn class="mb-5 blue darken-2 white--text" absolute fab bottom right to="/create-collection">
      <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import axios from "@/others/axios.js";
export default {
  title: "Home",
  data: function() {
    return {
      collections: null
    };
  },
  metaInfo: {
    title: "Home"
  },
  methods: {
    deleteCollection: function(id) {
      let self = this;
      axios.post("/contents/removeCollection/" + id).then(res => {
        self.collections.forEach((col, index) => {
          if (col._id != id) return;
          self.collections.splice(index, 1);
        });
      });
    }
  },
  mounted: function() {
    var self = this;
    axios.get("/contents/fetchCollections").then(function(response) {
      self.collections = response.data;
    });
  }
};
</script>