/**
 * ADQ Motion & Transition Utilities
 * Provides semantic classes mapped to the global transition variables defined in index.css.
 * Honors `prefers-reduced-motion` at the CSS root level.
 */

export const transitions = {
  /**
   * Essential transitions for state changes (buttons, hover, focus).
   * Maps to `--transition-essential` (e.g. 150ms ease-out).
   */
  essential: "transition-all duration-[var(--transition-essential)]",
  
  /**
   * Helpful transitions for layout shifts or entering elements (dialogs, accordions, sidebars).
   * Maps to `--transition-helpful` (e.g. 250ms ease-in-out).
   */
  helpful: "transition-all duration-[var(--transition-helpful)]",
};

/**
 * Common entry/exit animation classes used with Radix primitives 
 * (typically applied to data-[state=open] and data-[state=closed]).
 */
export const animations = {
  fadeEnter: "data-[state=open]:animate-in data-[state=open]:fade-in",
  fadeExit: "data-[state=closed]:animate-out data-[state=closed]:fade-out",
  slideUpEnter: "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2",
  slideDownExit: "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-2",
  
  /** Combined basic dialog/modal transition */
  dialogOverlay: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  dialogContent: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2",
};
