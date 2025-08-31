import { getText, setText } from "../lib/i18n";

export function toUiModel(apiServices: any[] = []) {
  if (!Array.isArray(apiServices)) return [];
  return apiServices.map(s => ({
    ...s,
    title: getText(s?.title, "ar"),
    name:  getText(s?.name,  "ar"),
    items: Array.isArray(s?.items)
      ? s.items.map((it: any) => ({ text: getText(typeof it === "string" ? it : it?.text, "ar") }))
      : [],
    subServices: Array.isArray(s?.subServices)
      ? s.subServices.map((ss: any) => ({
          name: getText(ss?.name, "ar"),
          description: getText(ss?.description, "ar")
        }))
      : []
  }));
}

export function toApiModel(uiServices: any[] = []) {
  if (!Array.isArray(uiServices)) return [];
  return uiServices.map(s => ({
    ...s,
    title: setText(s?.title ?? "", "ar"),
    name:  s?.name ? setText(s.name, "ar") : undefined,
    items: Array.isArray(s?.items) ? s.items.map((it: any) => ({ text: setText(it?.text ?? "", "ar") })) : [],
    subServices: Array.isArray(s?.subServices)
      ? s.subServices.map((ss: any) => ({
          ...ss,
          name: setText(ss?.name ?? "", "ar"),
          description: setText(ss?.description ?? "", "ar")
        }))
      : []
  }));
}
