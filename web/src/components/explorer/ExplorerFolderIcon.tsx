"use client";

import { useCallback, useState } from "react";

type Props = {
  className?: string;
  width: number;
  height: number;
  title?: string;
};

/**
 * 레거시 동기화(`npm run sync:legacy`) 후 흔한 경로 순으로 시도합니다.
 * 최종 폴백은 `/img/folder_sub02.png` 입니다.
 */
const FOLDER_SUB02_SOURCES = [
  "/icons/explore/folderIcon.png",
] as const;

export function ExplorerFolderIcon({ className, width, height, title }: Props) {
  const [index, setIndex] = useState(0);
  const src = FOLDER_SUB02_SOURCES[index];

  const onError = useCallback(() => {
    setIndex((i) => (i + 1 < FOLDER_SUB02_SOURCES.length ? i + 1 : i));
  }, []);

  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      className={className}
      title={title}
      draggable={false}
      decoding="async"
      onError={onError}
    />
  );
}
