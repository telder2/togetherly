import { getAvatarFromSeed } from '@/lib/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
  seed: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
}

const sizes = {
  sm: { circle: 'w-8 h-8 text-base', text: 'text-xs' },
  md: { circle: 'w-11 h-11 text-xl', text: 'text-sm' },
  lg: { circle: 'w-16 h-16 text-3xl', text: 'text-sm' },
  xl: { circle: 'w-24 h-24 text-5xl', text: 'text-base' },
};

export function MemberAvatar({ seed, name, size = 'md', showName = false, className }: MemberAvatarProps) {
  const { emoji, color } = getAvatarFromSeed(seed);
  const s = sizes[size];

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <div
        className={cn('rounded-full flex items-center justify-center shrink-0', s.circle)}
        style={{ backgroundColor: color + '33', border: `2px solid ${color}55` }}
      >
        <span>{emoji}</span>
      </div>
      {showName && name && (
        <span className={cn('text-muted-foreground font-medium truncate max-w-[80px] text-center', s.text)}>
          {name}
        </span>
      )}
    </div>
  );
}
