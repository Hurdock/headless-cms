<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="headline">Managing the documents of <b>{{collection.title}}</b></div>
        <v-divider class="my-4" />
        <div v-if="collection.data.length == 0">There are no documents created yet.</div>
        <v-expansion-panel v-if="collection.data.length > 0">
          <v-expansion-panel-content v-for="(entry,i) in collection.data" :key="i">
          <template v-slot:header>
          <div>#{{i}} - Document ID: {{entry._document_id}} <v-btn :to="`/document/${entry._document_id}/edit`" small flat>Edit</v-btn></div>
          </template>
          <v-card>
            <v-card-text>
              <v-textarea color="white" label="JSON Preview" :value="JSON.stringify(entry, undefined, 3)" hint="Hint text" rows=15 disabled=true />
            </v-card-text>
          </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-btn class="mb-5 blue darken-2" absolute dark fab bottom right :to="'/document/' + collection._id  + '/create'">
      <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
  import axios from '@/others/axios';
  import timeago from 'node-time-ago';
  export default {
    title: "Manage Collection",
    data: function() {
      return {
        title: 'Manage collection',
        collection: null
      }
    },
    methods: {
      formatTime: function(time) {
        return timeago(time);
      },
      deleteDocument: function(contentId, documentID, index) {
        axios.post("/contents/removeDocument", { documentId: documentID, contentId: contentId })
        .then((res) => {
          this.data.data.splice(index, 1);
        })
      }
    },
    metaInfo: function() {
      return {
        title: this.title
      }
    },
    mounted: function() {
      var self = this;
      axios.get("/contents/fetchCollection/" + self.$route.params.id).then(function(response) {
        self.collection = response.data;
        self.title = 'Managing ' + response.data.title + '';
      });
    }
  }
</script>