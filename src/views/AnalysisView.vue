<template>
  <div class="container">
    <div class="dashboard">
      <p><AnalysisItem :analysis_name="analysis_name" /></p>
      <p><AnalysisSampleTable :analysis_name="analysis_name" /></p>
    </div>
  </div>
</template>

<script>
import AnalysisItem from "../components/AnalysisItem.vue";
import AnalysisSampleTable from "../components/AnalysisSampleTable.vue";

export default {
  name: "AnalysisView",
  components: {
    AnalysisItem,
    AnalysisSampleTable,
  },
  data() {
    return {
      analysis_name: this.$route.params.id,
    };
  },
};
</script>

<style scoped>
/* Your component styles go here */
</style>
