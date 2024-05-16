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
      :help-text="getHelpText('feedback')"
      v-model:review-value="reviewValue.feedback" />
    <TextInput id="author" label="Autor_in" readonly required v-model:input-value="data.author" />
    <TextInput
      id="title"
      label="Titel des Tools"
      required
      character-counter
      :readonly="readonly"
      :review="review"
      :error="errorFields.includes('name')"
      :maximal-chars="140"
      :help-text="getHelpText('name')"
      v-model:input-value="data.name"
      v-model:review-value="reviewValue.name" />
    <div v-if="mode === 'edit' || mode === 'review'">
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
        v-model:review-value="reviewValue.previewImage" />
      <TextArea
        id="teaser"
        label="Kurzzusammenfassung"
        required
        :readonly="readonly"
        :review="review"
        :error="errorFields.includes('teaser')"
        :rows="3"
        :help-text="getHelpText('teaser')"
        v-model:input-value="data.teaser"
        v-model:review-value="reviewValue.teaser" />
      <Dropdown
        id="co_authors"
        label="Co-Autor_innen"
        fetch-url="/api/authors"
        multiple
        :readonly="readonly"
        :review="review"
        :error="errorFields.includes('co_authors')"
        :help-text="getHelpText('co_authors')"
        v-model:dropdown-value="data.co_authors"
        v-model:review-value="reviewValue.co_authors" />
      <PendingCoAuthors :pending-co-authors="data.pending_co_authors" />
      <Dropdown
        id="teaching-modules"
        label="Passende Unterrichtsbausteine"
        fetch-url="/api/unterrichtsbausteine"
        multiple
        prefetch
        :readonly="readonly"
        :review="review"
        :error="errorFields.includes('teaching_modules')"
        :help-text="getHelpText('teaching_modules')"
        v-model:dropdown-value="data.teaching_modules"
        v-model:review-value="reviewValue.teaching_modules" />
      <Dropdown
        id="tools"
        label="Passende Tools"
        fetch-url="/api/tools"
        multiple
        prefetch
        :readonly="readonly"
        :review="review"
        :error="errorFields.includes('tools')"
        :help-text="getHelpText('tools')"
        v-model:dropdown-value="data.tools"
        v-model:review-value="reviewValue.tools" />
      <Dropdown
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
        :prefetch="true"></Dropdown>
      <Dropdown
        v-if="!dltFeatures"
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
        :help-text="getHelpText('competences')"></Dropdown>
      <Dropdown
        v-if="!dltFeatures"
        id="tool-functions"
        :readonly="readonly"
        :review="review"
        label="Tool-Funktionen"
        :required="true"
        :value.sync="data.functions"
        :review-value.sync="reviewValue.functions"
        :error="errorFields.includes('functions')"
        fetch-url="/api/toolFunctions"
        :multiple="true"
        :prefetch="true"
        :help-text="getHelpText('functions')"></Dropdown>
      <LinksInput
        id="url"
        :readonly="readonly"
        :review="review"
        v-model:links-value="data.url"
        v-model:review-value="reviewValue.url"
        :error="errorFields.includes('url')"
        label="Website"
        :type="'null'"
        :help-text="getHelpText('url')"
        :required="true"></LinksInput>
      <ListInput
        v-if="!dltFeatures"
        :min="1"
        id="pro"
        :readonly="readonly"
        :review="review"
        label="Vorteile"
        v-model:list-value="data.pro"
        v-model:review-value="reviewValue.pro"
        :error="errorFields.includes('pro')"
        :initial="data.pro"
        :help-text="getHelpText('pro')" />
      <ListInput
        v-if="!dltFeatures"
        :min="1"
        id="contra"
        :readonly="readonly"
        :review="review"
        label="Nachteile"
        v-model:list-value="data.contra"
        v-model:review-value="reviewValue.contra"
        :error="errorFields.includes('contra')"
        :initial="data.contra"
        :help-text="getHelpText('contra')" />
      <Select
        id="data-privacy"
        :readonly="readonly"
        :review="review"
        label="Datenschutz"
        :options="dataPrivacyOptions"
        v-model:input-value="data.privacy"
        v-model:review-value="reviewValue.privacy"
        :error="errorFields.includes('privacy')"
        :default-val="data.privacy"
        :help-text="getHelpText('privacy')" />
      <TextArea
        id="usage"
        :readonly="readonly"
        :review="review"
        label="Nutzung"
        v-model:input-value="data.usage"
        v-model:review-value="reviewValue.usage"
        :error="errorFields.includes('usage')"
        :character-counter="true"
        :maximal-chars="300"
        :help-text="getHelpText('usage')"></TextArea>
      <Dropdown
        id="applications"
        :readonly="readonly"
        :review="review"
        label="Anwendung"
        v-model:dropdown-value="data.applications"
        v-model:review-value="reviewValue.applications"
        :error="errorFields.includes('applications')"
        fetch-url="/api/applications"
        :multiple="true"
        :prefetch="true"
        :help-text="getHelpText('applications')"></Dropdown>
      <LinksInput
        id="mediaLinks"
        :readonly="readonly"
        :review="review"
        v-model:links-value="data.mediaLinks"
        v-model:review-value="reviewValue.mediaLinks"
        :error="errorFields.includes('mediaLinks')"
        label="Links zu Audio- und Videomedien"
        :type="'video'"
        :help-text="getHelpText('contentlink')"
        :types="true" />
      <LinksInput
        id="literatureLinks"
        :readonly="readonly"
        :review="review"
        v-model:links-value="data.literatureLinks"
        v-model:review-value="reviewValue.literatureLinks"
        :error="errorFields.includes('literatureLinks')"
        label="Text-Anleitung"
        :help-text="getHelpText('contentlink')"
        :types="true" />
      <Select
        id="requires_registration"
        :readonly="readonly"
        :review="review"
        label="Registrierung erforderlich"
        :options="registrationOptions"
        v-model:input-value="data.requires_registration"
        v-model:review-value="reviewValue.requires_registration"
        :error="errorFields.includes('requires_registration')"
        :default-val="data.requires_registration"
        :help-text="getHelpText('requires_registration')"></Select>
      <Select
        id="usk"
        :readonly="readonly"
        :review="review"
        label="Altersfreigabe"
        :options="uskOptions"
        v-model:input-value="data.usk"
        v-model:review-value="reviewValue.usk"
        :error="errorFields.includes('usk')"
        :default-val="data.usk"
        :help-text="getHelpText('usk')"></Select>
      <Select
        id="status"
        :readonly="readonly"
        :review="review"
        label="Status"
        :options="statusOptions"
        v-model:input-value="data.status"
        v-model:review-value="reviewValue.status"
        :error="errorFields.includes('status')"
        :default-val="data.status"
        :help-text="getHelpText('status')"></Select>
      <TextArea
        id="additional-info"
        :readonly="readonly"
        :review="review"
        label="Anmerkungen"
        v-model:input-value="data.additional_info"
        v-model:review-value="reviewValue.additional_info"
        :error="errorFields.includes('additional_info')"
        :character-counter="true"
        :maximal-chars="700"
        :rows="10"
        :help-text="getHelpText('additional_info')"></TextArea>
      <TextArea
        id="description"
        :readonly="readonly"
        :review="review"
        label="Detaillierte Beschreibung"
        :value.sync="data.description"
        :review-value.sync="reviewValue.description"
        :error="errorFields.includes('description')"
        :character-counter="true"
        :maximal-chars="500"
        :rows="10"
        :help-text="getHelpText('description')"></TextArea>
      <Dropdown
        id="operating_systems"
        :readonly="readonly"
        :review="review"
        label="Betriebssystem"
        v-model:dropdown-value="data.operating_systems"
        v-model:review-value="reviewValue.operating_systems"
        :error="errorFields.includes('operating_systems')"
        fetch-url="/api/operatingSystems"
        :multiple="true"
        :prefetch="true"
        :help-text="getHelpText('operating_systems')"></Dropdown>
      <Dropdown
        id="subject"
        :readonly="readonly"
        :review="review"
        :required="true"
        label="Unterrichtsfach"
        v-model:dropdown-value="data.subjects"
        v-model:review-value="reviewValue.subjects"
        :error="errorFields.includes('subjects')"
        fetch-url="/api/subjects"
        :multiple="true"
        :prefetch="true"
        :help-text="getHelpText('subjects')"></Dropdown>
      <Select
        id="with_costs"
        :readonly="readonly"
        :review="review"
        label="Kostenpflichtig"
        :options="with_costsOptions"
        v-model:input-value="data.with_costs"
        v-model:review-value="reviewValue.with_costs"
        :error="errorFields.includes('with_costs')"
        :default-val="data.with_costs"
        :help-text="getHelpText('with_costs')"></Select>
      <Dropdown
        id="tool-potentials"
        :readonly="readonly"
        :review="review"
        label="Potential Kategorien"
        :required="true"
        v-model:dropdown-value="data.potentials"
        v-model:review-value="reviewValue.potentials"
        :error="errorFields.includes('potentials')"
        fetch-url="/api/potentials"
        :multiple="true"
        :prefetch="true"
        :help-text="getHelpText('potentials')"
        v-if="dltFeatures"></Dropdown>
      <TextArea
        id="disclaimer"
        :readonly="readonly"
        :review="review"
        label="Disclaimer"
        v-model:input-value="data.disclaimer"
        v-model:review-value="reviewValue.disclaimer"
        :error="errorFields.includes('disclaimer')"
        :rows="3"
        :help-text="getHelpText('disclaimer')"
        v-if="dltFeatures"></TextArea>
      <LinksInput
        id="video_tutorials"
        :readonly="readonly"
        :review="review"
        v-model:links-value="data.video_tutorials"
        v-model:review-value="reviewValue.video_tutorials"
        :error="errorFields.includes('video_tutorials')"
        label="Video Anleitungen"
        :type="'video'"
        :help-text="getHelpText('video_tutorials')"
        :types="false"></LinksInput>
      <DataProtectionInput
        id="server_location"
        label="Serverstandort"
        :readonly="readonly"
        :review="review"
        v-model:compliance-text="data.data_privacy_assessment.server_location_text"
        v-model:compliance="data.data_privacy_assessment.server_location"
        v-model:review-value="reviewValue.server_location"
        :error="errorFields.includes('server_location')"
        :help-text="getHelpText('server_location')"
        icon="serverstandort"
        v-if="dltFeatures" />
      <DataProtectionInput
        id="provider"
        label="Anbieter"
        :readonly="readonly"
        :review="review"
        v-model:compliance-text="data.data_privacy_assessment.provider_text"
        v-model:compliance="data.data_privacy_assessment.provider"
        v-model:review-value="reviewValue.provider"
        :error="errorFields.includes('provider')"
        :help-text="getHelpText('provider')"
        icon="anbieter"
        v-if="dltFeatures"></DataProtectionInput>
      <DataProtectionInput
        id="user_registration"
        label="Benutzeranmeldung"
        :readonly="readonly"
        :review="review"
        v-model:compliance-text="data.data_privacy_assessment.user_registration_text"
        v-model:compliance="data.data_privacy_assessment.user_registration"
        v-model:review-value="reviewValue.user_registration"
        :error="errorFields.includes('user_registration')"
        :help-text="getHelpText('user_registration')"
        icon="benutzeranmeldung"
        v-if="dltFeatures"></DataProtectionInput>
      <DataProtectionInput
        id="data_privacy_terms"
        label="Datenschutzerklärung"
        :readonly="readonly"
        :review="review"
        v-model:compliance-text="data.data_privacy_assessment.data_privacy_terms_text"
        v-model:compliance="data.data_privacy_assessment.data_privacy_terms"
        v-model:review-value="reviewValue.data_privacy_terms"
        :error="errorFields.includes('data_privacy_terms')"
        :help-text="getHelpText('data_privacy_terms')"
        icon="datenschutzerklarung"
        v-if="dltFeatures"></DataProtectionInput>
      <DataProtectionInput
        id="terms_and_conditions"
        label="AGB"
        :readonly="readonly"
        :review="review"
        v-model:compliance-text="data.data_privacy_assessment.terms_and_conditions_text"
        v-model:compliance="data.data_privacy_assessment.terms_and_conditions"
        v-model:review-value="reviewValue.terms_and_conditions"
        :error="errorFields.includes('terms_and_conditions')"
        :help-text="getHelpText('terms_and_conditions')"
        icon="agb"
        v-if="dltFeatures"></DataProtectionInput>
      <DataProtectionInput
        id="security"
        label="Sicherheit"
        :readonly="readonly"
        :review="review"
        v-model:compliance-text="data.data_privacy_assessment.security_text"
        v-model:compliance="data.data_privacy_assessment.security"
        v-model:review-value="reviewValue.security"
        :error="errorFields.includes('security')"
        :help-text="getHelpText('security')"
        icon="sicherheit"
        v-if="dltFeatures"></DataProtectionInput>
      <TextArea
        id="conclusion"
        :readonly="readonly"
        :review="review"
        label="Fazit"
        :required="false"
        v-model:input-value="data.data_privacy_assessment.conclusion"
        v-model:review-value="reviewValue.conclusion"
        :error="errorFields.includes('conclusion')"
        :rows="3"
        :help-text="getHelpText('conclusion')"
        :character-counter="true"
        :maximal-chars="700"
        v-if="dltFeatures"></TextArea>
    </div>
  </ContentSubmissionForm>
