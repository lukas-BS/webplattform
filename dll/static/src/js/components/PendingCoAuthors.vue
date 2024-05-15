<template>
  <div v-if="props.pendingCoAuthors.length">
    <p>Folgende Co-Autor_innen haben eine ausstehende Einladung:</p>
    <ul class="list-unstyled">
      <li v-for="author in props.pendingCoAuthors">
        {{ author }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  pendingCoAuthors: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped></style>
