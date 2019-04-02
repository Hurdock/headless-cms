import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Collection from './views/Collection.vue'
import ManageCollection from './views/ManageCollection.vue'
import Document from './views/Document.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/create-collection',
      name: 'Collection',
      component: Collection
    },
    {
      path: '/edit-collection/:id',
      name: 'Edit Collection',
      component: Collection
    },
    {
      path: '/manage-collection/:id',
      name: 'Manage collection',
      component: ManageCollection
    },
    {
      path: '/document/:id/:action',
      name: 'Document',
      component: Document
    }
  ]
})
