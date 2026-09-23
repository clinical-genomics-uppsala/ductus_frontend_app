<template>
  <div class="dropdown d-inline-block">
    <button
      class="btn btn-outline-secondary btn-sm dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      data-bs-auto-close="outside"
      aria-expanded="false"
    >
      {{ label
      }}<span v-if="modelValue.length"> ({{ modelValue.length }})</span>
    </button>
    <ul class="dropdown-menu p-2 multi-select-menu">
      <li v-if="!options.length" class="text-muted small px-2">No options</li>
      <li v-for="option in options" :key="option.value">
        <label class="dropdown-item form-check-label">
          <input
            class="form-check-input me-2"
            type="checkbox"
            :value="option.value"
            :checked="modelValue.includes(option.value)"
            @change="toggle(option.value)"
          />
          {{ option.label }}
        </label>
      </li>
      <li v-if="modelValue.length"><hr class="dropdown-divider" /></li>
      <li v-if="modelValue.length">
        <button class="btn btn-link btn-sm" type="button" @click="clear">
          Clear
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MultiSelectFilter",
  props: {
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  methods: {
    toggle(value) {
      const selected = this.modelValue.includes(value)
        ? this.modelValue.filter((item) => item !== value)
        : this.modelValue.concat([value]);
      this.$emit("update:modelValue", selected);
    },
    clear() {
      this.$emit("update:modelValue", []);
    },
  },
};
</script>

<style scoped>
.multi-select-menu {
  max-height: 20rem;
  overflow-y: auto;
}
.multi-select-menu label {
  cursor: pointer;
}
</style>
