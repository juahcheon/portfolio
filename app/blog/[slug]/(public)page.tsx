import { notFound } from "next/navigation";
import { baseUrl } from "../../sitemap";
import posts from "../../../content/posts";
import NotionRenderer from "../../../components/notion-renderer";
import Comment from "../../../components/comment";

export const runtime = "nodejs";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return {};
  }

  const { title, date: publishedTime, description, image } = post;
  const ogImage = image
    ? `${baseUrl}image`
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return <div>Post not found</div>;

  return <NotionRenderer post={post} />;
}

export default function Blog({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = posts.find((post) => post.slug === slug);
  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
            description: post.description,
            image: post.image
              ? `${baseUrl}${post.image}`
              : `/og?title=${encodeURIComponent(post.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "My Portfolio",
            },
          }),
        }}
      />
      <NotionRenderer post={post} />
      <Comment />
    </section>
  );
}
