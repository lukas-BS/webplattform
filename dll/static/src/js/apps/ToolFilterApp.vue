<template>
  <div class="row mt-5 mb-5">
    <div class="col col-12 col-lg-5 col-xl-4 mb-4">
      <div class="section-info">
        <form action="" id="filterForm" class="collapse d-lg-block">
          <h2>Filtern nach</h2>
          <h3 class="form-subhead">Schlagwortsuche</h3>
          <input type="text" v-model="q" name="searchTerm" class="form-control" @keydown="preventEnter" />

          <div v-if="!dltFeaturesEnabled">
            <h3 class="form-subhead">Tool-Funktionen</h3>
            <ul class="list-unstyled">
              <li class="form-check" v-for="toolFunction in functionsFilter">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="toolFunctions"
                  :value="toolFunction.id"
                  name="toolFunction"
                  :id="'toolFunction' + toolFunction.id"
                  @change="debouncedUpdate" />
                <label class="form-check-label" :for="'toolFunction' + toolFunction.id">{{ toolFunction.title }}</label>
              </li>
            </ul>
          </div>
          <div v-if="dltFeaturesEnabled">
            <h3 class="form-subhead">Potentiale</h3>
            <ul class="list-unstyled">
              <li class="form-check" v-for="potential in potentialFilter">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :value="potential.value"
                  name="potential"
                  :id="'potential' + potential.value"
                  v-model="potentials" />
                <label class="form-check-label" :for="'potential' + potential.value">{{ potential.name }}</label>
              </li>
            </ul>
          </div>
          <div v-if="loggedIn && dltFeaturesEnabled">
            <h3 class="form-subhead">Meine favorisierten Tools</h3>
            <ul class="list-unstyled">
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  name="favorites"
                  v-model="favorites"
                  @change="debouncedUpdate"
                  id="favorites-checkbox" />
                <label class="form-check-label" for="favorites-checkbox">Anzeigen</label>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="form-subhead">Fächerbezug</h3>
            <select name="subject" id="subject" v-model="subject" @change="updateContents" class="form-control">
              <option value="" selected>--------</option>
              <option v-for="subject in getSubjects()" :value="subject.value">{{ subject.name }}</option>
            </select>
          </div>
          <div>
            <h3 class="form-subhead">Datenschutz</h3>
            <select
              name="dataPrivacy"
              id="dataPrivacy"
              v-model="dataPrivacy"
              @change="updateContents"
              class="form-control">
              <option value="" selected>--------</option>
              <option v-for="privacy in dataPrivacyOptions" :value="privacy.value">{{ privacy.name }}</option>
            </select>
          </div>
          <div>
            <h3 class="form-subhead">Anwendung:</h3>
            <ul class="list-unstyled">
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="App"
                  name="application"
                  id="application-1"
                  v-model="applications" />
                <label class="form-check-label" for="application-1">App</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="Website"
                  name="application"
                  id="application-2"
                  v-model="applications" />
                <label class="form-check-label" for="application-2">Website</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="Programm"
                  name="application"
                  id="application-3"
                  v-model="applications" />
                <label class="form-check-label" for="application-3">Programm</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="Browser-Add-on"
                  name="application"
                  id="application-4"
                  v-model="applications" />
                <label class="form-check-label" for="application-4">Browser-Add-on</label>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="form-subhead">Betriebssystem:</h3>
            <ul class="list-unstyled">
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="1"
                  name="os"
                  id="os-1"
                  v-model="operatingSystems" />
                <label class="form-check-label" for="os-1">Android</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="7"
                  name="os"
                  id="os-2"
                  v-model="operatingSystems" />
                <label class="form-check-label" for="os-2">BlackBerry OS</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="2"
                  name="os"
                  id="os-3"
                  v-model="operatingSystems" />
                <label class="form-check-label" for="os-3">iOS</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="5"
                  name="os"
                  id="os-4"
                  v-model="operatingSystems" />
                <label class="form-check-label" for="os-4">Linux</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="3"
                  name="os"
                  id="os-5"
                  v-model="operatingSystems" />
                <label class="form-check-label" for="os-5">macOS</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="4"
                  name="os"
                  id="os-6"
                  v-model="operatingSystems" />
                <label class="form-check-label" for="os-6">Windows</label>
              </li>
              <li class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value="6"
                  name="os"
                  id="os-7"
                  v-model="operatingSystems" />
                <label class="form-check-label" for="os-7">Windows Phone</label>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="form-subhead">Kostenpflichtig</h3>
            <select name="withCosts" id="withCosts" v-model="withCosts" @change="updateContents" class="form-control">
              <option value="" selected>--------</option>
              <option value="0" selected>Nein</option>
              <option value="1" selected>Ja</option>
            </select>
          </div>
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
      <div class="section-info mb-5" v-show="activePotentials.length" v-if="dltFeaturesEnabled">
        <div class="js-potential-slider potential-slider" ref="potentialSlider">
          <div
            class="js-potential-slide"
            v-for="potential in potentialFilter"
            ref="potentialSlides"
            :data-ref="potential.value">
            <div class="row">
              <div class="col-12">
                <h1 class="d-none d-lg-block text-center mb-5" v-text="potential.name"></h1>
              </div>
              <div class="col-lg-12 col-xl-7 mb-4" v-html="windowCom['potentialVideo' + potential.value]"></div>
              <div class="col-lg-12 col-xl-5">
                <p class="mb-5 d-none d-lg-block mt-3" v-html="potential.description"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="contents.length > 0 || loading">
        <div class="col col-12 col-xl-6 mb-4" v-for="content in contents">
          <ContentTeaser :content="content" />
        </div>
        <Pagination />
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
import { computed, nextTick, ref, watch, watchEffect } from 'vue';

