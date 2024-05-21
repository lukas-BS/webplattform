<template>
  <div>
    <label for="dropzone">{{ props.label }}</label>
    <div
      v-if="!readonly"
      class="dll-dropzone"
      :class="{ active: isDragActive }"
      v-bind="getRootProps()"
    >
      <input v-bind="getInputProps()">
      <span v-if="isDragActive">Dateien hier los lassen</span>
      <span v-else>Dateien hier hinziehen oder klicken</span>
    </div>
    <div
      v-if="fileRejections.length"
      class="alert alert-danger"
    >
      <div v-for="fileRejection in fileRejections">
        <span v-text="fileRejection.file.name" />
        <ul>
          <li
            v-for="error in fileRejection.errors"
            class="text-wrap text-break"
          >
            {{ error.message }}
          </li>
        </ul>
      </div>
    </div>
    <ul class="list-unstyled">
      <li
        v-for="file in fileList"
        class="file-list__item"
      >
        <a :href="file.url">{{ file.title }}</a>
        <a
          v-if="!readonly"
          href="#"
          class="float-end"
          @click="removeFile($event, file)"
        >Löschen</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, readonly, ref, watch } from 'vue'
import { useDropzone } from 'vue3-dropzone'

import { useAxios } from '../composables/axios'

const props = defineProps({
  files: {
    default: () => [],
    type: Array,
  },
  label: {
    required: true,
    type: String,
  },
  readonly: {
    default: false,
    type: Boolean,
  },
  slug: {
    required: true,
    type: String,
  },
})

const { axios } = useAxios()
const fileList = ref(props.files)

//  --------------------------------------------------------------------------------------------------------------------
//  computed
//  --------------------------------------------------------------------------------------------------------------------
const dropzoneOptions = computed(() => {
  return {
    accept: '.pdf,.docx,.doc,.pptx,.ppt,.xls,.xlsx,.odt,.odp,.ods,.wav,.mp3,.zip,.png,.jpg,.jpeg,.gif',
    maxSize: 12000000,
    onDropAccepted: onDropAccepted,
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
  }
})

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const removeFile = (e, file) => {
  e.preventDefault()
  removeFileFromList(file)
}

const removeFileFromList = (file) => {
  axios
    .delete('/api/inhalt-bearbeiten/' + props.slug + '/file-remove/' + file.id)
    .then(() => {
      const index = fileList.value.indexOf(file)
      fileList.value.splice(index, 1)
    })
    .catch((err) => {
      console.log(err)
    })
}

const addFileToList = (file) => {
  fileList.value.push(file)
}

const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  axios
    .put('/api/inhalt-bearbeiten/' + props.slug + '/file-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      addFileToList(response.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

const onDropAccepted = (acceptedFiles) => {
  acceptedFiles.forEach((file) => {
    uploadFile(file)
  })
}

//  --------------------------------------------------------------------------------------------------------------------
//  watchers
//  --------------------------------------------------------------------------------------------------------------------
watch(
  () => props.files,
  (newFiles) => {
    fileList.value = newFiles
  },
)

//  --------------------------------------------------------------------------------------------------------------------
//  lifecycle
//  --------------------------------------------------------------------------------------------------------------------
const { fileRejections, getInputProps, getRootProps, isDragActive } = useDropzone(dropzoneOptions.value)
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
