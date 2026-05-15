/**
 * Tailwind `theme.extend.colors` 전용 팔레트.
 * `text-winSkyBlue` 등은 `src/app/globals.css` `@layer utilities`에 고정(빌드 청크 이슈 방지).
 */
export const tailwindPalette = {
  winBlue: "#0078D4",
  winBar: "rgba(230,230,230,0.88)",
  desk: "#5f9ea0",
} as const;
