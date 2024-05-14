<template>
  <form class="mb-4" id="submission-form">
    <slot name="progress"></slot>
    <div class="submission-form">
      <div class="alert alert-success" v-if="props.data.submitted && props.mode !== 'review'">
        Der Inhalt wurde eingereicht und wird nun von Mitarbeiter_innen geprüft.
      </div>
      <slot name="messagesTop">
        <div class="alert alert-primary" v-if="props.saved">Ihre Änderungen wurden gespeichert.</div>
        <div class="alert alert-danger" v-if="props.errors.length">
          <ul class="list-unstyled">
            <li v-for="error in props.errors">{{ error }}</li>
          </ul>
        </div>
      </slot>
      <slot name="buttonsTop">
        <div v-if="props.mode === 'edit'">
          <button
            class="button button--primary"
            type="button"
            @click="emitUpdate()"
            :disabled="props.loading"
            v-if="!props.data.submitted">
            Speichern
          </button>
          <button class="button button--preview" type="button" :disabled="props.loading" @click="emitPreview()">
            Vorschau
          </button>
          <button
            class="button button--submit"
            type="button"
            :disabled="props.loading"
            @click="emitSubmit()"
            v-if="!props.data.submitted">
            Einreichen
          </button>
          <button
            class="button button--danger"
            type="button"
            :disabled="props.loading"
            @click="emitDeleteWarning()"
            v-if="props.canDelete">
            Löschen
          </button>
        </div>
        <div v-if="props.mode === 'review'">
          <button class="button button--primary" type="button" @click="emitUpdateReview()" :disabled="props.loading">
            Speichern
          </button>
          <button class="button button--submit" type="button" :disabled="props.loading" @click="emitApproveReview()">
            Freigeben
          </button>
          <button class="button button--danger" type="button" :disabled="props.loading" @click="emitDeclineReview()">
            Ablehnen
          </button>
        </div>
      </slot>
      <slot v-if="props.mode === 'edit' || props.mode === 'create' || props.mode === 'review'"></slot>
      <div v-if="props.mode === 'delete'">
        <h3>Wollen Sie den folgenden Inhalt wirklich löschen?</h3>
        <p>
          <b>{{ props.data.name }}</b>
        </p>

        <button type="button" class="button button--danger" @click="emitDelete()">Ja, Inhalt löschen</button>
        <button type="button" class="button button--primary" @click="props.mode = 'edit'">Nein, abbrechen.</button>
      </div>
      <div v-if="props.mode === 'review'">
        <button class="button button--primary" type="button" @click="emitUpdateReview()" :disabled="props.loading">
          Speichern
        </button>
        <button class="button button--submit" type="button" :disabled="props.loading" @click="emitApproveReview()">
          Freigeben
        </button>
        <button class="button button--danger" type="button" :disabled="props.loading" @click="emitDeclineReview()">
          Ablehnen
        </button>
      </div>
      <div class="alert alert-primary" v-if="props.saved">Ihre Änderungen wurden gespeichert.</div>
      <div class="alert alert-danger" v-if="props.errors.length">
        <ul class="list-unstyled">
          <li v-for="error in props.errors">{{ error }}</li>
        </ul>
      </div>
      <slot name="extraButtons"></slot>
      <div v-if="props.mode === 'edit'">
        <button
          class="button button--primary"
          type="button"
          @click="submit"
          :disabled="props.loading"
          v-if="!props.data.submitted">
          Speichern
        </button>
        <button class="button button--preview" type="button" :disabled="props.loading" @click="emitPreview()">
          Vorschau
        </button>
        <button
          class="button button--submit"
          type="button"
          :disabled="props.loading"
          @click="emitSubmit()"
          v-if="!props.data.submitted">
          Einreichen
        </button>
        <button
          class="button button--danger"
          type="button"
          :disabled="props.loading"
          @click="emitDeleteWarning()"
          v-if="props.canDelete">
          Löschen
        </button>
      </div>
      <button class="button button--primary" @click="emitCreate()" type="button" v-if="props.mode === 'create'">
        Speichern
      </button>
    </div>
  </form>
</template>

<script setup>
//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const props = defineProps({
  saved: {
    type: Boolean,
    required: true,
  },
  errors: {
    type: Array,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  canDelete: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const submit = () => {
  const submissionEvent = new Event('content-submission');
  window.dispatchEvent(submissionEvent);
  emitUpdate();
};

//  --------------------------------------------------------------------------------------------------------------------
//  emits
//  --------------------------------------------------------------------------------------------------------------------
const emitUpdate = () => {
  emits('update');
};

const emitPreview = () => {
  emits('preview');
};

const emitSubmit = () => {
  emits('submit');
};

const emitCreate = () => {
  emits('create');
};

const emitDeleteWarning = () => {
  emits('deleteWarning');
};

const emitApproveReview = () => {
  emits('approveReview');
};

const emitDeclineReview = () => {
  emits('declineReview');
};

const emitUpdateReview = () => {
  emits('updateReview');
};

const emitDelete = () => {
  emits('delete');
};
</script>

<style lang="scss" scoped>
.submission-form {
  max-width: 992px;
  margin-left: auto;
  margin-right: auto;
}
</style>
