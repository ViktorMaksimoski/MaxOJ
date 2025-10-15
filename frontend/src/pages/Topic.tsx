import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router";
import { Sidebar } from "../layout/Sidebar";
import type { LectionData } from "../models/Lection.interface";
import { Star } from "lucide-react";
import { LectionNotFound } from "../components/LectionNotFound";
import { mdxComponents } from "../lib/mdx-components";

export const Topic = () => {
  const { id, lectionCode } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [stars, setStars] = useState<JSX.Element[]>([]);
  const [metaData, setMetaData] = useState<LectionData>({
    title: "",
    importance: 0,
    author: "",
  });
  const [Content, setContent] = useState<React.FC | null>(null);

  useEffect(() => {
    const getMetaData = (d: LectionData) => {
      setMetaData(d);
      const vec = [];
      for (let i = 0; i < d.importance; i++)
        vec.push(<Star key={i} className="text-blue-400" />);
      setStars(vec);
    };

    setLoading(true);
    setContent(null);

    if (lectionCode) {
      fetch(`/data/content/${id}/${lectionCode}.json`)
        .then((res) => res.json())
        .then((data) => getMetaData(data));

      import(`../markdown/${id}/${lectionCode}.mdx`)
        .then((module) => setContent(() => module.default))
        .catch(() => setContent(() => () => <LectionNotFound />))
        .finally(() => setLoading(false));
    }
  }, [id, lectionCode]);

  return (
    <div className="flex justify-evenly w-full px-12 pt-3 gap-6">
      <div className="flex-[1] top-0 h-fit">
        <Sidebar topicId={id} />
      </div>
      <div className="flex-[3] mb-4">
        {lectionCode && (
          <div>
            <div className="flex justify-between">
              <h1 className="text-bold text-4xl tracking-wide">
                {metaData.title}
              </h1>
              <button className="flex">{stars}</button>
            </div>
            <p className="text-gray-400 mt-0.5">Автор: {metaData.author}</p>
            <hr className="mt-2" />
          </div>
        )}

        {loading && <LectionNotFound />}
        {!loading && <Content components={mdxComponents} />}
      </div>
    </div>
  );
};