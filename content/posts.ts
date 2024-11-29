import { Block } from "@notionpresso/react";
import newPost from "../notion-data/9d9c8a62-a038-40f7-b76a-43d6ad636c33.json";
import post1 from "../notion-data/9d9c8a62-a038-40f7-b76a-43d6ad636c33.json";

const posts = [
  {
    title: "첫 번째 블로그 포스트",
    slug: "first-post",
    content: newPost,
    date: "2024-11-05",
    description:
      "블로그를 시작하며, Notion과 Github를 연동하고 NextJS와 React Library를 이용해 만드는 블로그/포트폴리오",
    image: undefined,
  },
  {
    title: "Naver Search Bar UX: Analysis and Implementation Guide",
    slug: "naver-search-bar-ux",
    content: post1,
    date: "2023-10-23",
    description:
      "Explore the UX analysis of Naver's search bar and strategies for replicating its features. The post examines the UX triggers, selection of search results, and the refreshing of result lists. It also compares coding approaches for implementing search bar functionalities, aiming for a concise and effective execution.",
    image: undefined,
  },
] as Post[];

export default posts;

export type Post = {
  title: string;
  slug: string;
  content: { blocks: Block[] };
  date: string;
  description: string;
  image?: string;
};
