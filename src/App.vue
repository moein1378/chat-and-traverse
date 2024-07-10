<template>
  <div>
    <div class="bg-blue-600 p-5 capitalize flex items-center justify-center gap-5">
      <router-link class="text-white cursor-pointer" :to="{name:'chat-app'}" >chat</router-link>
      <router-link class="text-white cursor-pointer" :to="{name:'tree-traverse'}" >tree traverse</router-link>
    </div>
    <RouterView />
  </div>
</template>