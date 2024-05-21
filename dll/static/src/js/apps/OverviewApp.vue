<template>
  <div>
    <div class="mb-5" v-if="mode === 'overview' && invitationContents.length">
      <h2>Ausstehende Co-Autor Anfragen</h2>
      <div class="content-box" :class="'content-box--' + content.type" v-for="content in invitationContents">
        <div class="row">
          <div class="col">
            <div class="content-box__type">{{ content.type_verbose }} ({{ content.status }})</div>
            <div class="content-box__title">{{ content.name }}</div>
            <div class="content-box__author"><span class="fas fa-user"></span> {{ content.author }}</div>
          </div>
          <div class="col" v-if="content.co_authors.length">
            <div class="content-box__coauthors">
              <span class="fas fa-users align-top"></span>
              <ul class="list-unstyled d-inline-block ms-1">
                <li v-for="author in content.co_authors">{{ author }}</li>
              </ul>
            </div>
          </div>
          <div class="col">
            <ul class="content-box__actions">
              <li class="content-box__action">
                <a class="content-box__link" :href="content.invitation_url"> Einladung beantworten </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-4 text-center">
      <div class="col">
        <div>
          <label for="type">Elemente:</label>
        </div>
        <select class="form-control" name="type" id="type" v-model="type" @change="updateContents">
          <option value="">Alle</option>
          <option value="trend">Trend</option>
          <option value="tool">Tool</option>
          <option value="teaching-module">Unterrichtsbaustein</option>
        </select>
      </div>
      <div class="col" v-if="mode === 'overview'">
        <div>
          <label for="status">Status:</label>
        </div>
        <select class="form-control" name="status" id="status" v-model="status" @change="updateContents">
          <option value="">Alle</option>
          <option value="draft">Entwurf</option>
          <option value="submitted">Eingereicht</option>
          <option value="approved">Freigegeben</option>
          <option value="declined">Abgelehnt</option>
        </select>
      </div>
      <div class="col">
        <div>
          <label for="contentSearch">Suche:</label>
        </div>
        <input class="form-control" type="text" name="q" v-model="q" id="contentSearch" @input="debouncedUpdate" />
      </div>
    </div>

    <div class="content-box" :class="'content-box--' + content.type" v-for="content in contents">
      <div class="row">
        <div class="col-sm-6">
          <div class="content-box__type">{{ content.type_verbose }} ({{ content.status }})</div>
          <div class="content-box__title">{{ content.name }}</div>
          <div class="content-box__author"><span class="fas fa-user"></span> {{ content.author }}</div>
          <div class="content-box__date" v-if="content.submitted">
            <span>Einreichungsdatum: {{ content.submitted }}</span>
          </div>
        </div>
        <div class="col" v-if="content.co_authors.length">
          <div class="content-box__coauthors">
            <span class="fas fa-users align-top"></span>
            <ul class="list-unstyled d-inline-block ms-1">
              <li v-for="author in content.co_authors">{{ author }}</li>
            </ul>
          </div>
        </div>
        <div class="col" v-if="mode === 'review' && content.reviewer">
          <span class="font-weight-bold">Reviewer:</span> {{ content.reviewer }} <br />
          <a v-if="content.can_unassign || content.can_assign" href="#" @click="unassign(content)"
            >Reviewer entfernen</a
          >
        </div>
        <div class="col">
          <ul class="content-box__actions">
            <li class="content-box__action" v-if="mode === 'review' && content.can_assign && !content.reviewer">
              <div style="width: 250px">
                Reviewer zuweisen:
                <!-- TODO: VSelect -->
                <!-- <v-select
                  :options="reviewers"
                  label="username"
                  :multiple="false"
                  @input="claimReview(content)"
                  v-model="content.reviewer_pk"
                  :reduce="reduceReviewer" /> -->
              </div>
            </li>
            <li class="content-box__action" v-if="mode === 'review' && !content.has_assigned_reviewer">
              <a class="content-box__link" v-if="content.can_claim" href="#" @click="claimReview(content)">
                Reviewer werden
              </a>
            </li>
            <li class="content-box__action">
              <a class="content-box__link content-box__link--preview" :href="content.preview_url">
                <span class="far fa-eye"></span>
              </a>
            </li>
            <li class="content-box__action" v-if="mode === 'overview'">
              <a class="content-box__link content-box__link--action" :href="content.edit_url">
                <span class="far fa-edit"></span>
              </a>
            </li>
            <li class="content-box__action" v-if="mode === 'review'">
              <a class="content-box__link content-box__link--action" :href="content.review_url">
                <span class="far fa-edit"></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Pagination
      v-model:pagination="pagination"
      v-model:current-page="currentPage"
      @jump-to="jumpTo"
      @next-page="nextPage"
      @previous-page="previousPage" />
    <div v-if="contents.length === 0" class="text-center">Es stehen keine Inhalte zur Verfügung.</div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref, watchEffect } from 'vue';

import Pagination from '../components/Pagination.vue';
import { useAxios } from '../composables/axios';
import { useContentFilter } from '../composables/contentFilter';
import { usePagination } from '../composables/pagination';

const { axios } = useAxios();
const { dataUrl, queryParams, contents, q, currentPage, debouncedUpdate, updateContents } = useContentFilter(axios);
const { pagination, jumpTo, previousPage, nextPage, updatePagination } = usePagination(updateContents);

const type = ref('');
const status = ref('');
const mode = ref(window.dllData.mode || 'overview');
const invitationContents = ref([]);
const reviewers = ref([]);

dataUrl.value = window.dllData.retrieveUrl;

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const overviewQueryParams = computed(() => {
  const params = {
    type: window.dllData.type ?? type.value,
    status: status.value,
  };

  return params;
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const reduceReviewer = (option) => {
  return option.pk;
};

const claimReview = (content) => {
  let data = {};
  if (content.reviewer_pk) {
    data['user'] = content.reviewer_pk;
  }
  axios
    .post(content.assign_reviewer_url, data)
    .then(async () => {
      const response = await updateContents(currentPage.value);
      updatePagination(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const unassign = (content) => {
  axios
    .post(content.unassign_reviewer_url, {})
    .then(async () => {
      const response = await updateContents(currentPage.value);
      updatePagination(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const initAppData = async () => {
  const initContentResponse = await updateContents();
  updatePagination(initContentResponse);
};

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watchEffect(() => {
  queryParams.value = overviewQueryParams.value;
});

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
onBeforeMount(() => {
  if (!window.dllData.retrieveUrl) {
    throw Error('Retrieve URL is not defined.');
  }

  if (mode.value === 'overview') {
    axios.get('/api/meine-einladungen').then((res) => {
      invitationContents.value = res.data.results;
    });
  }

  axios.get('/api/reviewers').then((res) => {
    reviewers.value = res.data.results;
  });
});

initAppData();
</script>

<style scoped></style>
