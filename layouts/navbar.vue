<template>
  <div class="flex">
    <div class="w-[15%] bg-[#323a40] min-h-screen  p-[30px]">
      <img
          class="mb-[30px]"
          src="/images/logo.svg"
          alt="Invest Armenia Logo"
      >
      <nuxt-link to="/">
        <button class="flex justify-center items-center  max-w-[200px] w-full rounded-lg transform transition-transform duration-300 hover:translate-y-[-5px]">
          <img src="/images/apartment.png" alt="Apartment" class="w-6 h-6 transform transition-transform duration-300 hover:scale-110">  Buildings
        </button>
      </nuxt-link>
    </div>
    <div class="w-[85%] bg-gray-200 p-[30px]">
      <NuxtPage/>
    </div>
  </div>
</template>
<script setup>

</script>
