<template>
  <div>
    <div class="row mb-4 text-center">
      <div class="col">
        <div>
          <label for="status">Status:</label>
        </div>
        <select id="status" v-model="status" class="form-control" name="status" @change="updateContents">
          <option :value="undefined">Alle</option>
          <option value="0">Neu</option>
          <option value="4">Änderungen angefragt</option>
          <option value="2">Akzeptiert</option>
          <option value="3">Abgelehnt</option>
        </select>
      </div>
      <div class="col">
        <div>
          <label for="contentSearch">Suche:</label>
        </div>
        <input id="contentSearch" v-model="q" class="form-control" type="text" name="q" @keydown="preventEnter" />
      </div>
    </div>

    <div v-for="(review, index) in contents" :key="index" class="content-box" :class="'content-box--' + review.type">
      <div class="row">
        <div class="col-sm-3">
          <div class="content-box__type">{{ review.type_verbose }} ({{ review.status_display }})</div>
          <div class="content-box__title">
            {{ review.name }}
          </div>
          <div class="content-box__author"><span class="fas fa-user" /> {{ review.author }}</div>
          <div v-if="review.submitted" class="content-box__date">
            <span>Einreichungsdatum: {{ review.submitted }}</span>
          </div>
        </div>
        <div class="col">
          <p class="font-weight-bold">Erfahrungsbericht</p>
          <p>
            {{ review.testimonial_comment }}
          </p>
        </div>
        <div v-if="mode === 'reviewer' && review.status !== 4" class="col">
          <ul v-if="review.status == 0 || review.status === 1" class="content-box__actions">
            <li class="content-box__action">
              <a class="content-box__link content-box__link--action" @click="accept(review)">
                <span class="far fa-thumbs-up" />
              </a>
            </li>
            <li class="content-box__action">
              <a class="content-box__link content-box__link--action" @click="decline(review)">
                <span class="far fa-thumbs-down" />
              </a>
            </li>
            <li class="content-box__action">
              <a class="content-box__link content-box__link--action" @click="changeComment(review)">
                <span class="far fa-edit" />
              </a>
            </li>
          </ul>
        </div>
        <div v-else-if="review.status === 4" class="col">
          <p class="font-weight-bold">Review Kommentar</p>
          <p>{{ review.comment }}</p>
        </div>
      </div>
      <div v-if="mode === 'user' && review.status === 4" class="row mt-3">
        <div class="col">
          <textarea v-model="review.testimonial_comment" class="form-control" />
        </div>
        <div class="col-12 mt-2">
          <button class="btn btn-primary" @click="submitChange(review)">Änderungen einreichen</button>
        </div>
      </div>
      <div v-if="(review.status === 0 || review.status === 1) && review.change && mode === 'reviewer'" class="row mt-3">
        <div class="col-12">
          <textarea v-model="review.comment" name="review-comment" class="form-control" />
          <div v-if="review.commentError" class="alert alert-danger mt-2" v-text="review.commentError" />
        </div>
        <div class="col-12 mt-2">
          <button class="btn btn-primary" @click="requestChange(review)">Änderungen anfragen</button>
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
    <div v-if="reviews.length === 0" class="text-center">Es stehen keine Erfahrungsberichte zur Verfügung.</div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';

import AppPagination from '../components/AppPagination.vue';
import { useContentFilter } from '../composables/contentFilter';
import { usePagination } from '../composables/pagination';
import { usePreventEnter } from '../composables/preventEnter';

const { axios, contents, currentPage, currentResponse, dataUrl, q, queryParams, updateContents } = useContentFilter();
const { jumpTo, nextPage, pagination, previousPage } = usePagination(updateContents, currentResponse);
const { preventEnter } = usePreventEnter();

if (!window.dllData.retrieveUrl) {
  throw Error('Retrieve URL is not defined.');
}
dataUrl.value = window.dllData.retrieveUrl;

const reviews = ref([]);
const type = ref(null);
const status = ref(undefined);
const mode = ref(window.dllData.mode);
const updateUrl = ref(window.dllData.updateUrl);

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const testimonialParams = computed(() => {
  return { status: status.value, type: type.value };
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const changeComment = (review) => {
  review.change = !review.change;
};

const sendChange = (url, body = {}) => {
  axios
    .post(url, body)
    .then(() => updateContents())
    .catch((err) => console.log(err));
};

const accept = (review) => {
  const url = `${dataUrl.value}${review.pk}/accept/`;
  sendChange(url);
};

const decline = (review) => {
  const url = `${dataUrl.value}${review.pk}/decline/`;
  sendChange(url);
};

const requestChange = (review) => {
  if (!review.comment) {
    review.commentError = 'Bitte gib einen Kommentar ein.';
    return;
  }

  sendChange(`${dataUrl.value}${review.pk}/request_changes/`, { comment: review.comment });
};

const submitChange = (review) =>
  axios
    .patch(`${updateUrl.value}${review.testimonial_pk}/`, {
      comment: review.testimonial_comment
    })
    .then(updateContents);

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watchEffect(() => {
  queryParams.value = testimonialParams.value;
});

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
updateContents();
</script>

<style scoped></style>
