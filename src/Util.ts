
export function formatBytes(bytes: number) {
  // http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  if (bytes === 0) return "0 B";
  let k = 1000; // or 1024 for binary
  let sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatTime(timeMs: number) {
  if (timeMs < 0.001) return (timeMs * 1000000.).toFixed(1) + "ns";
  if (timeMs < 1) return (timeMs * 1000.).toFixed(1) + "us";
  if (timeMs < 1000) return timeMs.toFixed(1) + "ms";
  if (timeMs < (1000 * 60)) return (timeMs / 1000.).toFixed(1) + "s";
  return (timeMs / (1000. * 60.)).toFixed(1) + "m";
}
