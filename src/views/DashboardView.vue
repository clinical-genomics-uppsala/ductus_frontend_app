<template>
  <div class="container">
    <div class="dashboard">
      <h1>Processing data</h1>
      <div class="row g-4 mb-4">
        <div class="col-sm-6 col-xl-3">
          <div class="card">
            <div class="card-header d-card">Archived</div>
            <div class="card-body d-card">{{ archived_count }}</div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-3">
          <div class="card">
            <div class="card-header d-card">No archived</div>
            <div class="card-body d-card">{{ not_archived_count }}</div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-3">
          <div class="card">
            <div class="card-header d-card">Archiving failed</div>
            <div class="card-body d-card">{{ failed_archive_count }}</div>
          </div>
        </div>

        <div class="col-sm-6 col-xl-3">
          <div class="card">
            <div class="card-header d-card">Being archived</div>
            <div class="card-body d-card">{{ archiving_count }}</div>
          </div>
        </div>
      </div>
      <div class="row g-3 mb-3">
        <div class="col-sm-6 col-xl-4">
          <h1>Sequence runs</h1>
          <div v-for="s in sequence_runs" :key="s">
            <p>{{ s }}</p>
          </div>
        </div>
        <div class="col-sm-6 col-xl-4">
          <h1>Analysis</h1>
          <div v-for="(a, i) in analysis" :key="i">
            <p>{{ a }}</p>
          </div>
        </div>
        <div class="col-sm-6 col-xl-4">
          <h1>Archive</h1>
          <div v-for="a in archive" :key="a">
            <p>{{ a }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashboardView",
  data() {
    return {
      sequence_runs: ["20214_VNFNV", "20314_VNFNV"],
      analysis: [(1, "20240103_MS"), (2, "20240203_YS"), (2, "20240104_MP")],
      archive: ["20214_VNFNV"],
      archived_count: 0,
      archiving_count: 0,
      failed_archive_count: 0,
      not_archived_count: 0,
    };
  },
  created() {
    this.getStatistics();
    //console.log(this.sequence_runs);
  },
  methods: {
    getStatistics() {
      const token = this.$store.state.token;
      axios.defaults.headers.common["Authorization"] = "Token " + token;

      axios
        .get("api/v1/statistics/dashboard/")
        .then((response) => {
          console.log(response.data);
          //this.sequence_runs = response.data.sequence_runs;
          //this.analysis = response.data.analysis;
          //this.archive = response.data.archive;
          this.archived_count = response.data.archive_count.archived;
          this.archiving_count = response.data.archive_count.archiving;
          this.failed_archive_count = response.data.archive_count.failed;
          this.not_archived_count = response.data.archive_count.not_archived;
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped>
.d-card {
  color: #d0d6d6;
  background-color: #386994;
  border-color: #386994;
  font-size: larger;
  font-weight: bold;
}
</style>
