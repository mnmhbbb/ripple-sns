import { PopoverClose } from "@radix-ui/react-popover";
import { CheckIcon, SunIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSetTheme, useTheme } from "@/store/theme";
import type { Theme } from "@/types";

const THEMES: Theme[] = ["system", "light", "dark"];

export default function ThemeButton() {
  const currentTheme = useTheme();
  const setTheme = useSetTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <div className="hover:bg-muted cursor-pointer rounded-full p-2">
          <SunIcon className="size-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-35 p-0">
        {THEMES.map((theme) => (
          <PopoverClose key={`theme-button-${theme}`} asChild>
            <div
              className="hover:bg-muted flex cursor-pointer items-center justify-between p-3"
              onClick={() => setTheme(theme)}
            >
              {theme}
              {currentTheme === theme && <CheckIcon className="size-4" />}
            </div>
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  );
}
