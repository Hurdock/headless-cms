<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <h1 class="headline">        
          <v-icon class="mr-2">collections_bookmark</v-icon>
          {{editing == true ? title : 'Creating a new collection'}}
        </h1>
        <v-divider class="my-4" />
        <v-text-field v-model="collection.title" label="Collection title" required></v-text-field>
      </v-flex>
      <v-flex xs12 lg2 class="mr-2" v-for="(entry, index) in collection.forms" :key=index>
        <v-card>
          <v-card-title>Object Key: {{entry.key}}, Type: {{entry.type}}</v-card-title>
          <v-card-actions>
            <v-btn @click="selectedForm = entry, editForm = true" flat>Edit</v-btn>
            <v-btn @click="collection.forms.splice(index, 1)" flat>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 v-if="collection.forms && collection.forms.length == 0">
        <div class="subheading">There are no forms created for this collection.</div>
      </v-flex>
      <v-flex xs12>
        <v-btn @click="saveModifications()" flat>{{editing == false ? 'Create this new collection' : 'Save the modifications'}}</v-btn>
      </v-flex>
    </v-layout> 
    <!-- Edit forms -->
    <v-dialog v-model="editForm" persistent max-width="400">
      <v-card v-if="selectedForm">
        <v-card-title class="headline">Editting object: {{selectedForm.key}}</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedForm.label" label="Label" />
          <v-text-field v-model="selectedForm.key" label="Object Key" />
          <v-text-field v-if="selectedForm.type != 'menu'" :type="selectedForm.type == 'number' ? 'number' : 'text'" v-model="selectedForm.defaultValue" label="Default value" />
          <div v-if="selectedForm.type == 'menu'">
            <p>Available menu items: </p>
            <v-chip v-for="(op, ix) in selectedForm.options" :key=ix >
              {{op}}
              <v-icon @click="selectedForm.options.splice(ix, 1)" class="ml-3" color="red">cancel</v-icon>
            </v-chip>
            <v-text-field v-model="optionMessage" @click:append-outer="selectedForm.options.push(optionMessage)" append-outer-icon="add" label="Add new item in menu"></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="editForm = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Adding fields -->
    <v-menu offset-y top>
      <template v-slot:activator="{ on }">
        <v-btn hint="Test" class="mb-5" v-on="on" absolute dark fab bottom right>
          <v-icon>add</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile v-for="(form,index) in form_types" :key=index>
          <v-list-tile-title @click="addField(form)">{{form}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
  import axios from "@/others/axios.js";
  export default {
    name: "Collection",
    data: function() {
      return {
        title: 'Create collection',
        editing: false,
        editForm: false,
        optionMessage: '',
        selectedForm: {},
        form_types: ['Text', 'Textarea', 'Number', 'Menu'],
        collection: {
          title: 'Untitled collection',
          forms: [{
            type: 'text',
            label: 'Label of the input',
            key: 'title',
            defaultValue: 'No value'
          }],
          data: []
        }
      }
    },
    methods: {
      saveModifications: function(method) {
        let self = this, editing = this.editing;
        if(editing == false) 
        {
          axios.post("/contents/insertCollection", { collection: self.collection })
          .then((res) => {
            self.$router.push("/");
            Swal.fire(
              `Collection added`,
              `Your new collection ${self.collection.title} has been added.`,
              'success'
            );
          });
        } else {
          axios.post("/contents/updateCollection/" + self.$route.params.id, { forms: self.collection.forms, title: self.collection.title })
          .then((res) => {
            self.$router.push("/");
            Swal.fire(
              `Collection updated`,
              `Collection ${self.collection.title} has been updated.`,
              'success'
            );
          })
        }
      },
      addField: function(type_form) {
        let obj;
        if(type_form == 'Text') {
          obj = {
            type: 'text',
            label: 'Title',
            key: 'title',
            defaultValue: 'No value'
          }
        }
        if(type_form == 'Textarea') {
          obj = {
            type: 'textarea',
            label: 'Textarea',
            key: 'textarea',
            defaultValue: 'No value'
          }
        }
        if(type_form == 'Number') {
          obj = {
            type: 'number',
            label: 'Number',
            key: 'number',
            defaultValue: 30
          }
        }
        if(type_form == 'Menu') {
          obj = {
            type: 'menu',
            placeholder: '',
            label: 'Menu list',
              key: 'menu',
            defaultValue: '',
            options: [
              'Item 1', 'Item 2', 'Item 3'
            ]
          }
        }
        this.collection.forms.push(obj);
      }
    },
    metaInfo: function() {
      return {
        title: this.title
      }
    },
    mounted: function() {
      let self = this;
      if(self.$route.params.id) {
        axios.get("/contents/fetchCollectionStats/" + self.$route.params.id).then(function(response) {
          self.collection.forms = response.data.forms;
          self.collection.title = response.data.title;
          self.title = 'Editing ' + self.collection.title + '';
        });
        self.editing = true;
      } else {
        self.title = 'New collection';
        self.editing = false;
      }
    }
  }
</script>
