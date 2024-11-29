"use client";
import Giscus from "@giscus/react";

export default function Comment() {
  return (
    <Giscus
      id='comments'
      repo='juahcheon/NotionBlog'
      repoId='R_kgDONKv4sw'
      category='Announcements'
      categoryId='DIC_kwDONKv4s84CkGAa'
      mapping='specific'
      term='localhost:3000/blog'
      strict='0'
      reactionsEnabled='1'
      emitMetadata='0'
      inputPosition='bottom'
      theme='light_high_contrast'
      lang='ko'
      loading='lazy'
    />
  );
}
