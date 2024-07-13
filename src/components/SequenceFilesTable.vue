<template>
  <div>
    <div class="card card-body">
      <div class="text-start">
        <h5 class="card-title">Sequence Samples and Files</h5>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Sample</th>
            <th>Experiment ID</th>
            <th>Use for arhiving</th>
            <th></th>
          </tr>
        </thead>
        <tbody
          v-for="sequence_file in sequence_samples"
          :key="sequence_file.id"
        >
          <tr>
            <td>{{ sequence_file.sample_id }}</td>
            <td>{{ sequence_file.experiment_id }}</td>
            <td>
              <i
                v-if="sequence_file.archive_sequence_files"
                :key="sequence_file.id"
                class="bi bi-check"
              ></i>
            </td>
            <td>
              <a
                :href="`${api_address}/admin/processing_api/sequencesample/${sequence_file.id}/change/`"
                class="text-end"
              >
                <i class="bi bi-pen"></i>
              </a>
            </td>
          </tr>
          <tr v-if="sequence_file.fastqfiles_set == 0">
            <td class="table-warning" colspan="4">No files added!</td>
          </tr>
          <tr v-else>
            <th></th>
            <th>File</th>
            <th>Archived</th>
            <th></th>
          </tr>
          <tr v-for="f_file in sequence_file.fastqfiles_set" :key="f_file.id">
            <td></td>
            <td>
              {{ f_file.file_name }}
            </td>
            <td>
              {{ f_file.archived }}
            </td>
            <td>
              <a
                :href="`${api_address}/admin/processing_api/fastqfiles/${f_file.id}/change/`"
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
</template>

<script>
import axios from "axios";

export default {
  name: "SequenceFileable",
  data() {
    return {
      api_address: process.env.VUE_APP_API_ADDRESS,
      sequence_samples: {
        type: Array,
      },
    };
  },
  props: {
    sequencerun_id: {
      type: String,
      required: true,
    },
  },
  created() {
    this.getSequenceSamples();
  },
  methods: {
    async getSequenceSamples() {
      await axios
        .get(
          "api/v1/samples/listwithfiles/?sequence_run__run_id=" +
            this.sequencerun_id
        )
        .then((response) => {
          this.sequence_samples = response.data;
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
