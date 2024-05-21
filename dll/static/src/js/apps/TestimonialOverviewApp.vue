<template>
  <div>
    <div class="row mb-4 text-center">
      <div class="col">
        <div>
          <label for="status">Status:</label>
        </div>
        <select name="status" id="status" v-model="status" @change="updateReviews">
          <option value="">Alle</option>
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
        <input type="text" name="q" v-model="searchTerm" id="contentSearch" @input="debouncedUpdate" />
      </div>
    </div>

    <div class="content-box" :class="'content-box--' + review.type" v-for="review in reviews">
      <div class="row">
        <div class="col-sm-3">
          <div class="content-box__type">{{ review.type_verbose }} ({{ review.status_display }})</div>
          <div class="content-box__title">{{ review.name }}</div>
          <div class="content-box__author"><span class="fas fa-user"></span> {{ review.author }}</div>
          <div class="content-box__date" v-if="review.submitted">
            <span>Einreichungsdatum: {{ review.submitted }}</span>
          </div>
        </div>
        <div class="col">
          <p class="font-weight-bold">Erfahrungsbericht</p>
          <p>
            {{ review.testimonial_comment }}
          </p>
        </div>
        <div class="col" v-if="mode === 'reviewer' && review.status !== 4">
          <ul class="content-box__actions" v-if="review.status == 0 || review.status === 1">
            <li class="content-box__action">
              <a class="content-box__link content-box__link--action" @click="accept(review)">
                <span class="far fa-thumbs-up"></span>
              </a>
            </li>
            <li class="content-box__action">
              <a class="content-box__link content-box__link--action" @click="decline(review)">
                <span class="far fa-thumbs-down"></span>
              </a>
            </li>
            <li class="content-box__action">
              <a class="content-box__link content-box__link--action" @click="changeComment(review)">
                <span class="far fa-edit"></span>
              </a>
            </li>
          </ul>
        </div>
        <div class="col" v-else-if="review.status === 4">
          <p class="font-weight-bold">Review Kommentar</p>
          <p>{{ review.comment }}</p>
        </div>
      </div>
      <div class="row mt-3" v-if="mode === 'user' && review.status === 4">
        <div class="col">
          <textarea class="form-control" v-model="review.testimonial_comment"></textarea>
        </div>
        <div class="col-12 mt-2">
          <button class="btn btn-primary" @click="submitChange(review)">Änderungen einreichen</button>
        </div>
      </div>
      <div class="row mt-3" v-if="(review.status === 0 || review.status === 1) && review.change && mode === 'reviewer'">
        <div class="col-12">
          <textarea name="review-comment" class="form-control" v-model="review.comment"></textarea>
          <div class="alert alert-danger mt-2" v-if="review.commentError" v-text="review.commentError"></div>
        </div>
        <div class="col-12 mt-2">
          <button class="btn btn-primary" @click="requestChange(review)">Änderungen anfragen</button>
        </div>
      </div>
    </div>
    <Pagination
      v-model:pagination="pagination"
      v-model:current-page="currentPage"
      @jump-to="jumpTo"
      @next-page="nextPage"
      @previous-page="previousPage" />
    <div v-if="reviews.length === 0" class="text-center">Es stehen keine Erfahrungsberichte zur Verfügung.</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import { debounce } from 'lodash';

import Pagination from '../components/Pagination.vue';
import { useAxios } from '../composables/axios';
import { usePagination } from '../composables/pagination';

const { axios } = useAxios();

const reviews = ref([]);
const type = ref(null);
const searchTerm = ref(null);
const status = ref(null);
const mode = ref('user');
const retrieveUrl = ref(null);
const updateUrl = ref(null);
// const invitationContents = ref([]);
// const reviewers = ref([]);

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const params = computed(() => {
  return {
    type: type.value,
    q: searchTerm.value,
    status: status.value,
  };
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const changeComment = (review) => {
  if (review.change === undefined) {
    review.change = true;
    // Vue.set(review, 'change', true);
  } else {
    review.change = !review.change;
    // Vue.set(review, 'change', !review.change);
  }
};

const updateReviews = (page) => {
  axios
    .get(retrieveUrl.value, { params: { ...params.value, page: Number.isInteger(page) ? page : 1 } })
    .then((res) => {
      reviews.value = res.data.results;
      updatePagination(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const sendChange = (url, body) => {
  body = body || {};
  axios
    .post(url, body)
    .then(() => {
      updateReviews();
    })
    .catch((err) => {
      console.log(err);
    });
};

const accept = (review) => {
  const url = `${retrieveUrl.value}${review.pk}/accept/`;
  sendChange(url);
};

const decline = (review) => {
  const url = `${retrieveUrl.value}${review.pk}/decline/`;
  sendChange(url);
};

const requestChange = (review) => {
  if (!review.comment) {
    review.commentError = 'Bitte gib einen Kommentar ein.';
    // Vue.set(review, 'commentError', 'Bitte gib einen Kommentar ein.');
    return;
  }

  const url = `${retrieveUrl.value}${review.pk}/request_changes/`;
  const body = {
    comment: review.comment,
  };

  sendChange(url, body);
};

const submitChange = (review) => {
  const url = `${updateUrl.value}${review.testimonial_pk}/`;
  const body = {
    comment: review.testimonial_comment,
  };

  axios.patch(url, body).then(() => {
    updateReviews();
  });
};

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
if (!window.dllData.retrieveUrl) {
  throw Error('Retrieve URL is not defined.');
}
retrieveUrl.value = window.dllData.retrieveUrl;
updateUrl.value = window.dllData.updateUrl;
mode.value = window.dllData.mode;

updateReviews();
const debouncedUpdate = debounce(updateReviews, 500);
const { pagination, jumpTo, previousPage, nextPage, updatePagination } = usePagination(updateReviews);
</script>

<style scoped></style>
