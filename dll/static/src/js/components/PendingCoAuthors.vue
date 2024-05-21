<template>
  <div v-if="props.pendingCoAuthors.length">
    <p>Folgende Co-Autor_innen haben eine ausstehende Einladung:</p>
    <ul class="list-unstyled">
      <li v-for="(author, index) in props.pendingCoAuthors" :key="index">
        {{ author }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  pendingCoAuthors: {
    required: true,
    type: Array
  }
});
</script>

<style scoped></style>
