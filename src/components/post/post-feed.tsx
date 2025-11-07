import Fallback from "@/components/fallback";
import Loader from "@/components/loader";
import PostItem from "@/components/post/post-item";
import { usePostData } from "@/hooks/queries/use-post-data";

export default function PostFeed() {
  const { data: posts, error, isPending } = usePostData();

  if (error) return <Fallback />;
  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col gap-10">
      {posts?.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </div>
  );
}
