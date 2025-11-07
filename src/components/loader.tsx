import { LoaderCircleIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
      <LoaderCircleIcon className="size-6 animate-spin" />
      <div className="text-sm">데이터를 불러오는 중입니다...</div>
    </div>
  );
}
