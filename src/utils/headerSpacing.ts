/**
 * Header Spacing Utility
 * 
 * Automatically adjusts content spacing below fixed/sticky headers to prevent overlap.
 * Uses Tailwind classes when possible, falls back to inline styles for dynamic values.
 */

interface HeaderSpacingOptions {
  headerSelector: string;
  contentSelector: string;
  additionalSpacing?: number; // Extra spacing in pixels
  useInlineStyles?: boolean; // Force inline styles instead of Tailwind classes
  onUpdate?: (height: number) => void; // Callback when spacing is updated
}

// Predefined Tailwind spacing classes for common header heights
const TAILWIND_SPACING_MAP: Record<number, string> = {
  16: 'pt-4',   // 16px
  20: 'pt-5',   // 20px
  24: 'pt-6',   // 24px
  32: 'pt-8',   // 32px
  40: 'pt-10',  // 40px
  48: 'pt-12',  // 48px
  56: 'pt-14',  // 56px
  64: 'pt-16',  // 64px
  72: 'pt-18',  // 72px
  80: 'pt-20',  // 80px
  96: 'pt-24',  // 96px
  112: 'pt-28', // 112px
  128: 'pt-32', // 128px
  144: 'pt-36', // 144px
  160: 'pt-40', // 160px
  176: 'pt-44', // 176px
  192: 'pt-48', // 192px
  208: 'pt-52', // 208px
  224: 'pt-56', // 224px
  240: 'pt-60', // 240px
  256: 'pt-64', // 256px
  288: 'pt-72', // 288px
  320: 'pt-80', // 320px
  384: 'pt-96', // 384px
};

class HeaderSpacingManager {
  private headerElement: HTMLElement | null = null;
  private contentElement: HTMLElement | null = null;
  private options: HeaderSpacingOptions;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private lastAppliedClass: string | null = null;
  private isDestroyed = false;

  constructor(options: HeaderSpacingOptions) {
    this.options = {
      additionalSpacing: 0,
      useInlineStyles: false,
      ...options
    };

    this.init();
  }

  /**
   * Initialize the header spacing manager
   */
  private init(): void {
    try {
      this.findElements();
      
      if (!this.headerElement || !this.contentElement) {
        console.warn('HeaderSpacingManager: Header or content element not found');
        return;
      }

      this.setupObservers();
      this.updateSpacing();
      
      // Handle window resize for responsive behavior
      window.addEventListener('resize', this.handleResize);
      
      // Handle scroll for sticky headers
      window.addEventListener('scroll', this.handleScroll);
      
    } catch (error) {
      console.error('HeaderSpacingManager initialization failed:', error);
    }
  }

  /**
   * Find header and content elements
   */
  private findElements(): void {
    this.headerElement = document.querySelector(this.options.headerSelector);
    this.contentElement = document.querySelector(this.options.contentSelector);
  }

