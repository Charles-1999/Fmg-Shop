export function getUrlParams(name, str) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = str.substr(1).match(reg);
  if (r != null) return  decodeURIComponent(r[2]); return null;
}
