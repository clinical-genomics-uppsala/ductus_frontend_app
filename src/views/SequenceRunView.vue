<template>
  <div class="container">
    <div class="dashboard">
      <p><SequenceRunItem :sequencerun_id="sequencerun" /></p>
      <p><SequenceFilesTable :sequencerun_id="sequencerun" /></p>
    </div>
  </div>
</template>

<script>
import SequenceRunItem from "../components/SequenceRunItem.vue";
import SequenceFilesTable from "../components/SequenceFilesTable.vue";

export default {
  name: "SequenceRunView",
  components: {
    SequenceRunItem,
    SequenceFilesTable,
  },
  data() {
    return {
      sequencerun: this.$route.params.id,
    };
  },
};
</script>

<style scoped>
/* Your component styles go here */
</style>
