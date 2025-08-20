import type { Metadata, ResolvingMetadata } from "next";
import { getTitle } from "@/lib/actions";
import ThreadBlock from "@/components/thread-block";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  // fetch data
  const title = await getTitle(id);

  return {
    title: title || "Loading...",
  };
}

export default async function Page({ params }: Props) {
  //   const { id } = await params;
  return (
    <div className="flex flex-1 flex-col gap-4 relative">
      <div className="max-w-4xl mx-auto relative size-full h-full">
        <ThreadBlock />
      </div>
    </div>
  );
}
