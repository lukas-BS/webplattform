<template>
  <div>
    <div v-if="mode === 'overview' && invitationContents.length" class="mb-5">
      <h2>Ausstehende Co-Autor Anfragen</h2>
      <div
        v-for="(content, index) in invitationContents"
        :key="index"
        class="content-box"
        :class="'content-box--' + content.type"
      >
        <div class="row">
          <div class="col">
            <div class="content-box__type">{{ content.type_verbose }} ({{ content.status }})</div>
            <div class="content-box__title">
              {{ content.name }}
            </div>
            <div class="content-box__author"><span class="fas fa-user" /> {{ content.author }}</div>
          </div>
          <div v-if="content.co_authors.length" class="col">
            <div class="content-box__coauthors">
              <span class="fas fa-users align-top" />
              <ul class="list-unstyled d-inline-block ms-1">
                <li v-for="(author, index2) in content.co_authors" :key="index2">
                  {{ author }}
                </li>
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
        <select id="type" v-model="type" class="form-control" name="type" @change="updateContents">
          <option value="">Alle</option>
          <option value="trend">Trend</option>
          <option value="tool">Tool</option>
          <option value="teaching-module">Unterrichtsbaustein</option>
        </select>
      </div>
      <div v-if="mode === 'overview'" class="col">
        <div>
          <label for="status">Status:</label>
        </div>
        <select id="status" v-model="status" class="form-control" name="status" @change="updateContents">
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
        <input id="contentSearch" v-model="q" class="form-control" type="text" name="q" @input="debouncedUpdate" />
      </div>
    </div>

    <div v-for="(content, index) in contents" :key="index" class="content-box" :class="'content-box--' + content.type">
      <div class="row">
        <div class="col-sm-6">
          <div class="content-box__type">{{ content.type_verbose }} ({{ content.status }})</div>
          <div class="content-box__title">
            {{ content.name }}
          </div>
          <div class="content-box__author"><span class="fas fa-user" /> {{ content.author }}</div>
          <div v-if="content.submitted" class="content-box__date">
            <span>Einreichungsdatum: {{ content.submitted }}</span>
          </div>
        </div>
        <div v-if="content.co_authors.length" class="col">
          <div class="content-box__coauthors">
            <span class="fas fa-users align-top" />
            <ul class="list-unstyled d-inline-block ms-1">
              <li v-for="(author, index3) in content.co_authors" :key="index3">
                {{ author }}
              </li>
            </ul>
          </div>
        </div>
        <div v-if="mode === 'review' && content.reviewer" class="col">
          <span class="font-weight-bold">Reviewer:</span> {{ content.reviewer }} <br />
          <a v-if="content.can_unassign || content.can_assign" href="#" @click="unassign(content)"
            >Reviewer entfernen</a
          >
        </div>
        <div class="col">
          <ul class="content-box__actions">
            <li v-if="mode === 'review' && content.can_assign && !content.reviewer" class="content-box__action">
              <div style="width: 250px">
                Reviewer zuweisen:
                <Multiselect
                  v-model="content.reviewer_pk"
                  class="dll-dropdown"
                  close-on-select
                  searchable
                  :options="mappedReviewers"
                  @select="claimReview(content)"
                />
              </div>
            </li>
            <li v-if="mode === 'review' && !content.has_assigned_reviewer" class="content-box__action">
              <a v-if="content.can_claim" class="content-box__link" href="#" @click="claimReview(content)">
                Reviewer werden
              </a>
            </li>
            <li class="content-box__action">
              <a class="content-box__link content-box__link--preview" :href="content.preview_url">
                <span class="far fa-eye" />
              </a>
            </li>
            <li v-if="mode === 'overview'" class="content-box__action">
              <a class="content-box__link content-box__link--action" :href="content.edit_url">
                <span class="far fa-edit" />
              </a>
            </li>
            <li v-if="mode === 'review'" class="content-box__action">
              <a class="content-box__link content-box__link--action" :href="content.review_url">
                <span class="far fa-edit" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <AppPagination
      v-model:pagination="pagination"
      v-model:current-page="currentPage"
      @jump-to="jumpTo"
      @next-page="nextPage"
      @previous-page="previousPage"
    />
    <div v-if="contents.length === 0" class="text-center">Es stehen keine Inhalte zur Verfügung.</div>
  </div>
</template>

<script setup>
import Multiselect from '@vueform/multiselect';
import { computed, onBeforeMount, ref, watchEffect } from 'vue';

import AppPagination from '../components/AppPagination.vue';
import { useAxios } from '../composables/axios';
import { useContentFilter } from '../composables/contentFilter';
import { usePagination } from '../composables/pagination';

const { axios } = useAxios();
const { contents, currentPage, currentResponse, dataUrl, debouncedUpdate, q, queryParams, updateContents } =
  useContentFilter();
const { jumpTo, nextPage, pagination, previousPage } = usePagination(updateContents, currentResponse);

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
  return {
    status: status.value,
    type: window.dllData.type ?? type.value
  };
});

const mappedReviewers = computed(() => {
  return reviewers.value.map((reviewer) => {
    return {
      label: reviewer.username,
      value: reviewer.pk
    };
  });
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const claimReview = (content) => {
  const data = content.reviewer_pk ? { user: content.reviewer_pk } : {};

  axios
    .post(content.assign_reviewer_url, data)
    .then(() => updateContents(currentPage.value))
    .catch((err) => console.log(err));
};

const unassign = (content) =>
  axios
    .post(content.unassign_reviewer_url)
    .then(() => updateContents(currentPage.value))
    .catch((err) => console.log(err));

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

  const fetchReviewers = () =>
    axios.get('/api/reviewers').then((res) => {
      reviewers.value = res.data.results;
    });

  const fetchInvitations = () =>
    axios.get('/api/meine-einladungen').then((res) => {
      invitationContents.value = res.data.results;
    });

  if (mode.value === 'overview') {
    fetchInvitations().finally(fetchReviewers);
  } else {
    fetchReviewers();
  }
});

updateContents();
</script>

<style scoped></style>
