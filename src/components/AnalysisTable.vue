<template>
  <div>
    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
      <MultiSelectFilter
        label="Status"
        :options="statusOptions"
        :model-value="filters.status"
        @update:model-value="setFilter('status', $event)"
      />
      <MultiSelectFilter
        label="Archive"
        :options="archiveStatusOptions"
        :model-value="filters.archive_status"
        @update:model-value="setFilter('archive_status', $event)"
      />
      <MultiSelectFilter
        label="Priority"
        :options="priorityOptions"
        :model-value="filters.priority"
        @update:model-value="setFilter('priority', $event)"
      />

      <input
        v-model="filters.analysis_name__icontains"
        class="form-control form-control-sm w-auto"
        type="search"
        placeholder="Search name"
        aria-label="Search analysis name"
        @change="apply(1)"
        @search="apply(1)"
      />
      <input
        v-model="filters.workpackage__icontains"
        class="form-control form-control-sm w-auto"
        type="search"
        list="analysis-workpackages"
        placeholder="Workpackage"
        aria-label="Filter by workpackage"
        @change="apply(1)"
        @search="apply(1)"
      />
      <datalist id="analysis-workpackages">
        <option v-for="value in facets.workpackage" :key="value" :value="value">
          {{ value }}
        </option>
      </datalist>
      <input
        v-model="filters.analysis__icontains"
        class="form-control form-control-sm w-auto"
        type="search"
        list="analysis-pipelines"
        placeholder="Analysis"
        aria-label="Filter by analysis"
        @change="apply(1)"
        @search="apply(1)"
      />
      <datalist id="analysis-pipelines">
        <option v-for="value in facets.analysis" :key="value" :value="value">
          {{ value }}
        </option>
      </datalist>

      <button
        v-if="hasFilters"
        class="btn btn-link btn-sm"
        type="button"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>

    <div v-if="error" class="alert alert-warning py-2">
      Could not load analyses: {{ error }}
    </div>

    <table class="table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
            scope="col"
            role="button"
            @click="sortBy(column.field)"
          >
            {{ column.label }}
            <i v-if="ordering === column.field" class="bi bi-caret-up-fill"></i>
            <i
              v-else-if="ordering === `-${column.field}`"
              class="bi bi-caret-down-fill"
            ></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="text-muted">Loading&hellip;</td>
        </tr>
        <tr v-else-if="!analysis.length">
          <td :colspan="columns.length" class="text-muted">
            No analyses match these filters.
          </td>
        </tr>
        <template v-else>
          <tr v-for="item in analysis" :key="item.analysis_name">
            <td>
              <a :href="`/analysis/${item.analysis_name}`">
                {{ item.analysis_name }}
              </a>
            </td>
            <td>{{ item.analysis }}</td>
            <td>{{ item.workpackage }}</td>
            <td>{{ priorityLabels[item.priority] || item.priority }}</td>
            <td>{{ statusLabels[item.status] || item.status }}</td>
            <td>
              {{
                archiveStatusLabels[item.archive_status] || item.archive_status
              }}
            </td>
            <td>{{ formatDate(item.created_date) }}</td>
            <td>{{ formatDate(item.last_update) }}</td>
          </tr>
        </template>
      </tbody>
    </table>

    <TablePagination
      :page="page"
      :page-size="pageSize"
      :count="count"
      @update:page="apply($event)"
      @update:page-size="setPageSize($event)"
    />
  </div>
</template>

<script>
import MultiSelectFilter from "@/components/MultiSelectFilter";
import TablePagination from "@/components/TablePagination";
import { choiceLabels, choiceList, ensureChoices } from "@/api/choices";
import {
  buildParams,
  fetchList,
  queryFromState,
  stateFromQuery,
  toggleOrdering,
} from "@/api/tables";
import axios from "axios";

const PREFIX = "a_";
const URL = "api/v1/analysis/tasks/";

