<template>
  <div class="d-flex justify-content-between steps">
    <div
      v-for="(step, index) in props.steps"
      :key="index"
      class="step"
      :class="{ 'step--is-active': stepIsActive(index + 1) }"
      @click="emitSetIndex(index)">
      <img :src="getStepImage(index + 1)" alt="" />
      <div class="step-text">
        {{ step.short }}
      </div>
    </div>
  </div>
</template>

<script setup>
//  --------------------------------------------------------------------------------------------------------------------
//  models + props
//  --------------------------------------------------------------------------------------------------------------------
const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  active: {
    type: Number,
    default: 0,
  },
});

//  --------------------------------------------------------------------------------------------------------------------
//  component logic
//  --------------------------------------------------------------------------------------------------------------------
const getStepImage = (index) => {
  if (stepIsActive(index)) {
    return `https://dll-production.s3-de-central.profitbricks.com/static/img/forms/step_${index}_black.svg`;
  }

  return `https://dll-production.s3-de-central.profitbricks.com/static/img/forms/step_${index}.svg`;
};

const stepIsActive = (index) => {
  return index <= props.active + 1;
};

//  --------------------------------------------------------------------------------------------------------------------
//  emits
//  --------------------------------------------------------------------------------------------------------------------
const emits = defineEmits(['setIndex']);

const emitSetIndex = (index) => {
  emits('setIndex', index);
};
</script>

<style lang="scss" scoped>
.steps {
  position: relative;
}
.step {
  flex: 1 0 auto;
  position: relative;
  text-align: center;
  z-index: 1;
  cursor: pointer;
}
.step--is-active {
  font-weight: bold;
}
.step img {
  width: 40px;
}
.step:after,
.step:before {
  position: absolute;
  display: none;
  z-index: -1;
  top: 50%;
  transform: translateY(-50%);
  content: '';
  width: 50%;
  height: 2px;
  background-color: #231f20;
}
.step:not(:last-child):after {
  display: block;
  left: 50%;
}
.step:not(:first-child):before {
  display: block;
  left: 0;
}
.step-text {
  font-size: 14px;
  width: 150px;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
  display: none;
}
@media (min-width: 992px) {
  .step-text {
    display: block;
  }
  .step:after,
  .step:before {
    margin-top: -23px;
  }
  .step img {
    width: 60px;
  }
}
</style>
