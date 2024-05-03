<template>
  <div class="row mt-5 mb-5">
    <div class="col col-12 col-lg-5 col-xl-4 mb-4">
      <div class="section-info">
        <div class="row d-lg-none" v-if="windowWidth < 1200">
          <div class="col-12">
            <h1 class="mb-3" v-html="windowCom.competenceName"></h1>
          </div>
          <div class="col-12 mb-4" v-html="windowCom.videoEmbed"></div>
          <div class="col-12">
            <p>
              <b class="font-weight-bold" v-html="windowCom.competenceTextTitle"></b>
            </p>
            <p class="mb-5 d-lg-none" v-html="windowCom.competenceText"></p>
          </div>
        </div>
        <form method="get" :action="resource" class="collapse d-lg-block" id="filterForm">
          <h2>Filtern nach</h2>

          <h3 class="form-subhead">Sortierung</h3>
          <select name="sortby" id="sortby-select" v-model="sorting" @change="updateContents" class="form-control">
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
          <h3 class="form-subhead">Schlagwortsuche</h3>
          <input type="text" v-model="searchTerm" name="searchTerm" class="form-control" @keydown="preventEnter" />
          <h3 class="form-subhead">Auswahl</h3>
          <ul class="list-unstyled">
            <li class="form-check">
              <input
                type="checkbox"
                id="teaching-modules-checkbox"
                @change="updateContents"
                v-model="teachingModules"
                class="form-check-input" />
              <label class="form-check-label" for="teaching-modules-checkbox">Unterrichtsbausteine</label>
            </li>
            <li class="form-check">
              <input
                type="checkbox"
                id="tools-checkbox"
                @change="updateContents"
                v-model="tools"
                class="form-check-input" />
              <label class="form-check-label" for="tools-checkbox">Tools</label>
            </li>
            <li class="form-check">
              <input
                type="checkbox"
                id="trends-checkbox"
                @change="updateContents"
                v-model="trends"
                class="form-check-input" />
              <label class="form-check-label" for="trends-checkbox">Trends</label>
            </li>
          </ul>
        </form>
        <div class="text-center">
          <button
            class="button button--primary d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-target="#filterForm"
            aria-expanded="false"
            aria-controls="filterForm">
            Filter ausklappen <span class="fas fa-chevron-circle-down"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="col col-12 col-lg-7 col-xl-8">
      <div class="section-info mb-5" v-if="windowWidth >= 1200">
        <div class="row">
          <div class="col-12">
            <h1 class="d-none d-lg-block text-center mb-5" v-html="windowCom.competenceName"></h1>
          </div>
          <div class="col-lg-12 col-xl-7 mb-4" v-html="windowCom.videoEmbed"></div>
          <div class="col-lg-12 col-xl-5">
            <p>
              <b class="font-weight-bold" v-html="windowCom.competenceTextTitle"></b>
            </p>
            <p class="mb-5 d-none d-lg-block" v-html="windowCom.competenceText"></p>
          </div>
        </div>
      </div>
      <div class="row" v-if="contents.length > 0 || loading">
        <div class="col col-12 col-xl-6 mb-4" v-for="content in contents">
          <ContentTeaser :content="content" />
        </div>
        <Pagination
          :current-page="currentPage"
          :pagination="pagination"
          @prev="previousPage"
          @next="nextPage"
          @jump="jumpTo" />
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
import debounce from 'lodash/debounce';
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import { usePagination } from '../composables/pagination';
import { usePreventEnter } from '../composables/preventEnter';
import axios from 'axios';

import Pagination from '../components/Pagination.vue';
import ContentTeaser from '../components/ContentTeaser.vue';

//  --------------------------------------------------------------------------------------------------------------------
//  component variables
//  --------------------------------------------------------------------------------------------------------------------
const { pagination, currentPage, jumpTo, previousPage, nextPage, updatePagination } = usePagination();
const { preventEnter } = usePreventEnter();

const contents = ref([]);
const loading = ref(true);
const sorting = ref('az');
const searchTerm = ref('');
const teachingModules = ref(true);
const trends = ref(true);
const tools = ref(true);
const windowWidth = ref(0);

// const competence = ref({
//   name: 'Kommunizieren & Kooperieren',
//   description:
//     'Um im digitalen Raum adäquat KOMMUNIZIEREN & KOOPERIEREN zu können, braucht es entsprechende Kompetenzen, digitale Werkzeuge zur angemessenen und effektiven Kommunikation einsetzen und in digitalen Umgebungen zielgerichtet kooperieren zu können. Dabei geht es vor allem darum, entsprechend der jeweiligen Situation und ausgerichtet an den Kommunikations- bzw. Kooperationspartnern die passenden Werkzeuge auszuwählen und entsprechende Umgangsregeln einzuhalten.',
// });

const resource = '/api/inhalte';

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const windowCom = computed(() => {
  return window;
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const getParams = (page) => {
  return {
    q: searchTerm.value,
    sorting: sorting.value,
    teachingModules: teachingModules.value,
    trends: trends.value,
    tools: tools.value,
    competence: window.competenceSlug,
    page: Number.isInteger(page) ? page : 1,
  };
};

const updateContents = (page) => {
  loading.value = true;
  axios
    .get(resource, {
      params: getParams(page),
    })
    .then((response) => {
      window.scroll(0, 0);
      contents.value = response.data.results;
      updatePagination(response);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const onResize = () => {
  windowWidth.value = window.innerWidth;
};

const debouncedUpdate = debounce(updateContents, 500);

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watch(searchTerm, () => {
  debouncedUpdate();
});

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
onMounted(async () => {
  windowWidth.value = window.innerWidth;
  await nextTick();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

updateContents();
</script>

<style scoped></style>
