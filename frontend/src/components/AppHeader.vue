<script setup>
import TopMenu from '@/components/TopMenu.vue';

</script>

<template>
    <header>
        <div class="container">
            <TopMenu/>
        </div>
    </header>
</template>

<style lang="scss" scoped>
header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(23, 23, 25, 0.44);
    box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(25px);
    width: 100%;
    padding: 20px 0;
}
</style>