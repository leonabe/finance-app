import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChapter, CHAPTERS } from "@/lib/chapters";
import { Chapter1Page } from "@/components/chapter1/Chapter1Page";
import { Chapter2Page } from "@/components/chapter2/Chapter2Page";
import { Chapter3Page } from "@/components/chapter3/Chapter3Page";
import { Chapter4Page } from "@/components/chapter4/Chapter4Page";
import { ChapterPlaceholder } from "@/components/chapters/ChapterPlaceholder";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: "Chapter not found" };
  return {
    title: `Ch${chapter.number}: ${chapter.title} · Financial Calculations`,
    description: chapter.topics.join("; "),
  };
}

export default async function ChapterPage({ params }: Props) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  if (chapter.number === 1) {
    return <Chapter1Page />;
  }
  if (chapter.number === 2) {
    return <Chapter2Page />;
  }
  if (chapter.number === 3) {
    return <Chapter3Page />;
  }
  if (chapter.number === 4) {
    return <Chapter4Page />;
  }

  return <ChapterPlaceholder chapter={chapter} />;
}
