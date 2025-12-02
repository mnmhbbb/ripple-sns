import { Link, Outlet } from "react-router";

import logo from "/logo.png";
import ProfileButton from "@/components/layout/header/profile-button";
import ThemeButton from "@/components/layout/header/theme-button";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="h-15 border-b">
        <div className="m-auto flex h-full w-full max-w-175 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="ripple sns의 로고, 물결을 타는 ripple 아이콘"
              className="h-8 rounded-full"
            />
            <div className="font-bold">ripple sns</div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeButton />
            <ProfileButton />
          </div>
        </div>
      </header>
      <main className="m-auto w-full max-w-175 flex-1 border-x px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-muted-foreground border-t py-10 text-center">
        @mnmhbbb
      </footer>
    </div>
  );
}
