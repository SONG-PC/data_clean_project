<template>
  <transition name="autolist">
    <ul class="auto_list">
     

    </ul>
    <drowlist ref="mychild" />
    </transition>
</template>
<style>

  .autolist-enter-active {
    transition: all .1s;
    opacity: 1;
  }

  .autolist-leave-active {
    opacity: 0;
    transition: all .5s;
  }

  .autolist-enter, .autolist-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(20px)
  }
</style>
<script>
 

  export default {
    data: function () {
      return {

      }

    },
    methods: {
    


    },
    props: ["mylist"]

  }

</script>
