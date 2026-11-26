"use client";

import { useRef, useState } from "react";
import { publishEditorDraft, type EditorDraft } from "@/lib/editor";

export type DraftStatus = "published" | "saving" | "draft" | "publishing";

/**
 * Draft of the web content with undo. Every change is "saved" as a draft
 * right away (mock) and goes to the web only after `publish`.
 */
export function useEditorDraft(projectSlug: string, initial: EditorDraft) {
  const [draft, setDraft] = useState(initial);
  const [history, setHistory] = useState<EditorDraft[]>([]);
  // The design opens the editor with unpublished changes.
  const [status, setStatus] = useState<DraftStatus>("draft");
  const lastChange = useRef<{ key: string; at: number } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function markSaving() {
    setStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setStatus("draft"), 600);
  }

  /**
   * Applies a change. Quick consecutive changes with the same `key` (typing
   * into one field) become a single undo step.
   */
  function update(key: string, change: (draft: EditorDraft) => EditorDraft) {
    const now = Date.now();
    const last = lastChange.current;
    const sameStep = last !== null && last.key === key && now - last.at < 1500;
    lastChange.current = { key, at: now };

    if (!sameStep) setHistory((steps) => [...steps.slice(-49), draft]);
    setDraft(change(draft));
    markSaving();
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    lastChange.current = null;
    setHistory((steps) => steps.slice(0, -1));
    setDraft(previous);
    markSaving();
  }

  async function publish() {
    clearTimeout(saveTimer.current);
    setStatus("publishing");
    await publishEditorDraft(projectSlug, draft);
    setStatus("published");
  }

  return { draft, update, undo, canUndo: history.length > 0, status, publish };
}
