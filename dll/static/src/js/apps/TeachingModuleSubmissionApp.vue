<template>
  <ContentSubmissionForm
    :data="data"
    :errors="errors"
    :mode="mode"
    :loading="loading"
    :saved="saved"
    :can-delete="canDelete"
    @update="updateContent"
    @create="createContent"
    @preview="goToPreview"
    @delete-warning="showDeleteWarning"
    @delete="deleteContent"
    @submit="submitContent"
    @update-review="updateReview"
    @approve-review="approveContent"
    @decline-review="declineContent">
    <template #progress v-if="mode === 'edit'">
      <FormProgress class="mt-5" :steps="steps" :active="stepIndex" @set-index="setIndex" />
    </template>

    <template #buttonsTop><span></span></template>
    <template #messagesTop><span></span></template>

    <h2 class="mt-5 mb-4">{{ currentStep.long }}</h2>

    <div class="form-group" v-if="reviewValue.feedback && !review">
      <label>Feedback:</label> <br />
      {{ reviewValue.feedback }}
    </div>
    <TextArea
      v-if="review"
      id="feedback"
      label="Feedback"
      :review="false"
      :required="false"
      :rows="3"
      :help-text="getHelpText('feedback')"
      v-model:review-value="reviewValue.feedback" />

    <div v-show="stepIndex === 0">
      <TextInput id="author" label="Autor_in" required readonly v-model:input-value="data.author" />
      <TextInput
        id="title"
        label="Titel des Unterrichtbausteins"
        required
        character-counter
        :readonly="readonly"
        :review="review"
        :error="errorFields.includes('name')"
        :maximal-chars="140"
        :help-text="getHelpText('name')"
        v-model:input-value="data.name"
        v-model:review-value="reviewValue.name" />
    </div>
    <div v-if="mode === 'edit' || mode === 'review'">
      <div v-show="stepIndex === 0">
        <app-dropdown
          id="co_authors"
          :readonly="readonly"
          :review="review"
          label="Co-Autor_innen"
          :value.sync="data.co_authors"
          :review-value.sync="reviewValue.co_authors"
          :error="errorFields.includes('co_authors')"
          fetch-url="/api/authors"
          :multiple="true"
          :help-text="getHelpText('co_authors')"></app-dropdown>
        <PendingCoAuthors :pending-co-authors="data.pending_co_authors" />
        <FileInput
          id="image"
          label="Anzeigebild"
          file-label="Bild wählen"
          required
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('image')"
          :image="data.image"
          :help-text="getHelpText('image')"
          :hintText="imageHintText"
          v-model:file-value="previewImage"
          v-model:review-value="reviewValue.image" />
        <TextArea
          id="teaser"
          label="Kurzzusammenfassung"
          required
          character-counter
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('teaser')"
          :rows="3"
          :help-text="getHelpText('teaser')"
          :maximal-chars="140"
          v-model:input-value="data.teaser"
          v-model:review-value="reviewValue.teaser" />
        <TextArea
          id="description"
          label="Detaillierte Beschreibung"
          required
          character-counter
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('description')"
          :maximal-chars="1800"
          :rows="10"
          :help-text="getHelpText('description')"
          v-model:input-value="data.description"
          v-model:review-value="reviewValue.description" />
        <TextArea
          id="subject-of-tuition"
          label="Informationen zum Unterrichtsgegenstand"
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('subject_of_tuition')"
          :initial="data.subject_of_tuition"
          :help-text="getHelpText('subject_of_tuition')"
          v-model:input-value="data.subject_of_tuition"
          v-model:review-value="reviewValue.subject_of_tuition" />
        <Select
          id="license"
          label="Lizenz"
          :readonly="readonly"
          :review="review"
          :options="licenseOptions"
          :default-val="data.licence"
          :error="errorFields.includes('licence')"
          :help-text="getHelpText('licence')"
          v-model:input-value="data.licence"
          v-model:review-value="reviewValue.licence" />
      </div>
      <div v-show="stepIndex === 1">
        <app-dropdown
          id="subject"
          :readonly="readonly"
          :review="review"
          :required="true"
          label="Unterrichtsfach"
          :value.sync="data.subjects"
          :review-value.sync="reviewValue.subjects"
          :error="errorFields.includes('subjects')"
          fetch-url="/api/subjects"
          :multiple="true"
          :prefetch="true"
          :help-text="getHelpText('subjects')"></app-dropdown>
        <app-dropdown
          id="schoolType"
          :readonly="readonly"
          :review="review"
          :required="true"
          label="Schulform"
          :value.sync="data.school_types"
          :review-value.sync="reviewValue.school_types"
          :error="errorFields.includes('school_types')"
          fetch-url="/api/schoolTypes"
          :multiple="true"
          :prefetch="true"
          :help-text="getHelpText('school_types')"></app-dropdown>
        <RangeInput
          id="classes"
          label="Jahrgangsstufe"
          label-from="Von"
          label-to="Bis"
          type="number"
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('school_class')"
          :min="1"
          :max="13"
          :help-text="getHelpText('school_class')"
          v-model:range-value="data.school_class"
          v-model:review-value="reviewValue.school_class" />
        <Select
          id="state"
          label="Bundesland"
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('state')"
          :default-val="data.state"
          :options="germanStateOptions"
          :help-text="getHelpText('state')"
          v-model:input-value="data.state"
          v-model:review-value="reviewValue.state" />
        <TextInput
          id="estimatedTime"
          label="Zeitumfang der Durchführung"
          character-counter
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('estimated_time')"
          :initial="data.estimated_time"
          :help-text="getHelpText('estimated_time')"
          :maximal-chars="200"
          v-model:input-value="data.estimated_time"
          v-model:review-value="reviewValue.estimated_time" />
        <TextArea
          id="educationalPlanReference"
          label="Bildungsplanbezug"
          character-counter
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('educational_plan_reference')"
          :maximal-chars="1300"
          :help-text="getHelpText('educational_plan_reference')"
          v-model:input-value="data.educational_plan_reference"
          v-model:review-value="reviewValue.educational_plan_reference" />
      </div>
      <div v-show="stepIndex === 2">
        <ListInput
          id="goals"
          label="Ziele"
          textarea
          :min="1"
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('learning_goals')"
          :initial="data.learning_goals"
          :help-text="getHelpText('learning_goals')"
          v-model:list-value="data.learning_goals"
          v-model:review-value="reviewValue.learning_goals" />
        <ListInput
          id="expertise"
          label="Fachkompetenzen"
          :min="1"
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('expertise')"
          :initial="data.expertise"
          :help-text="getHelpText('expertise')"
          v-model:list-value="data.expertise"
          v-model:review-value="reviewValue.expertise" />
        <TextArea
          id="differentiatingAttributes"
          label="Möglichkeiten der Differenzierung/Individualisierung"
          character-counter
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('differentiating_attribute')"
          :maximal-chars="700"
          :help-text="getHelpText('differentiating_attribute')"
          v-model:input-value="data.differentiating_attribute"
          v-model:review-value="reviewValue.differentiating_attribute" />
        <app-dropdown
          id="competences"
          :readonly="readonly"
          :review="review"
          label="Kompetenzen in der digitalen Welt"
          :required="true"
          :value.sync="data.competences"
          :review-value.sync="reviewValue.competences"
          :error="errorFields.includes('competences')"
          fetch-url="/api/competences"
          :multiple="true"
          :prefetch="true"
          :help-text="getHelpText('competences')"></app-dropdown>
        <app-dropdown
          id="subCompetences"
          :readonly="readonly"
          :review="review"
          label="Detaillierte Kompetenzbeschreibungen"
          :value.sync="data.sub_competences"
          :review-value.sync="reviewValue.sub_competences"
          :error="errorFields.includes('sub_competences')"
          :disabled="!data.competences.length"
          fetch-url="/api/sub-competences"
          :prefetch="true"
          :params="{ competences: data.competences }"
          :multiple="true"
          :help-text="getHelpText('sub_competences')"></app-dropdown>
      </div>
      <div v-show="stepIndex === 3">
        <ListInput
          id="equipment"
          label="Medienausstattung"
          :min="1"
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('equipment')"
          :initial="data.equipment"
          :help-text="getHelpText('equipment')"
          v-model:list-value="data.equipment"
          v-model:review-value="reviewValue.equipment" />
        <TextArea
          id="hints"
          label="Hinweise"
          character-counter
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('additional_info')"
          :maximal-chars="1000"
          :help-text="getHelpText('additional_info')"
          v-model:input-value="data.additional_info"
          v-model:review-value="reviewValue.additional_info" />
        <LinksInput
          id="mediaLinks"
          label="Links zu Audio- und Videomedien"
          types
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('mediaLinks')"
          :type="'video'"
          :help-text="getHelpText('contentlink')"
          v-model:links-value="data.mediaLinks"
          v-model:review-value="reviewValue.mediaLinks" />

        <app-dropzone
          :slug="data.slug"
          label="Dateiupload"
          :files="data.content_files"
          :help-text="getHelpText('contentfile')"></app-dropzone>
      </div>
      <div v-show="stepIndex === 4">
        <LinksInput
          id="literatureLinks"
          label="Weiterführende Literatur und Links"
          types
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('literatureLinks')"
          :help-text="getHelpText('contentlink')"
          v-model:links-value="data.literatureLinks"
          v-model:review-value="reviewValue.literatureLinks" />
        <app-dropdown
          id="teaching-modules"
          :readonly="readonly"
          :review="review"
          label="Passende Unterrichtsbausteine"
          :value.sync="data.teaching_modules"
          :review-value.sync="reviewValue.teaching_modules"
          :error="errorFields.includes('teaching_modules')"
          fetch-url="/api/unterrichtsbausteine"
          :multiple="true"
          :help-text="getHelpText('teaching_modules')"
          :prefetch="true"></app-dropdown>
        <app-dropdown
          id="tools"
          :readonly="readonly"
          :review="review"
          label="Verwendete Tools"
          :value.sync="data.tools"
          :review-value.sync="reviewValue.tools"
          :error="errorFields.includes('tools')"
          fetch-url="/api/tools"
          :multiple="true"
          :help-text="getHelpText('tools')"
          :prefetch="true"></app-dropdown>
        <LinksInput
          id="additional_tools"
          label="Andere Tools"
          link-placeholder="Link zum Tool"
          name-placeholder="Name des Tools"
          :readonly="readonly"
          :review="review"
          :error="errorFields.includes('additional_tools')"
          :help-text="getHelpText('additional_tools')"
          v-model:links-value="data.additional_tools"
          v-model:review-value="reviewValue.additional_tools" />
        <app-dropdown
          id="trends"
          :readonly="readonly"
          :review="review"
          label="Passende Trends"
          :value.sync="data.trends"
          :review-value.sync="reviewValue.trends"
          :error="errorFields.includes('trends')"
          fetch-url="/api/trends"
          :multiple="true"
          :help-text="getHelpText('trends')"
          :prefetch="true"></app-dropdown>
      </div>
    </div>
    <template #extraButtons>
      <div class="text-right" v-if="mode === 'edit' || mode === 'review'">
        <button class="button button--primary me-3" type="button" @click="setIndex(stepIndex - 1)" v-if="stepIndex > 0">
          Vorheriger Schritt
        </button>
        <button
          class="button button--primary"
          type="button"
          @click="setIndex(stepIndex + 1)"
          v-if="stepIndex < steps.length - 1">
          Nächster Schritt
        </button>
      </div>
    </template>
  </ContentSubmissionForm>
