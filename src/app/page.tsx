import Link from "next/link";

import { PAGES } from "./constants";

const Home = () => {
  return (
    <div className="h-screen max-w-screen-xl m-auto px-4 py-6 justify-center items-center text-center flex flex-col gap-8">
      <div className="text-4xl font-bold">Langchain JS Examples</div>
      <div className="flex flex-col gap-4">
        {PAGES.map((page, index) => (
          <Link key={index} href={page.path} className="text-blue-500">
            {page.title} ({page.description})
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
