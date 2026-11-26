/**
 * AI models offered by the prompt.
 *
 * MOCK DATA — the prompt is not connected to a backend yet.
 */

export type AiModel = { id: string; name: string; description: string };

export const aiModels: AiModel[] = [
  {
    id: "claude-fable-5-2",
    name: "Claude Fable 5.2",
    description: "Nejschopnější, pro složité úpravy",
  },
  {
    id: "claude-opus-5-5",
    name: "Claude Opus 5.5",
    description: "Důkladný, pro delší texty",
  },
  {
    id: "claude-sonnet-5-5",
    name: "Claude Sonnet 5.5",
    description: "Vyvážený, pro běžné úpravy",
  },
  {
    id: "claude-haiku-5-5",
    name: "Claude Haiku 5.5",
    description: "Nejrychlejší, pro drobné změny",
  },
];
