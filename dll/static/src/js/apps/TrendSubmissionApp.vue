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
      v-model:input-value="reviewValue.feedback"
      :help-text="getHelpText('feedback')"></TextArea>
    <TextInput
      id="author"
      :readonly="true"
      label="Autor_in"
      v-model:input-value="data.author"
      :required="true"></TextInput>
    <TextInput
      id="title"
      :readonly="readonly"
      :review="review"
      v-model:review-value="reviewValue.name"
      :error="errorFields.includes('name')"
      label="Titel des Trends"
      v-model:input-value="data.name"
      :required="true"
      :character-counter="true"
      :maximal-chars="140"
      :help-text="getHelpText('name')"></TextInput>
    <div v-if="mode === 'edit' || mode === 'review'">
      <FileInput
        id="image"
        :readonly="readonly"
        :review="review"
        :required="true"
        label="Anzeigebild"
        file-label="Bild wählen"
        v-model:file-value="previewImage"
        v-model:review-value="reviewValue.previewImage"
        :error="errorFields.includes('image')"
        :image="data.image"
        :help-text="getHelpText('image')"
        :hintText="imageHintText"></FileInput>
      <TextArea
        id="teaser"
        label="Kurzzusammenfassung"
        :readonly="readonly"
        :review="review"
        :error="errorFields.includes('teaser')"
        :required="true"
        v-model:review-value="reviewValue.teaser"
        v-model:input-value="data.teaser"
        :rows="3"
        :help-text="getHelpText('teaser')"></TextArea>
      <Dropdown
        id="co_authors"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.co_authors"
        :error="errorFields.includes('co_authors')"
        label="Co-Autor_innen"
        v-model:dropdown-value="data.co_authors"
        fetch-url="/api/authors"
        :multiple="true"
        :help-text="getHelpText('co_authors')"></Dropdown>
      <PendingCoAuthors :pending-co-authors="data.pending_co_authors"></PendingCoAuthors>
      <Dropdown
        id="teaching-modules"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.teaching_modules"
        :error="errorFields.includes('teaching_modules')"
        label="Passende Unterrichtsbausteine"
        v-model:dropdown-value="data.teaching_modules"
        fetch-url="/api/unterrichtsbausteine"
        :multiple="true"
        :help-text="getHelpText('teaching_modules')"
        :prefetch="true"></Dropdown>
      <Dropdown
        id="tools"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.tools"
        :error="errorFields.includes('tools')"
        label="Passende Tools"
        v-model:dropdown-value="data.tools"
        fetch-url="/api/tools"
        :multiple="true"
        :help-text="getHelpText('tools')"
        :prefetch="true"></Dropdown>
      <Dropdown
        id="trends"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.trends"
        :error="errorFields.includes('trends')"
        label="Passende Trends"
        v-model:dropdown-value="data.trends"
        fetch-url="/api/trends"
        :multiple="true"
        :help-text="getHelpText('trends')"
        :prefetch="true"></Dropdown>
      <Dropdown
        id="competences"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.competences"
        :error="errorFields.includes('competences')"
        label="Kompetenzen in der digitalen Welt"
        :required="true"
        v-model:dropdown-value="data.competences"
        fetch-url="/api/competences"
        :multiple="true"
        :prefetch="true"
        :help-text="getHelpText('competences')"></Dropdown>

      <Select
        id="category"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.category"
        :error="errorFields.includes('category')"
        label="Kategorie"
        :options="categoryOptions"
        v-model:input-value="data.category"
        :default-val="data.category"
        :help-text="getHelpText('category')"></Select>
      <ListInput
        :min="1"
        id="target-group"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.target_group"
        :error="errorFields.includes('target_group')"
        label="Zielgruppe"
        v-model:list-value="data.target_group"
        :initial="data.target_group"
        :help-text="getHelpText('target_group')"></ListInput>
      <Select
        id="language"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.language"
        :error="errorFields.includes('language')"
        label="Sprache"
        :options="languageOptions"
        v-model:input-value="data.language"
        :default-val="data.language"
        :help-text="getHelpText('language')"></Select>
      <ListInput
        :min="1"
        id="publisher"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.publisher"
        :error="errorFields.includes('publisher')"
        label="Herausgeber_in"
        v-model:list-value="data.publisher"
        :initial="data.publisher"
        :help-text="getHelpText('publisher')"></ListInput>
      <ListInput
        :min="1"
        id="goals"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.learning_goals"
        :error="errorFields.includes('learning_goals')"
        label="Zielsetzung"
        v-model:list-value="data.learning_goals"
        :initial="data.learning_goals"
        :help-text="getHelpText('learning_goals')"></ListInput>
      <TextArea
        id="central-contents"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.central_contents"
        :error="errorFields.includes('central_contents')"
        label="Zentrale Inhalte"
        v-model:input-value="data.central_contents"
        :character-counter="true"
        :maximal-chars="1300"
        :help-text="getHelpText('central_contents')"></TextArea>
      <TextArea
        id="additional-info"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.additional_info"
        :error="errorFields.includes('additional_info')"
        label="Hintergrundinformationen"
        v-model:input-value="data.additional_info"
        :character-counter="true"
        :maximal-chars="1500"
        :rows="10"
        :help-text="getHelpText('additional_info')"></TextArea>
      <Select
        id="license"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.licence"
        :error="errorFields.includes('licence')"
        label="Lizenz"
        :options="licenseOptions"
        :default-val="data.licence"
        v-model:input-value="data.licence"
        :help-text="getHelpText('licence')"></Select>
      <TextArea
        id="citation-info"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.citation_info"
        :error="errorFields.includes('citation_info')"
        label="Zitierhinweis"
        v-model:input-value="data.citation_info"
        :character-counter="true"
        :maximal-chars="200"
        :help-text="getHelpText('citation_info')"></TextArea>

      <LinksInput
        id="websites"
        v-model:links-value="data.literatureLinks"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.literatureLinks"
        :error="errorFields.includes('literatureLinks')"
        label="Website"
        type="href"
        :help-text="getHelpText('contentlink')"></LinksInput>
      <LinksInput
        id="additionalLinks"
        v-model:links-value="data.mediaLinks"
        :readonly="readonly"
        :review="review"
        v-model:review-value="reviewValue.mediaLinks"
        :error="errorFields.includes('mediaLinks')"
        label="Weitere Links"
        type="href"
        :types="true"
        :help-text="getHelpText('contentlink')"></LinksInput>
    </div>
  </ContentSubmissionForm>
