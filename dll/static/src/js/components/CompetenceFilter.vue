<template>
  <div>
    <h3 class="form-subhead">
      Kompetenzen in der digitalen Welt
    </h3>
    <ul class="list-unstyled">
      <li class="form-check">
        <input
          id="competence-1"
          v-model="competences"
          class="form-check-input"
          type="checkbox"
          name="competenceType"
          value="1"
          @change="update"
        >
        <label
          class="form-check-label"
          for="competence-1"
        >Suchen, Verarbeiten & Aufbewahren</label>
      </li>
      <li class="form-check">
        <input
          id="competence-2"
          v-model="competences"
          class="form-check-input"
          type="checkbox"
          name="competenceType"
          value="2"
          @change="update"
        >
        <label
          class="form-check-label"
          for="competence-2"
        >Kommunizieren & Kooperieren</label>
      </li>
      <li class="form-check">
        <input
          id="competence-3"
          v-model="competences"
          class="form-check-input"
          type="checkbox"
          name="competenceType"
          value="3"
          @change="update"
        >
        <label
          class="form-check-label"
          for="competence-3"
        >Produzieren & Präsentieren</label>
      </li>
      <li class="form-check">
        <input
          id="competence-4"
          v-model="competences"
          class="form-check-input"
          type="checkbox"
          name="competenceType"
          value="4"
          @change="update"
        >
        <label
          class="form-check-label"
          for="competence-4"
        >Schützen & sicher Agieren</label>
      </li>
      <li class="form-check">
        <input
          id="competence-5"
          v-model="competences"
          class="form-check-input"
          type="checkbox"
          name="competenceType"
          value="5"
          @change="update"
        >
        <label
          class="form-check-label"
          for="competence-5"
        >Problemlösen & Handeln</label>
      </li>
      <li class="form-check">
        <input
          id="competence-6"
          v-model="competences"
          class="form-check-input"
          type="checkbox"
          name="competenceType"
          value="6"
          @change="update"
        >
        <label
          class="form-check-label"
          for="competence-6"
        >Analysieren & Reflektieren</label>
      </li>
    </ul>
  </div>
</template>

<script setup>
//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const competences = defineModel({
  default: () => [],
  type: Array,
})
</script>

<style scoped></style>
