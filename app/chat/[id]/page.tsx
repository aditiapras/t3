import type { Metadata, ResolvingMetadata } from "next";
import { getTitle } from "@/lib/actions";

type Props = {
    params: {
        id: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;

    // fetch data
    const product = await getTitle(id);

    return {
        title: product,
    };
}

export default async function Page({ params }: Props) {
    return <div></div>;
}
