<template>
  <div
    class="d-flex justify-content-between align-items-center flex-wrap gap-2"
  >
    <div class="text-muted small">
      <span v-if="count">
        {{ firstRow }}&ndash;{{ lastRow }} of {{ count }}
      </span>
      <span v-else>No matching rows</span>
    </div>

    <div class="d-flex align-items-center gap-2">
      <label class="text-muted small mb-0">Rows</label>
      <select
        class="form-select form-select-sm w-auto"
        :value="pageSize"
        @change="$emit('update:pageSize', Number($event.target.value))"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }}
        </option>
      </select>

      <nav v-if="pageCount > 1">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: page <= 1 }">
            <button
              class="page-link"
              type="button"
              :disabled="page <= 1"
              @click="$emit('update:page', page - 1)"
            >
              Previous
            </button>
          </li>
          <li
            v-for="number in pageNumbers"
            :key="number"
            class="page-item"
            :class="{ active: number === page }"
          >
            <button
              class="page-link"
              type="button"
              @click="$emit('update:page', number)"
            >
              {{ number }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: page >= pageCount }">
            <button
              class="page-link"
              type="button"
              :disabled="page >= pageCount"
              @click="$emit('update:page', page + 1)"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { PAGE_SIZE_OPTIONS } from "@/api/tables";

export default {
  name: "TablePagination",
  props: {
    page: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:page", "update:pageSize"],
  data() {
    return {
      pageSizeOptions: PAGE_SIZE_OPTIONS,
    };
  },
  computed: {
    pageCount() {
      return Math.max(1, Math.ceil(this.count / this.pageSize));
    },
    firstRow() {
      return (this.page - 1) * this.pageSize + 1;
    },
    lastRow() {
      return Math.min(this.page * this.pageSize, this.count);
    },
    // A sliding window, so a few hundred pages don't spill across the screen.
    pageNumbers() {
      const span = 2;
      const first = Math.max(1, this.page - span);
      const last = Math.min(this.pageCount, this.page + span);
      const numbers = [];
      for (let number = first; number <= last; number += 1) {
        numbers.push(number);
      }
      return numbers;
    },
  },
};
</script>
