import type { Metadata } from "next";
import { getTitle } from "@/app/chat/actions/actions";
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
): Promise<Metadata> {
  const { id } = await params;

  // fetch data
  const title = await getTitle(id);
  console.log("title call from page");

  return {
    title: title || "Loading...",
  };
}

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 relative">
      <div className="max-w-4xl mx-auto relative size-full h-full">
        <ThreadBlock />
      </div>
    </div>
  );
}
