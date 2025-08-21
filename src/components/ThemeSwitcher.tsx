type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSwitcher({
  currentTheme,
  onThemeChange,
}: ThemeSwitcherProps) {
  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'high-contrast', label: 'High Contrast' },
  ];

  return (
    <div className='theme-switcher'>
      <label className='settings-label'>Theme</label>
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as Theme)}
        className='settings-input theme-select'
      >
        {themes.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}