// key = the query param sent to the API (arrays get __in appended),
// query = the shorter name this table uses in the browser URL.
const FILTER_SPEC = [
  { key: "status", query: "status", multi: true },
  { key: "archive_status", query: "archive", multi: true },
  { key: "priority", query: "priority", multi: true },
  { key: "analysis_name__icontains", query: "name" },
  { key: "workpackage__icontains", query: "wp" },
  { key: "analysis__icontains", query: "analysis" },
];

export default {
  name: "AnalysisTable",
  components: { MultiSelectFilter, TablePagination },
  data() {
    const state = stateFromQuery(this.$route.query, PREFIX, FILTER_SPEC);
    return {
      ...state,
      analysis: [],
      count: 0,
      loading: false,
      error: "",
      facets: { workpackage: [], analysis: [] },
      columns: [
        { field: "analysis_name", label: "Analysis Name" },
        { field: "analysis", label: "Analysis" },
        { field: "workpackage", label: "Workpackage" },
        { field: "priority", label: "Priority" },
        { field: "status", label: "Status" },
        { field: "archive_status", label: "Archive" },
        { field: "created_date", label: "Created" },
        { field: "last_update", label: "Last Update" },
      ],
    };
  },
  computed: {
    choices() {
      return this.$store.state.choices;
    },
    statusOptions() {
      return choiceList(this.choices, "analysis", "status");
    },
    archiveStatusOptions() {
      return choiceList(this.choices, "analysis", "archive_status");
    },
    priorityOptions() {
      return choiceList(this.choices, "analysis", "priority");
    },
    statusLabels() {
      return choiceLabels(this.choices, "analysis", "status");
    },
    archiveStatusLabels() {
      return choiceLabels(this.choices, "analysis", "archive_status");
    },
    priorityLabels() {
      return choiceLabels(this.choices, "analysis", "priority");
    },
    hasFilters() {
      return FILTER_SPEC.some((entry) => {
        const value = this.filters[entry.key];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      });
    },
  },
  watch: {
    // The URL is the single source of truth: every change routes through it,
    // so a filtered view can be shared and survives a refresh.
    "$route.query"() {
      Object.assign(
        this,
        stateFromQuery(this.$route.query, PREFIX, FILTER_SPEC)
      );
      this.getAnalysis();
    },
  },
  created() {
    ensureChoices(this.$store).catch((error) =>
      console.debug("Could not load choices: " + error)
    );
    this.getFacets();
    this.getAnalysis();
  },
  methods: {
    setFilter(key, value) {
      this.filters[key] = value;
      this.apply(1);
    },
    setPageSize(size) {
      this.pageSize = size;
      this.apply(1);
    },
    sortBy(field) {
      this.ordering = toggleOrdering(this.ordering, field);
      this.apply(1);
    },
    clearFilters() {
      FILTER_SPEC.forEach((entry) => {
        this.filters[entry.key] = entry.multi ? [] : "";
      });
      this.apply(1);
    },
    apply(page) {
      this.page = page;
      const query = queryFromState(
        this.$route.query,
        PREFIX,
        {
          filters: this.filters,
          page: this.page,
          pageSize: this.pageSize,
          ordering: this.ordering,
        },
        FILTER_SPEC
      );
      // replace, not push: tweaking a filter shouldn't add a back-button step.
      this.$router.replace({ query }).catch(() => {});
    },
    formatDate(value) {
      return value ? String(value).slice(0, 19).replace("T", " ") : "";
    },
    async getFacets() {
      await axios
        .get("api/v1/analysis/facets/")
        .then((response) => {
          this.facets = response.data;
        })
        .catch((error) => console.debug("Could not load facets: " + error));
    },
    async getAnalysis() {
      this.loading = true;
      this.error = "";
      const params = buildParams(this.filters, {
        page: this.page,
        pageSize: this.pageSize,
        ordering: this.ordering,
      });
      await fetchList(URL, params)
        .then(({ results, count }) => {
          this.analysis = results;
          this.count = count;
        })
        .catch((error) => {
          this.error = error.message || String(error);
          this.analysis = [];
          this.count = 0;
        });
      this.loading = false;
    },
  },
};
</script>
