import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSignUp from "@/hooks/mutations/auth/use-sign-up";
import { generateErrorMessage } from "@/lib/error";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signUp, isPending: isSigningUpPending } = useSignUp({
    onError: (error) => {
      const message = generateErrorMessage(error);
      toast.error(message, {
        position: "top-center",
      });
    },
  });

  const handleSignUpClick = () => {
    if (email.trim() === "" || password.trim() === "") return;

    signUp({ email, password });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-2xl font-bold">회원가입</div>

      <div className="flex flex-col gap-2">
        <Input
          type="email"
          disabled={isSigningUpPending}
          placeholder="example@abc.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          disabled={isSigningUpPending}
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <Button
          className="w-full"
          onClick={handleSignUpClick}
          disabled={isSigningUpPending}
        >
          회원가입
        </Button>
      </div>

      <div>
        <Link className="text-muted-foreground hover:underline" to="/sign-in">
          이미 회원이신가요? 로그인하기
        </Link>
      </div>
    </div>
  );
}