</template>

<script setup>
import { ref } from 'vue';

import ContentSubmissionForm from '../components/ContentSubmissionForm.vue';
import DataProtectionInput from '../components/DataProtectionInput.vue';
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
  functions: [],
  educational_plan_reference: '',
  differentiating_attribute: '',
  sub_competences: [],
  subjects: [],
  tools: [],
  trends: [],
  teaching_modules: [],
  additional_info: '',
  related_content: [],
  mediaLinks: [],
  video_tutorials: [],
  literatureLinks: [],
  license: null,
  with_costs: false,
  potentials: [],
  disclaimer: '',
  data_privacy_assessment: {},
};
resourceType.value = 'Tool';
requiredFields.value = [
  { field: 'name', title: 'Titel' },
  { field: 'teaser', title: 'Kurzzusammenfassung' },
  { field: 'image', title: 'Anzeigebild' },
  // {field: 'competences', title: 'Kompetenzen in der digitalen Welt'},
  { field: 'url', title: 'Website' },
];

const dltFeatures = window.dltFeatures;

const dataPrivacyOptions = [
  { value: 0, label: 'Unbekannt' },
  { value: 1, label: 'Es werden keinerlei Daten erhoben' },
  {
    value: 2,
    label:
      'Personenbezogene Daten wie z.B. Logins werden geschützt auf dem Server abgelegt. Es greift die EU-Datenschutz-Grundverordnung.',
  },
  {
    value: 3,
    label:
      'Personenbezogene Daten werden erhoben. Dritte haben Zugriff auf diese Daten. Es greift die EU-Datenschutz-Grundverordnung.',
  },
  {
    value: 4,
    label: 'Personenbezogene Daten werden erhoben. Es greift NICHT die EU-Datenschutz-Grundverordnung.',
  },
];

const registrationOptions = [
  { label: 'Ja', value: true },
  { label: 'Nein', value: false },
];

const uskOptions = [
  { value: 'usk0', label: 'Ohne Altersbeschränkung' },
  { value: 'usk6', label: 'Ab 6 Jahren' },
  { value: 'usk12', label: 'Ab 12 Jahren' },
  { value: 'usk16', label: 'Ab 16 Jahren' },
  { value: 'usk18', label: 'Ab 18 Jahren' },
];
const statusOptions = [
  { value: 'on', label: 'Online' },
  { value: 'off', label: 'Offline' },
  { value: 'onoff', label: 'Online & Offline' },
];
const with_costsOptions = [
  { value: true, label: 'Ja' },
  { value: false, label: 'Nein' },
];
</script>

<style scoped></style>
