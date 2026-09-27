/**
 * Smoke tests for the three legal pages.
 *
 * A successful `vite build` only proves these files compile — it would not
 * catch a runtime error thrown while rendering them, and nothing else in the
 * suite renders a page. These tests assert the pages mount, that each one
 * states the specific fact it exists to state, and that the cross-links
 * between them point at the routes actually registered in App.tsx.
 *
 * They also pin the two claims most likely to become false later: that the
 * site sets no cookies, and that the careers assistant transmits nothing.
 * If someone adds analytics or wires the assistant to a backend, the copy
 * here has to change, and a failing test is the reminder.
 */

import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";
import { LanguageProvider } from "@/i18n/LanguageContext";

const renderPage = (ui: React.ReactElement) =>
  render(
    <LanguageProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </LanguageProvider>,
  );

/** The routes these pages link to must exist in App.tsx. */
const LEGAL_ROUTES = ["/privacy", "/terms", "/cookies"];

describe("legal pages", () => {
  it("renders the Privacy Notice with its headings", () => {
    renderPage(<Privacy />);
    expect(screen.getAllByText("Privacy Notice").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Who we are" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your rights" })).toBeInTheDocument();
  });

  it("renders the Terms of Use with its headings", () => {
    renderPage(<Terms />);
    expect(screen.getByRole("heading", { name: "Acceptable use" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Intellectual property" })).toBeInTheDocument();
  });

  it("renders the Cookie Policy and the three stored preference keys", () => {
    renderPage(<Cookies />);
    const table = screen.getByRole("table");
    for (const key of ["geat-lang", "geni-accepted", "geni-teaser-seen"]) {
      expect(within(table).getByText(key)).toBeInTheDocument();
    }
  });

  it("states that the site sets no cookies", () => {
    renderPage(<Cookies />);
    expect(
      screen.getByRole("heading", { name: "This website does not use cookies" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/sets no cookies/)).toBeInTheDocument();
  });

  it("tells visitors the careers assistant transmits nothing", () => {
    renderPage(<Terms />);
    expect(screen.getByText(/stays in your browser/)).toBeInTheDocument();
  });

  it("only links to legal routes that are registered", () => {
    for (const page of [<Privacy key="p" />, <Terms key="t" />, <Cookies key="c" />]) {
      const { container, unmount } = renderPage(page);
      const internal = [...container.querySelectorAll('a[href^="/"]')]
        .map((a) => a.getAttribute("href"))
        .filter((href): href is string => Boolean(href))
        // The shared Navbar and Footer link across the whole site; only the
        // legal cross-links are this test's business.
        .filter((href) => href.startsWith("/privacy") || href.startsWith("/terms") || href.startsWith("/cookies"));
      for (const href of internal) expect(LEGAL_ROUTES).toContain(href);
      unmount();
    }
  });
});
