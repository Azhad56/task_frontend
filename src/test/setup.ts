import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  // Radix Dialog locks pointer interaction on the body while a modal is open.
  // Reset the lock so each jsdom test begins with an independent document.
  document.body.style.pointerEvents = "";
});
