"use client";

import { useState } from "react";
import type { FormEvent } from "react";

/** Submit handling shared by the detail forms: pending + "saved" state. */
export function useSaveForm(save: () => Promise<void>) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    await save();
    setSaving(false);
    setSaved(true);
  }

  /** Call when a field changes to hide the confirmation again. */
  const markDirty = () => setSaved(false);

  return { saving, saved, handleSubmit, markDirty };
}