</template>

<script setup>
import { computed, ref } from 'vue';

import ContentSubmissionForm from '../components/ContentSubmissionForm.vue';
import FileInput from '../components/FileInput.vue';
import FormProgress from '../components/FormProgress.vue';
import LinksInput from '../components/LinksInput.vue';
import ListInput from '../components/ListInput.vue';
import PendingCoAuthors from '../components/PendingCoAuthors.vue';
import RangeInput from '../components/RangeInput.vue';
import Select from '../components/Select.vue';
import TextArea from '../components/TextArea.vue';
import TextInput from '../components/TextInput.vue';
import { useAxios } from '../composables/axios';
import { useSubmission } from '../composables/submission';

const { axios } = useAxios();
const {
  data,
  requiredFields,
  resourceType,
  errors,
  mode,
  loading,
  saved,
  canDelete,
  reviewValue,
  review,
  readonly,
  errorFields,
  previewImage,
  imageHintText,
  licenseOptions,
  updateContent,
  updateReview,
  createContent,
  goToPreview,
  showDeleteWarning,
  deleteContent,
  submitContent,
  approveContent,
  declineContent,
  getHelpText,
} = useSubmission(axios);

const steps = ref([
  {
    short: 'Allgemeine Informationen',
    long: 'Allgemeine Informationen zum Unterrichtsbaustein',
  },
  {
    short: 'Informationen zum schulischen Kontext',
    long: 'Allgemeine Informationen zum schulischen Kontext des Unterrichtsbausteins',
  },
  {
    short: 'Zielsetzungen',
    long: 'Zielsetzungen des Unterrichtsbausteins',
  },
  {
    short: 'Voraussetzungen zum Einsatz',
    long: 'Voraussetzungen zum Einsatz des Unterrichtsbausteins im Unterricht',
  },
  {
    short: 'Weiterführende Informationen',
    long: 'Weiterführende Informationen zum Unterrichtsbaustein',
  },
]);
const stepIndex = ref(0);
const germanStateOptions = ref([
  { value: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen' },
  { value: 'niedersachsen', label: 'Niedersachsen' },
  { value: 'bayern', label: 'Bayern' },
  { value: 'rheinland-pfalz', label: 'Rheinland-Pfalz' },
  { value: 'hessen', label: 'Hessen' },
  { value: 'saarland', label: 'Saarland' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'brandenburg', label: 'Brandenburg' },
  { value: 'schleswig-holstein', label: 'Schleswig-Holstein' },
  { value: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern' },
  { value: 'thueringen', label: 'Thüringen' },
  { value: 'sachsen', label: 'Sachsen' },
  { value: 'sachsen-anhalt', label: 'Sachsen-Anhalt' },
  { value: 'bremen', label: 'Bremen' },
  { value: 'baden-wuerttemberg', label: 'Baden-Württemberg' },
  { value: 'hamburg', label: 'Hamburg' },
]);

data.value = {
  author: '',
  name: '',
  contentlink_set: [],
  pending_co_authors: [],
  teaser: '',
  image: null,
  imageRights: null,
  description: '',
  co_authors: [],
  school_types: [],
  state: '',
  estimated_time: '',
  competences: [],
  educational_plan_reference: '',
  differentiating_attribute: '',
  sub_competences: [],
  tools: [],
  trends: [],
  teaching_modules: [],
  additional_info: '',
  expertise: [],
  classFrom: null,
  classTo: null,
  subject_of_tuition: '',
  subjects: [],
  equipment: [],
  additional_tools: [],
  hints: '',
  related_content: [],
  mediaLinks: [],
  literatureLinks: [],
  license: null,
};
resourceType.value = 'TeachingModule';
requiredFields.value = [
  { field: 'name', title: 'Titel' },
  { field: 'teaser', title: 'Kurzzusammenfassung' },
  { field: 'image', title: 'Anzeigebild' },
  { field: 'competences', title: 'Kompetenzen in der digitalen Welt' },
  { field: 'description', title: 'Detaillierte Beschreibung' },
  { field: 'school_types', title: 'Schulform' },
  { field: 'subjects', title: 'Unterrichtsfach' },
];

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const currentStep = computed(() => {
  return steps.value[stepIndex.value];
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const setIndex = (index) => {
  if (mode.value === 'edit') {
    updateContent();
  }

  if (mode.value === 'review') {
    updateReview();
  }

  stepIndex.value = index;
  let ele = document.getElementById('submission-form');
  if (window.scrollY > ele.offsetTop) {
    window.scrollTo(0, ele.offsetTop);
  }
};
</script>

<style scoped></style>
