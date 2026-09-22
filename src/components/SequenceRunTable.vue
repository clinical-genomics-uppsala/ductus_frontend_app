<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Machine Type</th>
          <th scope="col">Machine Id</th>
          <th scope="col">Folder Name</th>
          <th scope="col">Demultiplex</th>
          <th scope="col">Assigned Analysis</th>
          <th scope="col">Archive status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sequence_runs" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.machine_type }}</td>
          <td>{{ item.machine_id }}</td>
          <td>
            <a :href="`/sequencerun/${item.run_id}`">{{ item.run_id }}</a>
          </td>
          <td>{{ item.demultiplex }}</td>
          <td>
            {{
              assignedSamplesheetStatusName[
                item.assigned_bionformatic_samplesheet_status
              ]
            }}
          </td>
          <td>{{ runArchiveStatusName[item.archive_status] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import {
  assignedSamplesheetStatusName,
  runArchiveStatusName,
} from "@/constants/statuses";

export default {
  name: "SequenceRunTable",
  data() {
    return {
      assignedSamplesheetStatusName,
      runArchiveStatusName,
      sequence_runs: [],
    };
  },
  props: {
    archive_status: {
      type: String,
      default: null,
    },
    assigned_analysis: {
      type: String,
      default: null,
    },
    limit: {
      type: Number,
      default: 5,
    },
  },
  created() {
    this.getSequenceRuns();
  },
  methods: {
    async getSequenceRuns() {
      const a_analysis =
        this.assigned_analysis !== null
          ? "&" +
            "assigned_bionformatic_samplesheet_status__in=" +
            this.assigned_analysis
          : "";
      const status =
        this.archive_status !== null
          ? "&" + "archive_status__in=" + this.archive_status
          : "";
      axios
        .get(
          "api/v1/sequencerun/list/?limit=" + this.limit + status + a_analysis
        )
        .then((response) => {
          this.sequence_runs = response.data.results;
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
