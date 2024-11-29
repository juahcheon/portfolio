export interface HeadingBlock {
  type: "heading";
  text: string;
}

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ImageBlock {
  type: "image";
  src: string;  // 이미지 경로
  alt?: string; // 이미지 설명 (선택적)
}

export interface ListBlock {
  type: "list";
  items: string[]; // 리스트 항목
}

export interface CodeBlock {
  type: "code";
  code: string; // 코드 스니펫
}

export type Block = 
  | HeadingBlock 
  | ParagraphBlock 
  | ImageBlock 
  | ListBlock 
  | CodeBlock;