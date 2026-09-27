"use client";

import { useEffect, useId, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import type { ProjectScreenshot } from "@/types/portfolio";
import styles from "./ScreenshotModal.module.scss";

type Props = {
  screenshot: ProjectScreenshot;
  onClose: () => void;
};

export function ScreenshotModal({ screenshot, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <header className={styles.header}>
        <h2 id={titleId} className={styles.title}>{screenshot.title}</h2>
        <button type="button" className={styles.closeButton} aria-label="미리보기 닫기" onClick={onClose} autoFocus>
          <FaXmark aria-hidden />
        </button>
      </header>
      <div className={styles.content}>
        <img
          src={screenshot.imageUrl}
          alt={screenshot.title}
          width={screenshot.width}
          height={screenshot.height}
          className={styles.image}
        />
        <p id={descriptionId} className={styles.description}>{screenshot.description}</p>
      </div>
    </dialog>
  );
}
