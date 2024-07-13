<template>
  <div>
    <div class="card card-body">
      <div class="text-start">
        <h5 class="card-title">Analysis Samples</h5>
        <table class="table">
          <thead>
            <tr>
              <th>Sample</th>
              <th>Sequence run</th>
              <th>Settings</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="sample in analysis_samples" :key="sample.id">
            <tr v-if="sample.sample_id">
              <td>
                <a
                  :href="`${api_address}/admin/processing_api/sequencesample/${sample.sample_id.id}/change/`"
                >
                  {{ sample.sample_id.sample_id }}
                </a>
              </td>
              <td>
                <a :href="`/sequencerun/${sample.sample_id.sequence_run}`">
                  {{ sample.sample_id.sequence_run }}
                </a>
              </td>
              <td>{{ sample.settings }}</td>
              <td>
                <a
                  :href="`${api_address}/admin/processing_api/analysissample/${sample.id}/change/`"
                  class="text-end"
                >
                  <i class="bi bi-pen"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AnalysisSampleTable",
  data() {
    return {
      api_address: process.env.VUE_APP_API_ADDRESS,
      analysis_samples: {
        type: Array,
      },
    };
  },
  props: {
    analysis_name: {
      type: String,
      required: true,
    },
  },
  created() {
    this.getAnalysisSamples();
  },
  methods: {
    async getAnalysisSamples() {
      await axios
        .get("api/v1/analysis/samples/?analysis_name__in=" + this.analysis_name)
        .then((response) => {
          this.analysis_samples = response.data;
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    // Code to run when the component is mounted goes here
  },
};
</script>

<style scoped>
/* Your component-specific styles go here */
</style>
