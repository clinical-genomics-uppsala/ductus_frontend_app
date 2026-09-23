<template>
  <div>
    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
      <MultiSelectFilter
        label="Archive"
        :options="archiveStatusOptions"
        :model-value="filters.archive_status"
        @update:model-value="setFilter('archive_status', $event)"
      />
      <MultiSelectFilter
        label="Samplesheet"
        :options="samplesheetOptions"
        :model-value="filters.assigned_bionformatic_samplesheet_status"
        @update:model-value="
          setFilter('assigned_bionformatic_samplesheet_status', $event)
        "
      />
      <MultiSelectFilter
        label="Machine"
        :options="machineTypeOptions"
        :model-value="filters.machine_type"
        @update:model-value="setFilter('machine_type', $event)"
      />

      <input
        v-model="filters.run_id__icontains"
        class="form-control form-control-sm w-auto"
        type="search"
        placeholder="Search run"
        aria-label="Search run id"
        @change="apply(1)"
        @search="apply(1)"
      />
      <div class="d-flex align-items-center gap-1">
        <label class="text-muted small mb-0">From</label>
        <input
          v-model="filters.date__gte"
          class="form-control form-control-sm w-auto"
          type="date"
          aria-label="Runs from date"
          @change="apply(1)"
        />
        <label class="text-muted small mb-0">to</label>
        <input
          v-model="filters.date__lte"
          class="form-control form-control-sm w-auto"
          type="date"
          aria-label="Runs to date"
          @change="apply(1)"
        />
      </div>

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
      Could not load sequence runs: {{ error }}
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
        <tr v-else-if="!sequence_runs.length">
          <td :colspan="columns.length" class="text-muted">
            No sequence runs match these filters.
          </td>
        </tr>
        <template v-else>
          <tr v-for="item in sequence_runs" :key="item.run_id">
            <td>{{ item.date }}</td>
            <td>
              <a :href="`/sequencerun/${item.run_id}`">{{ item.run_id }}</a>
            </td>
            <td>{{ item.machine_type }}</td>
            <td>{{ item.machine_id }}</td>
            <td>{{ item.flowcell }}</td>
            <td>
              <i v-if="item.demultiplex" class="bi bi-check"></i>
            </td>
            <td>
              {{
                samplesheetLabels[
                  item.assigned_bionformatic_samplesheet_status
                ] || item.assigned_bionformatic_samplesheet_status
              }}
            </td>
            <td>
              {{
                archiveStatusLabels[item.archive_status] || item.archive_status
              }}
            </td>
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

const PREFIX = "sr_";
const URL = "api/v1/sequencerun/list/";

// The instruments the API derives machine_type from (settings.INSTRUMENT_TYPE_REGEX).
// A run whose instrument id matched no pattern is stored with an empty type.
const MACHINE_TYPES = ["NovaSeqX", "NextSeq2000", "NextSeq550", "MiSeq"];

const FILTER_SPEC = [
  { key: "archive_status", query: "archive", multi: true },
  {
    key: "assigned_bionformatic_samplesheet_status",
    query: "samplesheet",
    multi: true,
  },
  { key: "machine_type", query: "machine", multi: true },
  { key: "run_id__icontains", query: "run" },
  { key: "date__gte", query: "from" },
  { key: "date__lte", query: "to" },
];

export default {
  name: "SequenceRunTable",
  components: { MultiSelectFilter, TablePagination },
  data() {
    const state = stateFromQuery(this.$route.query, PREFIX, FILTER_SPEC);
    return {
      ...state,
      sequence_runs: [],
      count: 0,
      loading: false,
      error: "",
      machineTypeOptions: MACHINE_TYPES.map((type) => ({
        value: type,
        label: type,
      })),
      columns: [
        { field: "date", label: "Date" },
        { field: "run_id", label: "Folder Name" },
        { field: "machine_type", label: "Machine Type" },
        { field: "machine_id", label: "Machine Id" },
        { field: "flowcell", label: "Flowcell" },
        { field: "demultiplex", label: "Demultiplex" },
        {
          field: "assigned_bionformatic_samplesheet_status",
          label: "Assigned Analysis",
        },
        { field: "archive_status", label: "Archive status" },
      ],
    };
  },
  computed: {
    choices() {
      return this.$store.state.choices;
    },
    archiveStatusOptions() {
      return choiceList(this.choices, "sequence_run", "archive_status");
    },
    samplesheetOptions() {
      return choiceList(
        this.choices,
        "sequence_run",
        "assigned_bionformatic_samplesheet_status"
      );
    },
    archiveStatusLabels() {
      return choiceLabels(this.choices, "sequence_run", "archive_status");
    },
    samplesheetLabels() {
      return choiceLabels(
        this.choices,
        "sequence_run",
        "assigned_bionformatic_samplesheet_status"
      );
    },
    hasFilters() {
      return FILTER_SPEC.some((entry) => {
        const value = this.filters[entry.key];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      });
    },
  },
  watch: {
    "$route.query"() {
      Object.assign(
        this,
        stateFromQuery(this.$route.query, PREFIX, FILTER_SPEC)
      );
      this.getSequenceRuns();
    },
  },
  created() {
    ensureChoices(this.$store).catch((error) =>
      console.debug("Could not load choices: " + error)
    );
    this.getSequenceRuns();
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
      this.$router.replace({ query }).catch(() => {});
    },
    async getSequenceRuns() {
      this.loading = true;
      this.error = "";
      const params = buildParams(this.filters, {
        page: this.page,
        pageSize: this.pageSize,
        ordering: this.ordering,
      });
      await fetchList(URL, params)
        .then(({ results, count }) => {
          this.sequence_runs = results;
          this.count = count;
        })
        .catch((error) => {
          this.error = error.message || String(error);
          this.sequence_runs = [];
          this.count = 0;
        });
      this.loading = false;
    },
  },
};
</script>
