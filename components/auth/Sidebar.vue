<script lang="ts" setup>
import logo from '../../assets/media/logo.png'
</script>

<template>
  <div class="bg-indigo-600 h-full flex items-center justify-center text-center p-8 custom-panel">
    <div class="text-white text-center">
      <div class="flex justify-center items-center">
        <img :src="logo" class="w-14 h-14 flex justify-center items-center">
      </div>
      <a href="#">
        <h5 id="typed-text" class="mt-5 text-xl font-bold tracking-tight text-white underline">Let AI Shape Your Ideas With</h5>
      </a>
      <p class="text-4xl font-bold mt-5 cursor-pointer" @click="navigateTo('/')">
        AI FLOWMAPPER
      </p>
    </div>
  </div>
</template>

<style>
.custom-panel {
  /* background-image: url('https://cdn.dribbble.com/users/32512/screenshots/3629624/ai_product_v2.gif'); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

#typed-text {
  font-family: Arial, sans-serif;
  font-size: 20px;
  border-right: 2px solid black; /* Blinking cursor effect */
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflow characters */
  animation: typing-animation 3s steps(40);
}

@keyframes typing-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
