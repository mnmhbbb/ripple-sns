import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import githubLogo from "@/assets/github-mark.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInWithOAuth } from "@/hooks/mutations/use-sign-in-with-oauth";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-with-password";
import { generateErrorMessage } from "@/lib/error";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 에러 발생 시 비밀번호 초기화하는 콜백함수 전달(ui만 담당)
  const {
    mutate: signInWithPassword,
    isPending: isSigningInWithPasswordPending,
  } = useSignInWithPassword({
    onError: (error: Error) => {
      const message = generateErrorMessage(error);
      toast.error(message, {
        position: "top-center",
      });
      setPassword("");
    },
  });
  const { mutate: signInWithOAuth, isPending: isSigningInWithOAuthPending } =
    useSignInWithOAuth({
      onError: (error: Error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
      },
    });

  const handleSignInWithPasswordClick = () => {
    if (email.trim() === "" || password.trim() === "") return;

    signInWithPassword({ email, password });
  };

  const handleSignInWithGitHubClick = () => {
    signInWithOAuth("github");
  };

  const isPending =
    isSigningInWithPasswordPending || isSigningInWithOAuthPending;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-2xl font-bold">로그인</div>

      <div className="flex flex-col gap-2">
        <Input
          type="email"
          placeholder="example@abc.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleSignInWithPasswordClick}
          disabled={isPending}
        >
          로그인
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleSignInWithGitHubClick}
          disabled={isPending}
        >
          <img src={githubLogo} alt="GitHub" className="h-4 w-4" />
          GitHub 로그인
        </Button>
      </div>

      <div>
        <Link className="text-muted-foreground hover:underline" to="/sign-up">
          아직 회원이 아니신가요? 회원가입하기
        </Link>
      </div>
    </div>
  );
}
