<script setup>
const isDialogOpen = defineModel();

</script>

<template>
  <v-dialog v-model="isDialogOpen" max-width="400">
    <v-card>
      <v-card-title class="text-h6">매물을 삭제하시겠습니까?</v-card-title>
      <v-card-text>삭제된 매물은 복구할 수 없습니다.</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="isDialogOpen = false">취소</v-btn>
        <v-btn color="error" variant="flat" @click="deleteProperty">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

