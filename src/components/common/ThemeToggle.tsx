import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {actualTheme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40" align="end">
        <div className="space-y-1">
          <p className="text-sm font-medium mb-2">Theme</p>
          {themes.map((t) => {
            const Icon = t.icon;
            return (
              <Button
                key={t.value}
                variant={theme === t.value ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setTheme(t.value)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {t.label}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeToggle;
