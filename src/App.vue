<template>
  <Navbar v-if="!$route.meta.hideNavbar"/>
  <router-view></router-view>
  <!-- <router-link to="/admin" v-if="user">Admin Dashboard</router-link> -->

</template>

<script>
import Navbar from './components/pages/Navbar.vue'; 


export default {
  name: 'App',
  components: {
    Navbar,
  },
  provide() {
    return {
    };
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style>
</style>