import logo from "@/assets/logo.png";

export default function GlobalLoader() {
  return (
    <div className="bg-muted flex h-screen w-screen flex-col items-center justify-center">
      <div className="mb-15 flex animate-bounce items-center gap-4">
        <img
          src={logo}
          alt="ripple sns의 로고, 물결을 타는 ripple 아이콘"
          className="h-12 rounded-full"
        />
        <div className="text-2xl font-bold">ripple sns</div>
      </div>
    </div>
  );
}
