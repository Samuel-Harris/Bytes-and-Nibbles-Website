export async function generateStaticParams() {
  // const posts = await fetch('https://.../posts').then((res) => res.json())
  const slugs = ["aaaa", "bbbb"]


  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>
}