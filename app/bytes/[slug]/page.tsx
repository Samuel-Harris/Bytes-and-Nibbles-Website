import { Byte } from "@/app/utils/Byte";
import FirebaseService from "@/app/utils/firebaseService";


export async function generateStaticParams() {
  const firebaseService: FirebaseService = FirebaseService.getInstance();
  // const posts = await fetch('https://.../posts').then((res) => res.json())
  const slugs = await firebaseService.getSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const firebaseService: FirebaseService = FirebaseService.getInstance();
  const byte: Byte | undefined = await firebaseService.getByte(params.slug);
  if (!byte) return <main>Byte not found</main>;

  return (
    <main>
      <p>{byte.title}</p>
      <p>{byte.subtitle}</p>
      <img src={byte.coverPhoto} alt={byte.title} />
    </main>
  );
}
