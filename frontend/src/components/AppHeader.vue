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
    background-color: #333;
    width: 100%;
    padding: 20px 0;
}
</style>