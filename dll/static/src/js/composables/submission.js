import { computed, onMounted, ref } from 'vue';

import { useAxios } from './axios';

export function useSubmission() {
  const { axios } = useAxios();

  const mode = ref('create');
  const errors = ref([]);
  const saved = ref(false);
  const data = ref({});
  const reviewValue = ref({});
  const canDelete = ref(false);
  const loading = ref(false);
  const previewImage = ref(null);
  const imageHintText = ref(
    'Mit dem Upload bestätigen Sie, dass Sie der Inhaber des vollumfänglichen Nutzungsrechts sind und Ihnen beliebige Veröffentlichungen, Bearbeitungen und Unterlizenzierungen dieses Werkes gestattet sind.',
  );
  const imageOptions = ref([
    { label: 'Ja', value: 'y' },
    { label: 'Nein', value: 'n' },
  ]);
  const requiredFields = ref([
    { field: 'name', title: 'Titel' },
    { field: 'teaser', title: 'Teaser' },
    { field: 'image', title: 'Anzeigebild' },
    { field: 'competences', title: 'Kompetenzen in der digitalen Welt' },
  ]);
  const licenseOptions = ref([
    { value: null, label: '----------' },
    { value: 0, label: 'CC0' },
    { value: 1, label: 'CC BY' },
    { value: 3, label: 'CC BY-NC' },
    { value: 4, label: 'CC BY-NC-ND' },
    { value: 5, label: 'CC BY-NC-SA' },
    { value: 6, label: 'CC BY-ND' },
    { value: 7, label: 'CC BY-SA' },
  ]);
  const errorFields = ref([]);
  const resourceType = ref(null);

  let timeoutHandler;

  const resetSavedMessageTimeout = () => {
    if (timeoutHandler) {
      clearTimeout(timeoutHandler);
    }

    timeoutHandler = setTimeout(() => {
      saved.value = false;
    }, 5000);
  };

  const updateReview = () => {
    loading.value = true;
    return axios
      .put('/api/review/' + data.value.slug + '/', {
        json_data: reviewValue.value,
      })
      .then(() => {
        saved.value = true;
        resetSavedMessageTimeout();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const approveContent = async () => {
    await updateReview();

    loading.value = true;
    axios
      .post('/api/review/' + data.value.slug + '/approve')
      .then(() => {
        document.location = '/review-inhalte';
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const declineContent = async () => {
    await updateReview();

    loading.value = true;
    axios
      .post('/api/review/' + data.value.slug + '/decline')
      .then(() => {
        document.location = '/review-inhalte';
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const submitContent = async () => {
    errorFields.value = [];
    await updateContent();
    validate();

    if (errors.value.length) {
      throw Error('Form is not valid!');
    }

    loading.value = true;
    axios
      .post('/api/inhalt-einreichen/' + data.value.slug)
      .then(() => {
        data.value.submitted = true;
      })
      .catch((error) => {
        errors.value.push(error.response.data.message);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const showDeleteWarning = () => {
    mode.value = 'delete';
  };

  const deleteContent = () => {
    loading.value = true;

    axios
      .delete('/api/inhalt-bearbeiten/' + data.value.slug)
      .then(() => {
        document.location = '/meine-inhalte';
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const getHelpText = (fieldName) => {
    if (fieldName && data.value.help_texts) {
      return data.value.help_texts[fieldName] || '.';
    }

    return null;
  };

  const createContent = () => {
    errors.value = [];
    loading.value = true;
    axios
      .post('api/inhalt-bearbeiten/', {
        ...data.value,
        resourcetype: resourceType.value,
      })
      .then((response) => {
        mode.value = 'edit';
        data.value = response.data;
        data.value.author = window.dllData.authorName;
        window.history.pushState('Content created', '', document.location.pathname + data.value.slug);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          for (let field in error.response.data) {
            for (let i = 0; i < error.response.data[field].length; i++) {
              errors.value.push(error.response.data[field][i]);
            }
          }
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateContent = () => {
    if (data.value.literatureLinks && data.value.mediaLinks) {
      data.value.contentlink_set = data.value.mediaLinks.concat(data.value.literatureLinks);
    } else if (data.value.mediaLinks) {
      data.value.contentlink_set = data.value.mediaLinks;
    } else if (data.value.literatureLinks) {
      data.value.contentlink_set = data.value.literatureLinks;
    }
    data.value.related_content = data.value.tools.concat(data.value.trends.concat(data.value.teaching_modules));
    if (data.value.data_privacy_assessment) {
      delete data.value.data_privacy_assessment.id;
    }

    loading.value = true;

    if (previewImage.value) {
      let formData = new FormData();
      formData.append('image', previewImage.value, previewImage.value.name);
      axios
        .put('/api/inhalt-bearbeiten/' + data.value.slug + '/vorschau-bild', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .catch((error) => {
          if (error.response.status === 400) {
            for (const field in error.response.data) {
              for (let i = 0; i < error.response.data[field].length; i++) {
                errors.value.push(error.response.data[field][i]);
              }
              errorFields.value.push(field);
            }
          }
        });
    }

    errors.value = [];
    errorFields.value = [];

    return axios
      .put('/api/inhalt-bearbeiten/' + data.value.slug + '/', {
        ...data.value,
        resourcetype: resourceType.value,
      })
      .then((response) => {
        saved.value = true;
        mode.value = 'edit';
        setContent(response.data);
        resetSavedMessageTimeout();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // TODO sometimes fields are wrapped - find out why to declutter this piece of code
          for (let field in error.response.data) {
            if (!Array.isArray(error.response.data[field])) {
              for (let i = 0; i < error.response.data[field].length; i++) {
                errors.value.push(error.response.data[field][i]);
                errorFields.value.push(field);
              }
            } else {
              for (let field2 in error.response.data[field]) {
                for (let i = 0; i < error.response.data[field][field2].length; i++) {
                  errors.value.push(error.response.data[field][field2][i]);
                  errorFields.value.push(field);
                }
              }
            }
          }
        }
        throw Error('Submission failed!');
      });
  };

  const validate = () => {
    errors.value = [];
    for (let i = 0; i < requiredFields.value.length; i++) {
      if (requiredFields.value[i].field === 'image' && !data.value.image) {
        if (!previewImage.value) {
          errors.value.push("Bitte füllen Sie das Pflichtfeld '" + requiredFields.value[i].title + "' aus.");
          errorFields.value.push(requiredFields.value[i].field);
        }
        continue;
      }
      if (
        !data.value[requiredFields.value[i].field] ||
        (Array.isArray(data.value[requiredFields.value[i].field]) && !data.value[requiredFields.value[i].field].length)
      ) {
        errors.value.push("Bitte füllen Sie das Pflichtfeld '" + requiredFields.value[i].title + "' aus.");
        errorFields.value.push(requiredFields.value[i].field);
      }
      if (typeof data.value[requiredFields.value[i].field] === 'object') {
        console.log(requiredFields.value[i].field);
        for (let key in data.value[requiredFields.value[i].field]) {
          if (!data.value[requiredFields.value[i].field][key]) {
            errors.value.push("Bitte füllen Sie das Pflichtfeld '" + requiredFields.value[i].title + "' komplett aus.");
            errorFields.value.push(requiredFields.value[i].field);
            break;
          }
        }
      }
    }
  };

  const goToPreview = async () => {
    await updateContent();

    document.location = data.value.preview_url;
  };

  const setContent = (content) => {
    data.value = content;
    data.value.mediaLinks = content.contentlink_set.filter((link) => link.type === 'video' || link.type === 'audio');
    data.value.literatureLinks = content.contentlink_set.filter(
      (link) => link.type === 'href' || link.type === 'literature',
    );
    data.value.author = content.author.username;
  };

  const readonly = computed(() => {
    return data.value.submitted || mode.value === 'review';
  });

  const review = computed(() => {
    return mode.value === 'review';
  });

  onMounted(() => {
    if (window.dllData) {
      mode.value = window.dllData.mode || 'create';
      canDelete.value = window.dllData.canDelete || false;

      if (mode.value === 'edit' || mode.value === 'review') {
        setContent(window.dllData.module);
        if (window.dllData.module.review) {
          reviewValue.value = window.dllData.module.review.json_data;
        }
      }

      data.value.author = window.dllData.authorName;
    }
  });

  return {
    mode,
    errors,
    saved,
    data,
    reviewValue,
    canDelete,
    loading,
    errorFields,
    previewImage,
    imageHintText,
    imageOptions,
    requiredFields,
    licenseOptions,
    resourceType,
    review,
    readonly,
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
  };
}
