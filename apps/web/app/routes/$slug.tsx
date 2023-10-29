import {
  type LoaderFunctionArgs,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Markdown from "react-markdown";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data[0]?.seo.title },
    { name: "description", content: data[0]?.seo?.description },
  ];
};

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const slug = params.slug;
  const posts = await fetch(
    `http://127.0.0.1:1337/api/pages?filters[slug]=${slug}&populate=*`
  );
  const response = await posts.json();
  const structuredData = response?.data?.map((datum: any) => ({
    ...datum.attributes,
    id: datum.id,
  }));
  return structuredData || [];
};

export default function Index() {
  const [page] = useLoaderData<any[]>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <img
        width={200}
        height={200}
        alt={page.featuredImage?.data?.attributes.alternativeText || page.title}
        src={`http://127.0.0.1:1337${page.featuredImage?.data?.attributes?.formats?.small.url}`}
      />
      <h1>{page.title}</h1>
      <Markdown>{page.content}</Markdown>
    </div>
  );
}
