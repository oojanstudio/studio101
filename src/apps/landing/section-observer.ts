export const LANDING_SECTION_OBSERVER_KEY = 'landing-section-observer';
export const LANDING_SECTION_STATE_KEY = 'landing-section-state';

export type VisibleFrac = number | null;
export type PartialFromTop = boolean | null;

export interface SectionDimensions {
  viewportWidth: number;
  viewportHeight: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface LandingSectionStateContext {
  getVisibleFrac: () => VisibleFrac;
  getPartialFromTop: () => PartialFromTop;
  getDimensions: () => SectionDimensions | null;
  onVisibleFracChange: (listener: (next: VisibleFrac) => void) => () => void;
  onPartialFromTopChange: (listener: (next: PartialFromTop) => void) => () => void;
  onDimensionsChange: (listener: (next: SectionDimensions | null) => void) => () => void;
}

export interface LandingSectionController {
  setVisibleFrac: (next: VisibleFrac) => void;
  setPartialFromTop: (next: PartialFromTop) => void;
  setDimensions: (next: SectionDimensions) => void;
}

export interface LandingSectionRegistration extends LandingSectionController {
  element: HTMLElement;
}

export type RegisterLandingSection = (entry: LandingSectionRegistration) => () => void;
