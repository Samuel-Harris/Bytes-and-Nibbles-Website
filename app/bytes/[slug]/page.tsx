import { Byte } from "@/app/utils/Byte";
import FirebaseService from "@/app/utils/firebaseService";


export async function generateStaticParams() {
  // const posts = await fetch('https://.../posts').then((res) => res.json())
  const slugs = ["my-byte"];

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const firebaseService: FirebaseService = new FirebaseService();
  const byte: Byte | null = await firebaseService.getByte(params.slug);
  if (!byte) return <main>Byte not found</main>;

  return (
    <main>
      <p>{byte.title}</p>
      <p>{byte.subtitle}</p>
      <img src={byte.coverPhoto} alt={byte.title} />
    </main>
  );
}
