<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Analysis Name</th>
          <th scope="col">Analysis</th>
          <th scope="col">Created</th>
          <th scope="col">Last Update</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in analysis" :key="index">
          <td>
            <a :href="`/analysis/${item.analysis_name}`">{{
              item.analysis_name
            }}</a>
          </td>
          <td>{{ item.analysis }}</td>
          <td>{{ item.created_date }}</td>
          <td>{{ item.last_update }}</td>
          <td scope="col">
            {{ analysisStatusName[item.status] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { analysisStatusName } from "@/constants/statuses";

export default {
  name: "AnalysisTable",
  data() {
    return {
      analysis: [],
      analysisStatusName,
    };
  },
  props: {
    analysis_status: {
      type: String,
      default: null,
    },
    limit: {
      type: Number,
      default: 5,
    },
  },
  created() {
    this.getAnalysis();
  },
  methods: {
    async getAnalysis() {
      const status =
        this.analysis_status !== null
          ? "&" + "status__in=" + this.analysis_status
          : "";
      axios
        .get("api/v1/analysis/tasks/?limit=" + this.limit + status)
        .then((response) => {
          this.analysis = response.data.results;
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.bg-sign-out {
  color: #cde0c9;
}
</style>