  /**
   * Setup observers for dynamic changes
   */
  private setupObservers(): void {
    if (!this.headerElement || !this.contentElement) return;

    // Observe header size changes
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.isDestroyed) {
        this.updateSpacing();
      }
    });
    this.resizeObserver.observe(this.headerElement);

    // Observe header attribute/class changes that might affect positioning
    this.mutationObserver = new MutationObserver(() => {
      if (!this.isDestroyed) {
        this.updateSpacing();
      }
    });
    this.mutationObserver.observe(this.headerElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  /**
   * Calculate the effective header height
   */
  private calculateHeaderHeight(): number {
    if (!this.headerElement) return 0;

    const rect = this.headerElement.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(this.headerElement);
    const position = computedStyle.position;

    // For fixed/sticky headers, use the full height
    if (position === 'fixed' || position === 'sticky') {
      return rect.height;
    }

    // For static/relative headers, check if they're at the top of viewport
    if (rect.top <= 0 && rect.bottom > 0) {
      return rect.height;
    }

    return 0;
  }

  /**
   * Get the appropriate Tailwind class for the given height
   */
  private getTailwindClass(height: number): string | null {
    // Round to nearest 4px for better Tailwind matching
    const roundedHeight = Math.round(height / 4) * 4;
    
    // Check exact matches first
    if (TAILWIND_SPACING_MAP[roundedHeight]) {
      return TAILWIND_SPACING_MAP[roundedHeight];
    }

    // Find closest match within reasonable range
    const heights = Object.keys(TAILWIND_SPACING_MAP).map(Number).sort((a, b) => a - b);
    const closest = heights.reduce((prev, curr) => 
      Math.abs(curr - roundedHeight) < Math.abs(prev - roundedHeight) ? curr : prev
    );

    // Only use if within 8px difference
    if (Math.abs(closest - roundedHeight) <= 8) {
      return TAILWIND_SPACING_MAP[closest];
    }

    return null;
  }

  /**
   * Apply spacing using Tailwind classes
   */
  private applyTailwindSpacing(height: number): boolean {
    if (!this.contentElement || this.options.useInlineStyles) return false;

    const tailwindClass = this.getTailwindClass(height);
    if (!tailwindClass) return false;

    // Remove previous spacing class
    if (this.lastAppliedClass) {
      this.contentElement.classList.remove(this.lastAppliedClass);
    }

    // Add new spacing class
    this.contentElement.classList.add(tailwindClass);
    this.lastAppliedClass = tailwindClass;

    // Clear any inline padding-top
    this.contentElement.style.paddingTop = '';

    return true;
  }

  /**
   * Apply spacing using inline styles
   */
  private applyInlineSpacing(height: number): void {
    if (!this.contentElement) return;

    // Remove any Tailwind spacing classes
    if (this.lastAppliedClass) {
      this.contentElement.classList.remove(this.lastAppliedClass);
      this.lastAppliedClass = null;
    }

    // Apply inline style
    this.contentElement.style.paddingTop = `${height}px`;
  }

  /**
   * Update the spacing based on current header height
   */
  private updateSpacing = (): void => {
    try {
      if (!this.headerElement || !this.contentElement || this.isDestroyed) return;

      const headerHeight = this.calculateHeaderHeight();
      const totalSpacing = headerHeight + (this.options.additionalSpacing || 0);

      // Try Tailwind classes first, fall back to inline styles
      const usedTailwind = this.applyTailwindSpacing(totalSpacing);
      
      if (!usedTailwind) {
        this.applyInlineSpacing(totalSpacing);
      }

      // Call update callback if provided
      if (this.options.onUpdate) {
        this.options.onUpdate(totalSpacing);
      }

      console.debug(`HeaderSpacingManager: Applied ${totalSpacing}px spacing (${usedTailwind ? 'Tailwind' : 'inline'})`);

    } catch (error) {
      console.error('HeaderSpacingManager: Failed to update spacing:', error);
    }
  };

  /**
   * Handle window resize events
   */
  private handleResize = (): void => {
    // Debounce resize events
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateSpacing();
    }, 100);
  };
  private resizeTimeout: number = 0;

  /**
   * Handle scroll events for sticky headers
   */
  private handleScroll = (): void => {
    if (!this.headerElement) return;
    
    const computedStyle = window.getComputedStyle(this.headerElement);
    if (computedStyle.position === 'sticky') {
      // Throttle scroll events
      if (!this.scrollThrottled) {
        this.scrollThrottled = true;
        requestAnimationFrame(() => {
          this.updateSpacing();
          this.scrollThrottled = false;
        });
      }
    }
  };
  private scrollThrottled = false;

  /**
   * Manually trigger spacing update
   */
  public update(): void {
    this.updateSpacing();
  }

  /**
   * Refresh elements (useful if DOM changes)
   */
  public refresh(): void {
    this.findElements();
    this.updateSpacing();
  }

  /**
   * Destroy the manager and clean up
   */
  public destroy(): void {
    this.isDestroyed = true;

    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);

    // Disconnect observers
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    // Clear timeouts
    clearTimeout(this.resizeTimeout);

    // Remove applied spacing
    if (this.contentElement) {
      if (this.lastAppliedClass) {
        this.contentElement.classList.remove(this.lastAppliedClass);
      }
      this.contentElement.style.paddingTop = '';
    }

    // Clear references
    this.headerElement = null;
    this.contentElement = null;
  }
}

/**
 * Create and initialize a header spacing manager
 * 
 * @param options Configuration options
 * @returns HeaderSpacingManager instance
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const spacingManager = createHeaderSpacing({
 *   headerSelector: '.header',
 *   contentSelector: '.main-content'
 * });
 * 
 * // With additional options
 * const spacingManager = createHeaderSpacing({
 *   headerSelector: '#navbar',
 *   contentSelector: '.content-wrapper',
 *   additionalSpacing: 16,
 *   onUpdate: (height) => console.log(`Spacing updated: ${height}px`)
 * });
 * 
 * // Clean up when component unmounts
 * spacingManager.destroy();
 * ```
 */
export function createHeaderSpacing(options: HeaderSpacingOptions): HeaderSpacingManager {
  return new HeaderSpacingManager(options);
}

/**
 * Simple function for one-time spacing adjustment
 * 
 * @param headerSelector CSS selector for header element
 * @param contentSelector CSS selector for content element
 * @param additionalSpacing Extra spacing in pixels
 * 
 * @example
 * ```typescript
 * // One-time adjustment
 * adjustHeaderSpacing('.header', '.main-content', 16);
 * ```
 */
export function adjustHeaderSpacing(
  headerSelector: string, 
  contentSelector: string, 
  additionalSpacing: number = 0
): void {
  const manager = createHeaderSpacing({
    headerSelector,
    contentSelector,
    additionalSpacing
  });
  
  // Auto-destroy after a short delay to prevent memory leaks
  setTimeout(() => manager.destroy(), 1000);
}

/**
 * React hook for header spacing management
 * 
 * @param options Configuration options
 * @returns Object with manager instance and update function
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { manager, update } = useHeaderSpacing({
 *     headerSelector: '.header',
 *     contentSelector: '.content'
 *   });
 * 
 *   useEffect(() => {
 *     return () => manager?.destroy();
 *   }, [manager]);
 * 
 *   return <div className="content">Content here</div>;
 * }
 * ```
 */
export function useHeaderSpacing(options: HeaderSpacingOptions) {
  const [manager, setManager] = React.useState<HeaderSpacingManager | null>(null);

  React.useEffect(() => {
    const spacingManager = createHeaderSpacing(options);
    setManager(spacingManager);

    return () => {
      spacingManager.destroy();
    };
  }, [options.headerSelector, options.contentSelector]);

  const update = React.useCallback(() => {
    manager?.update();
  }, [manager]);

  const refresh = React.useCallback(() => {
    manager?.refresh();
  }, [manager]);

  return { manager, update, refresh };
}

// Export types for TypeScript users
export type { HeaderSpacingOptions };
export { HeaderSpacingManager };