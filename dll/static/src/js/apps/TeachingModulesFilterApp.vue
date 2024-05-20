<template>
  <div class="row mt-5 mb-5">
    <div class="col col-12 col-lg-5 col-xl-4 mb-5">
      <div class="section-info">
        <form action="" id="filterForm" class="collapse d-lg-block">
          <h2>Filtern nach</h2>

          <h3 class="form-subhead">Sortierung</h3>
          <select name="sortby" id="sortby-select" class="form-control" v-model="sorting" @change="updateContents">
            <option value="-latest">Neustes zuerst</option>
            <option value="latest">Ältestes zuerst</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
          <h3 class="form-subhead">Schlagwortsuche</h3>
          <input type="text" v-model="q" name="searchTerm" class="form-control" @keydown="preventEnter" />

          <div class="form-check mt-3">
            <input
              type="checkbox"
              name="hybrid"
              id="input-hybrid"
              v-model="hybrid"
              class="form-check-input"
              @change="updateContents" />
            <label for="input-hybrid" class="form-check-label">Grundsätzlich geeignet für den Hybridunterricht</label>
          </div>

          <CompetenceFilter v-model="competences" />
          <div>
            <h3 class="form-subhead">Unterrichtsfach</h3>
            <ul class="list-unstyled">
              <li v-for="subject in getSubjects()" class="form-check">
                <input
                  type="checkbox"
                  :value="subject.value"
                  name="subjects"
                  :id="'subject-' + subject.value"
                  v-model="subjects"
                  class="form-check-input"
                  @change="updateContents" />
                <label :for="'subject-' + subject.value" class="form-check-label">{{ subject.name }}</label>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="form-subhead">Schulform</h3>
            <select v-model="schoolType" class="form-control" @change="updateContents">
              <option v-for="schoolType in getSchoolTypes()" :value="schoolType.value">{{ schoolType.name }}</option>
            </select>
          </div>
          <div>
            <h3 class="form-subhead">Jahrgangsstufe von / bis:</h3>
            <div class="row">
              <div class="col">
                <input
                  type="text"
                  name="schoolClassFrom"
                  v-model="schoolClassFrom"
                  class="form-control me-2"
                  @change="debouncedUpdate" />
              </div>
              <div class="col-1 text-center">-</div>
              <div class="col">
                <input
                  type="text"
                  name="schoolClassTo"
                  v-model="schoolClassTo"
                  class="form-control ms-2"
                  @change="debouncedUpdate" />
              </div>
            </div>
          </div>
        </form>
        <div class="text-center">
          <button
            class="button button--primary d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#filterForm"
            aria-expanded="false"
            aria-controls="filterForm">
            Filter ausklappen <span class="fas fa-chevron-circle-down"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="col col-12 col-lg-7 col-xl-8">
      <div class="row" v-if="contents.length > 0 || loading">
        <div class="col col-12 col-xl-6 mb-4" v-for="content in contents">
          <ContentTeaser :content="content" />
        </div>
        <Pagination
          v-model:pagination="pagination"
          v-model:current-page="currentPage"
          @jump-to="jumpTo"
          @next-page="nextPage"
          @previous-page="previousPage" />
      </div>
      <div class="row" v-else>
        <div class="col">
          <h2>Ihre Suchanfrage ergab keine Treffer.</h2>
          <p>
            Bitte versuchen Sie es mit anderen Suchbegriffen oder schauen Sie gern auf anderen Datenbanken für freie
            Unterrichtsmaterialien wie
            <a href="https://oerhoernchen.de/suche" target="_blank" rel="noopener noreferrer">OERhörchen</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';

import CompetenceFilter from '../components/CompetenceFilter.vue';
import ContentTeaser from '../components/ContentTeaser.vue';
import Pagination from '../components/Pagination.vue';
import { useContentFilter } from '../composables/contentFilter';
import { usePagination } from '../composables/pagination';
import { usePreventEnter } from '../composables/preventEnter';

const {
  dataUrl,
  queryParams,
  sorting,
  contents,
  loading,
  q,
  competences,
  debouncedUpdate,
  currentPage,
  updateContents,
  getSubjects,
} = useContentFilter();

const { pagination, jumpTo, previousPage, nextPage, updatePagination } = usePagination(updateContents);
const { preventEnter } = usePreventEnter();

const subjects = ref([]);
const schoolClassFrom = ref(null);
const schoolClassTo = ref(null);
const schoolType = ref(null);
const hybrid = ref(false);

dataUrl.value = '/api/unterrichtsbausteine';

const getSchoolTypes = () => window.schoolFilter;

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const teachingModulesQueryParams = computed(() => {
  return {
    subjects: subjects.value,
    schoolClassFrom: schoolClassFrom.value,
    schoolClassTo: schoolClassTo.value,
    schoolType: schoolType.value,
    hybrid: hybrid.value,
  };
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const initAppData = async () => {
  const initContentResponse = await updateContents();
  updatePagination(initContentResponse);
};

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watchEffect(() => {
  queryParams.value = teachingModulesQueryParams.value;
});

initAppData();
</script>

<style scoped></style>
