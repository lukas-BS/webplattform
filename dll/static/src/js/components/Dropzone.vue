<template>
  <div>
    <label for="dropzone">{{ props.label }}</label>
    <div class="dll-dropzone" :class="{ active: isDragActive }" v-bind="getRootProps()">
      <input v-bind="getInputProps()" />
      <p v-if="isDragActive">Dateien hier los lassen</p>
      <p v-else>Dateien hier hinziehen oder klicken</p>
    </div>
    <div class="alert alert-danger" v-if="fileErrorList.length">
      <div v-for="fileError in fileErrorList">
        <span v-text="fileError.fileName"></span>
        <ul>
          <li v-for="error in fileError.errors" class="text-wrap text-break">{{ error.message }}</li>
        </ul>
      </div>
    </div>
    <ul class="list-unstyled">
      <li v-for="file in fileList" class="file-list__item">
        <a :href="file.url">{{ file.title }}</a>
        <a href="#" @click="removeFile($event, file)" class="float-end">Löschen</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

import { useDropzone } from 'vue3-dropzone';

import { useAxios } from '../composables/axios';

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  files: {
    type: Array,
    default: () => [],
  },
});

const { axios } = useAxios();
const fileList = ref(props.files);
const fileErrorList = ref([]);

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const dropzoneOptions = computed(() => {
  return {
    onDropAccepted: onDropAccepted,
    onDropRejected: onDropRejected,
    accept: '.pdf,.docx,.doc,.pptx,.ppt,.xls,.xlsx,.odt,.odp,.ods,.wav,.mp3,.zip,.png,.jpg,.jpeg,.gif',
    maxSize: 12000000,
    // TODO: add error response in template
    // dictFallbackMessage: 'Ihr Browser ist nicht für den Dateiupload unterstützt.',
    // dictFallbackText: null,
    // dictFileTooBig: 'Die Datei ist leider zu groß. Bitte wählen Sie eine kleinere Datei.',
    // dictInvalidFileType: 'Ungültiger Dateityp.',
    // dictResponseError: 'Ungültige Antwort: {{ statusCode }}.',
    // dictCancelUpload: 'Upload abbrechen',
    // dictUploadCanceled: 'Upload abgebrochen',
    // dictCancelUploadConfirmation: 'Upload wurde abgebrochen',
    // dictRemoveFile: 'Datei entfernen',
    // dictRemoveFileConfirmation: 'Datei wurde entfernt.',
    // dictMaxFilesExceeded: 'Maximale Datei-Anzahl erreicht.',
  };
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const removeFile = (e, file) => {
  e.preventDefault();
  removeFileFromList(file);
};

const removeFileFromList = (file) => {
  axios
    .delete('/api/inhalt-bearbeiten/' + props.slug + '/file-remove/' + file.id)
    .then(() => {
      const index = fileList.value.indexOf(file);
      fileList.value.splice(index, 1);
    })
    .catch((err) => {
      console.log(err);
    });
};

const addFileToList = (file) => {
  fileList.value.push(file);
};

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  axios
    .put('/api/inhalt-bearbeiten/' + props.slug + '/file-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      addFileToList(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const onDropAccepted = (acceptedFiles) => {
  acceptedFiles.forEach((file) => {
    uploadFile(file);
  });
};

const onDropRejected = (rejectReasons) => {
  rejectReasons.forEach((reason) => {
    const newErrorObject = {
      fileName: reason.file.name,
      errors: reason.errors,
    };

    fileErrorList.value.push(newErrorObject);
  });

  setTimeout(() => {
    fileErrorList.value = [];
  }, 5000);
};

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watch(
  () => props.files,
  (newFiles) => {
    fileList.value = newFiles;
  },
);

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions.value);
</script>

<style scoped lang="scss">
.dll-dropzone {
  border: 2px solid #e5e5e5;
  font-family: Arial, sans-serif;
  letter-spacing: 0.2px;
  color: #777;
  -webkit-transition: 0.2s linear;
  transition: 0.2s linear;

  min-height: 150px;
  background: white;
  padding: 20px 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &.active {
    cursor: pointer;
    background-color: #f6f6f6;
  }
}
</style>
