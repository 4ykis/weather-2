<script setup>
    import Home from '@/pages/home/Home.vue';
</script>
<template>    
    <router-view></router-view>
    <!-- <Home /> -->
</template>

<style>
    * {
        box-sizing: border-box;    
    }

    *:focus {
        outline: none;
    }

    body, html {
        padding: 0;
        margin: 0;
    }
</style>
