import { JSON_INDENT_SPACES } from "../../Data/Global_variables";

export const copyJSON = (obj) => {
  try {
    navigator.clipboard.writeText(JSON.stringify(obj, null, JSON_INDENT_SPACES));
    alert('Copied JSON to clipboard');
  } catch (err) {
    console.error('Copy failed:', err);
    alert('Copy failed');
  }
};

export const downloadJSON = (list) => {
  try {
    const blob = new Blob([JSON.stringify(list, null, JSON_INDENT_SPACES)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download failed:', err);
    alert('Download failed');
  }
};