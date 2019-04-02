<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <h1 class="headline">        
          <v-icon class="mr-2">class</v-icon>
          {{creating == true ? title : 'Managing document ' + data.document._document_id}}
        </h1>
        <v-btn flat v-if="creating == false" @click="editJSON = !editJSON">{{editJSON == true ? 'Normal view' : 'JSON View' }}</v-btn>
        <v-btn flat v-if="creating == false" @click="deleteDocument(data.document_document_parentID, data.document_document_id)">Delete this document</v-btn>
        <v-divider class="my-4" />
      </v-flex>
      <v-flex v-if="editJSON == false && data != null" xs12>
        <v-card class="mb-3" v-for="(form ,index) in data.forms" :key=index>
          <v-card-title>{{form.label}} ({{form.key}})</v-card-title>
          <div v-if="form.type == 'text'">
            <v-card-text>
              <v-text-field v-model="forms[index]" :label=form.label />           
            </v-card-text>   
          </div>
          <div v-if="form.type == 'textarea'">
            <v-card-text>
              <v-textarea v-model="forms[index]" rows="4" :label=form.label />
            </v-card-text>
          </div>
          <div v-if="form.type == 'number'">
            <v-card-text>
              <v-text-field type="number" v-model="forms[index]" :label=form.label></v-text-field>
            </v-card-text>
          </div>
          <div v-if="form.type == 'menu'">
            <v-card-text>
               <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn color="grey darken-2 white--text" v-on="on">
                    {{ forms[index] || 'Click to choose'}}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-tile v-for="(item, x) in data.forms[index].options" :key="x" @click="forms[index] = item">
                    <v-list-tile-title>{{ item }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-card-text>
          </div>
        </v-card>
      </v-flex>
      <v-flex v-if="editJSON == true && data != null">
        <v-card>
          <v-card-title>Edit JSON</v-card-title>
          <v-card-text>
            <v-textarea id="json-editor" rows=30 :value="JSON.stringify(data.document, undefined, 2)"></v-textarea>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-btn @click="creating == true ? addDocument() : saveDocument()" color="success">{{creating == true ? 'Create this new document' : 'Save the modifications'}}</v-btn>
      </v-flex>
    </v-layout> 
  </v-container>
</template>

<script>
  import axios from "@/others/axios.js";

  export default {
    name: "Document",
    data: function() {
      return {
        title: 'Create new document',
        creating: true,
        data: null,
        forms: [],
        editJSON: false
      }
    },
    methods: {
      deleteDocument: function(contentId, documentID) {
        let self = this;
        axios.post("/contents/removeDocument", { documentId: self.data.document._document_id, contentId: self.data.document._document_parentID })
        .then((res) => {
          self.$router.push("/manage-collection/" + self.data.document._document_parentID);
        })
      },
      parseForm: function (input, method) {
        if (method == 'number') {
          return parseInt(input);
        } 
        else {
          return input;
        }
      },
      saveDocument: function (method) {
        let doc = this.data.document;
        if (this.editJSON == false) {
          this.data.forms.forEach((form, index) => {
            doc[form.key] = this.parseForm(this.forms[index], form.type) || form.defaultValue
          });
        } else {
          let json = $("#json-editor").val();
          if (!JSON.parse(json)) return console.log('JSON is not valid.');
          doc = JSON.parse(json);
        }
        axios.post("/contents/updateDocument/" + this.data.document._document_id, { doc: doc })
          .then((res) => {
            Swal.fire(
              'Changes saved!',
              'Your changes to this document have been saved!',
              'success'
            );
        });
      },
      addDocument: function () {
        var self = this;
        let obj = {  _document_data: new Date() };
        self.data.forms.forEach((form, index) => {
          obj[form.key] = self.forms[index] || form.defaultValue
        });
        axios.post("/contents/postDocument/" + self.$route.params.id, { document: obj })
          .then((res) => {
            self.$router.push("/manage-collection/" + self.$route.params.id);
            Swal.fire(
              'New document for ' + self.data.title + '!',
              'Your new document has been added in the collection!',
              'success'
            );
        })
      }
    },
    metaInfo: function() {
      return {
        title: this.title
      }
    },
    mounted: function() {
      let self = this;
      if (self.$route.params.action == 'create') {
        axios.get("/contents/fetchCollection/" + self.$route.params.id).then(function (response) {
          self.data = response.data;
          self.title = 'Adding new entry in ' + response.data.title;
          self.data.forms.forEach((form, index) => {
            self.forms.push(form.defaultValue);
          });
        });
        self.creating = true;
      } else if (self.$route.params.action == 'edit') {
        axios.get("/contents/fetchDocument/" + self.$route.params.id).then(function (responseDoc) {
          axios.get("/contents/fetchCollectionStats/" + responseDoc.data._id).then(function (responseStats) {
            self.data = {
              document: responseDoc.data.data[0],
              forms: responseStats.data.forms,
              title: responseStats.data.title
            }
            self.data.forms.forEach((form, index) => {
              self.forms.push(self.data.document[form.key]);
            });
            self.title = 'Editing: ' + self.data.document.title;
          });
          self.creating = false;
        });
      }
      axios.get("/files/fetchFolder/images").then(function (response) {
        self.files.images = response.data;
      });
    }
  }
</script>