import ContentTeaser from '../components/ContentTeaser.vue';
import Pagination from '../components/Pagination.vue';
import { useContentFilter } from '../composables/contentFilter';
import { usePreventEnter } from '../composables/preventEnter';

const { dataUrl, q, queryParams, sorting, contents, loading, loggedIn, debouncedUpdate, updateContents, getSubjects } =
  useContentFilter();
const { preventEnter } = usePreventEnter();

const applications = ref([]);
const subject = ref(null);
const toolFunctions = ref([]);
const potentials = ref([]);
const operatingSystems = ref([]);
const dataPrivacy = ref(null);
const withCosts = ref(null);
const slider = ref(null);
const favorites = ref(false);

const potentialSlider = ref();
const potentialSlides = ref();

dataUrl.value = '/api/tools';
sorting.value = 'privacy';

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const windowCom = computed(() => {
  return window;
});

//  ----------------------------------------------------------------------------
//  TODO: check if working
//  ----------------------------------------------------------------------------
const activePotentials = computed(() => {
  return potentials.value
    .map((activePotential) => {
      const pot = potentialFilter.value.find((p) => p.value.toString() === activePotential.toString());
      if (!pot) return;

      return {
        title: pot.name,
        description: pot.description,
        videoEmbed: window['potentialVideo' + pot.value],
        value: pot.value,
      };
    })
    .filter((p) => p);
});

const toolFilterQueryParams = computed(() => {
  const res = {
    dataPrivacy: dataPrivacy.value,
    applications: applications.value,
    operatingSystems: operatingSystems.value,
    toolFunctions: toolFunctions.value,
    withCosts: withCosts.value,
    potentials: potentials.value,
    subject: subject.value,
  };
  if (loggedIn.value) {
    res['favorites'] = favorites.value;
  }
  return res;
});

const dltFeaturesEnabled = computed(() => {
  return window.dltFeatures;
});

const potentialFilter = computed(() => {
  return window.potentialFilter;
});

const dataPrivacyOptions = computed(() => {
  return window.dataPrivacyFilter;
});

const functionsFilter = computed(() => {
  return window.functionsFilter;
});

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watchEffect(() => {
  queryParams.value = toolFilterQueryParams.value;
});

watch([toolFunctions, applications, operatingSystems, potentials], () => {
  debouncedUpdate();
});

watch(activePotentials, () => {
  nextTick(() => {
    const activeValues = activePotentials.value.map((p) => p.value.toString());

    if (!slider.value) {
      console.log('slider inited');
      slider.value = $(potentialSlider.value).slick();
    }

    slider.value.slick('refresh');
    slider.value.slick('slickUnfilter');
    slider.value.slick('slickFilter', (s) => {
      return activeValues.includes(potentialSlides.value[s].dataset.ref);
    });
  });
});

updateContents();
</script>

<style scoped></style>
