'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  value: number | null;
  onChange: (value: 1 | 2 | 3 | 4) => void;
  accent: string;
  questionNumber: number;
  totalQuestions: number;
}

const CHOICES = [
  { value: 1 as const, label: 'Strongly A', short: 'A' },
  { value: 2 as const, label: 'Lean A', short: 'a' },
  { value: 3 as const, label: 'Lean B', short: 'b' },
  { value: 4 as const, label: 'Strongly B', short: 'B' },
];

export function QuestionCard({ question, value, onChange, accent, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="w-full max-w-sm mx-auto space-y-6"
    >
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{questionNumber} of {totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accent }}
            initial={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Prompt */}
      <div className="rounded-2xl border border-white/8 bg-card p-6 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{question.category ?? 'Question'}</p>
        <p className="font-display text-xl font-bold leading-snug">{question.prompt}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        <OptionButton
          label={question.option_a}
          tag="A"
          selected={value === 1 || value === 2}
          strongly={value === 1}
          accent={accent}
          onClick={() => {
            if (value === 2) onChange(1);
            else if (value === 1) onChange(2);
            else onChange(2);
          }}
          onDoubleClick={() => onChange(1)}
        />
        <OptionButton
          label={question.option_b}
          tag="B"
          selected={value === 3 || value === 4}
          strongly={value === 4}
          accent={accent}
          onClick={() => {
            if (value === 3) onChange(4);
            else if (value === 4) onChange(3);
            else onChange(3);
          }}
          onDoubleClick={() => onChange(4)}
        />
      </div>

      {/* Slider / intensity picker */}
      {value !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-xs text-muted-foreground text-center">How strongly?</p>
          <div className="grid grid-cols-4 gap-1.5">
            {CHOICES.map((c) => (
              <button
                key={c.value}
                onClick={() => onChange(c.value)}
                className={cn(
                  'py-2.5 rounded-xl text-xs font-semibold transition-all border',
                  value === c.value
                    ? 'border-transparent text-white'
                    : 'border-white/10 text-muted-foreground hover:border-white/20'
                )}
                style={value === c.value ? { backgroundColor: accent } : {}}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function OptionButton({
  label, tag, selected, strongly, accent, onClick, onDoubleClick,
}: {
  label: string; tag: string; selected: boolean; strongly: boolean;
  accent: string; onClick: () => void; onDoubleClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative rounded-2xl border p-4 text-left transition-all min-h-[7rem] flex flex-col justify-between',
        selected ? 'border-transparent' : 'border-white/10 hover:border-white/20'
      )}
      style={selected ? { backgroundColor: accent + (strongly ? '44' : '22'), borderColor: accent + '66' } : {}}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest mb-1"
        style={{ color: selected ? accent : 'rgb(255 255 255 / 0.3)' }}
      >
        Option {tag}
      </span>
      <p className="text-sm font-medium leading-snug text-foreground">{label}</p>
    </motion.button>
  );
}
