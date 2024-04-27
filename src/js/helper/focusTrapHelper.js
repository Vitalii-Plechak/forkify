let currentTrap;

/**
 * Get focusable elements based on the provided element
 *
 * @param rootElement
 * @returns {HTMLElement[]}
 */
export const focusableElements = (rootElement) => {
  const selector = 'button, [href], input, select, textarea, details';
  return Array.from(rootElement.querySelectorAll(selector))
    .filter(el => el.style.display !== 'none' && !el.disabled && el.tabIndex !== -1)
}

/**
 * Set area of focus
 *
 * @param e
 */
const focusTrap = (e) => {
  const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
  if (!isTabPressed) return;
  
  const focusable = focusableElements(currentTrap)
  const firstFocusableElement = focusable[0]
  const lastFocusableElement = focusable[focusable.length - 1]
  
  e.shiftKey
    ? document.activeElement === firstFocusableElement && (lastFocusableElement.focus(), e.preventDefault())
    : document.activeElement === lastFocusableElement && (firstFocusableElement.focus(), e.preventDefault())
};

/**
 * Release focus
 *
 * @param {HTMLElement | null} rootElement
 */
export const releaseFocus = (rootElement = null) => {
  if (currentTrap && (!rootElement || rootElement === currentTrap)) {
    currentTrap.removeEventListener('keydown', focusTrap)
    currentTrap = null
  }
}

/**
 * Trap focus
 *
 * @param {HTMLElement} rootElement
 */
export const trapFocus = (rootElement) => {
  if (!rootElement) return;
  releaseFocus()
  currentTrap = rootElement
  rootElement.addEventListener('keydown', focusTrap)
  const firstElement = focusableElements(rootElement)[0]
  firstElement && firstElement.focus()
}