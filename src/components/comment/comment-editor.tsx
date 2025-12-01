import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CommentEditor() {
  return (
    <div className="flex flex-col gap-2">
      <Textarea />
      <div className="flex justify-end">
        <Button>작성</Button>
      </div>
    </div>
  );
}
