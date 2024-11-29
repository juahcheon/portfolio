import posts from "../content/posts"

export const baseUrl = 'https://nextjs-blog-template.pages.dev'

export default async function sitemap2() {
  const blogs = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }))

  const routes = ['', '/blog', '/introduce', '/introduce/kr'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
