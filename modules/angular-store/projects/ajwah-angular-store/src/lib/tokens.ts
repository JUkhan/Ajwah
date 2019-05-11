import { InjectionToken } from '@angular/core';

export const ROOT_STATES = new InjectionToken('Token: ajwah/store/states');

export const ROOT_EFFECTS = new InjectionToken('Token: ajwah/root/effects');

export const EFFECT_METADATA_KEY = 'ajwah/effects';
export const STATE_METADATA_KEY = 'ajwah/state';
export const IMPORT_STATE = Symbol('ImportState');

