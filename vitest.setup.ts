import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

// jsdom lacks these browser APIs that our components / Framer Motion / sonner rely on.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class IO {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
// @ts-expect-error minimal polyfill for Framer Motion's whileInView
window.IntersectionObserver = IO;
// @ts-expect-error minimal polyfill for Framer Motion's whileInView
global.IntersectionObserver = IO;

window.scrollTo = vi.fn();

// next/image → plain img so component tests don't need the Next image loader.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const rest = { ...props };
    delete rest.fill;
    delete rest.priority;
    delete rest.sizes;
    return createElement("img", rest);
  },
}));
