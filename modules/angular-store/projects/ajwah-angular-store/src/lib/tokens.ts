import { InjectionToken } from "@angular/core";

export const ROOT_STATES = new InjectionToken("Token: ajwah/store/states");
export const FEATURE_STATES = new InjectionToken(
  "Token: ajwah/store/featureStates"
);

//export const ROOT_EFFECTS = new InjectionToken("Token: ajwah/root/effects");
// export const FEATURE_EFFECTS = new InjectionToken(
//   "Token: ajwah/root/featureEffects"
// );

export const STORE_OPTIONS = new InjectionToken("Token: ajwah/store/options");
//export const STORE_FEATURE_OPTIONS = new InjectionToken(
//  "Token: ajwah/store/feature/options"
//);

//export const EFFECT_METADATA_KEY = "ajwah/effects";
//export const STATE_METADATA_KEY = "ajwah/state";
export const IMPORT_STATE = "ajwah/ImportState";
