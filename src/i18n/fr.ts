import { frCommon } from "./fr/common";
import { frHome } from "./fr/home";
import { frCareers } from "./fr/careers";
import { frProducts } from "./fr/products";
import { frPages } from "./fr/pages";
import { frLegal } from "./fr/legal";

/** English source string -> French translation. */
export const fr: Record<string, string> = {
  ...frCommon,
  ...frHome,
  ...frCareers,
  ...frProducts,
  ...frPages,
  ...frLegal,
};