</template>

<script setup>
import { ref } from 'vue';

import ContentSubmissionForm from '../components/ContentSubmissionForm.vue';
import Dropdown from '../components/Dropdown.vue';
import FileInput from '../components/FileInput.vue';
import LinksInput from '../components/LinksInput.vue';
import ListInput from '../components/ListInput.vue';
import PendingCoAuthors from '../components/PendingCoAuthors.vue';
import Select from '../components/Select.vue';
import TextArea from '../components/TextArea.vue';
import TextInput from '../components/TextInput.vue';
import { useSubmission } from '../composables/submission';

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
} = useSubmission();

const categoryOptions = ref([
  { value: 0, label: 'Keine Angaben' },
  { value: 1, label: 'Forschung' },
  { value: 2, label: 'Portal' },
  { value: 3, label: 'Praxisbeispiel' },
  { value: 4, label: 'Veröffentlichung' },
]);

const languageOptions = ref([
  { value: 'german', label: 'Deutsch' },
  { value: 'english', label: 'Englisch' },
]);

data.value = {
  author: '',
  name: '',
  contentlink_set: [],
  teaser: '',
  image: null,
  imageRights: null,
  description: '',
  co_authors: [],
  school_types: [],
  state: '',
  estimated_time: [],
  competences: [],
  pending_co_authors: [],
  educational_plan_reference: '',
  differentiating_attribute: '',
  sub_competences: [],
  tools: [],
  trends: [],
  teaching_modules: [],
  additional_info: '',
  related_content: [],
  mediaLinks: [],
  literatureLinks: [],
  license: null,
};

resourceType.value = 'Trend';
requiredFields.value = [
  { field: 'name', title: 'Titel' },
  { field: 'teaser', title: 'Kurzzusammenfassung' },
  { field: 'image', title: 'Anzeigebild' },
  { field: 'competences', title: 'Kompetenzen in der digitalen Welt' },
];
</script>

<style scoped></style>
