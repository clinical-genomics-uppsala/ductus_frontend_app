// Status-code <-> display-name maps, mirrored from the ductus_processing_api
// backend models (processing_api/models.py). Keep these in sync with the API.

// Analysis.AnalysisStatus
export const analysisStatusName = {
  AC: "Analysis completed",
  BD: "Being downloaded",
  BU: "Being uploaded",
  DD: "Data delivered",
  FA: "Failed",
  IG: "Ignore for analysis",
  PD: "Partial demultiplexed",
  PR: "Processing",
  RD: "Ready for download",
  RE: "Reserved",
  SC: "Sequencing completed",
  UC: "Upload completed",
  WP: "Waiting: processing",
  WS: "Waiting: sequencing",
};

// Analysis.AnalysisPriority
export const priorityName = {
  "0-L": "Low",
  "1-N": "Normal",
  "2-H": "High",
  "3-S": "Super urgent",
};

// Analysis.AnalysisDemuxStatus
export const demuxStatusName = {
  DI: "Demultiplex on instrument",
  DS: "Demultiplex on server",
  IR: "Demultiplexing running on instrument",
  SR: "Demultiplexing running on server",
  CI: "Demultiplexing completed on instrument",
  CS: "Demultiplexing completed on server",
};

// Analysis.ArchiveStatus (the archive state of an analysis' raw data)
export const analysisArchiveStatusName = {
  AI: "Do not use for archiving",
  WS: "Waiting for sequence data",
  PS: "Partial sequenced data",
  WA: "Waiting for archiving",
  BA: "Being archived",
  FA: "Failed archiving",
  AD: "Archived done",
};

// SequenceRun.Status (derived archive status reported per run)
export const runArchiveStatusName = {
  AD: "Archived done",
  AI: "Do not archive",
  NA: "Not archived",
  PA: "Partially archived",
  FA: "Failed archiving",
};

// SequenceRun.BioinformaticsSamplesheet
export const assignedSamplesheetStatusName = {
  NA: "Not assigned",
  PA: "Partially assigned",
  AS: "Assigned",
  NE: "No bioinformatics samplesheet expected",
  IG: "Ignore for analysis",
};

// FastqFiles.FastFileFormat
export const fastqTypeName = {
  SP: "Spring",
  GZ: "Fastq.gz",
  FQ: "Fastq",
};

// FastqFiles.Status
export const fastqStatusName = {
  C: "Copying",
  U: "Updating",
  I: "Idle",
};
