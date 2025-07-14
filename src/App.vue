<template>
  <!-- <Navbar v-if="!$route.meta.hideNavbar"/> -->
   <Navbar v-show="!$route.meta.hideNavbar"/>

  <router-view></router-view>

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