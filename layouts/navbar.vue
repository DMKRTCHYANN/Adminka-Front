<template>
  <div class="flex">
    <div class="w-[15%] bg-[#1B263B] p-[30px] ">
      <nuxt-link to="/">
        <button class="mb-[30px]  flex justify-center max-w-[200px] w-full border border-black dark:bg-gray-700 dark:text-white">
          Car
        </button>
      </nuxt-link>
      <div>
        <nuxt-link to="/clients">
          <button class="flex justify-center max-w-[200px] w-full border border-black dark:bg-gray-700 dark:text-white">
            Client
          </button>
        </nuxt-link>
      </div>
      <div>
        <nuxt-link to="/sales">
          <button class="flex mt-[30px]  justify-center max-w-[200px] w-full border border-black dark:bg-gray-700 dark:text-white">
            Sales
          </button>
        </nuxt-link>
      </div>
    </div>
    <div class="w-[85%] bg-[#F8F9FA] p-[30px]">
      <NuxtPage/>
    </div>
  </div>
</template>
<script setup>

</script>
