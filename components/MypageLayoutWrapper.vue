<template>
  <v-container fluid class="mt-4">
    <v-row>
      <v-col cols="12" md="3">
        <MyPageSidebar />
      </v-col>
      <v-col cols="12" md="9">
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>
