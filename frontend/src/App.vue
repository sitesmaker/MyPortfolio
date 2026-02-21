<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Главная</router-link>
        <router-link to="/projects">Проекты</router-link>
        <router-link to="/skills">Навыки</router-link>
        <router-link to="/contact">Контакты</router-link>
      </nav>
    </header>
    
    <main>
      <router-view />
    </main>
    
    <footer>
      <p>&copy; 2024 Мое Портфолио</p>
    </footer>
  </div>
</template>