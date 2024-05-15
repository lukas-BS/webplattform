import { ref, toValue, watchEffect } from 'vue';

export function useReview(reviewValue) {
  const ownReviewValue = ref('');
  const inputValue = ref('');

  watchEffect(() => {
    ownReviewValue.value = toValue(reviewValue);
  });

  return {
    ownReviewValue,
    inputValue,
  };
}
