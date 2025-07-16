export const ExpoIcon = ({ name, size = 24, color = '#000' }: { name: string; size?: number; color?: string }) => {
  const iconMap: Record<string, string> = {
    'refresh': '↻',
    'bar-chart': '📊',
    'trending-up': '📈',
    'checkmark-circle': '✅',
    'close-circle': '❌',
    'remove-circle': '⊖',
    'stats-chart': '📊'
  };

  return (
    <span
      style={{
        fontSize: `${size}px`,
        color,
        display: 'inline-block',
        lineHeight: 1,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {iconMap[name] || '●'}
    </span>
  );
};

