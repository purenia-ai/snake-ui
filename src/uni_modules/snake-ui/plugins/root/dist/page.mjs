import { parseSFC, wrapPageTemplate } from "./utils.mjs";
async function transformPage(code) {
  const sfc = await parseSFC(code);
  return wrapPageTemplate(code, sfc);
}
export {
  transformPage
};
