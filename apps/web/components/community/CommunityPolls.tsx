import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface CommunityPollsProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted?: boolean;
}

export function CommunityPolls({ question, options, totalVotes, hasVoted: initialHasVoted = false }: CommunityPollsProps) {
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (hasVoted) return;
    setSelectedOptionId(id);
    setHasVoted(true);
    // In a real app, this would trigger a mutation
  };

  return (
    <div className="bg-[#181824] border border-white/5 rounded-xl p-4 mt-3">
      <h4 className="font-bold text-white mb-4">{question}</h4>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const percentage = totalVotes > 0 ? Math.round((option.votes / (hasVoted ? totalVotes + 1 : totalVotes)) * 100) : 0;
          
          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={`relative overflow-hidden w-full text-left px-4 py-3 rounded-lg border transition-all ${
                hasVoted 
                  ? isSelected ? 'border-pink-500 bg-pink-500/10' : 'border-white/5 bg-white/5'
                  : 'border-white/10 hover:border-pink-500/50 hover:bg-white/5 cursor-pointer'
              }`}
            >
              {/* Progress bar background for results */}
              {hasVoted && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`absolute left-0 top-0 bottom-0 ${isSelected ? 'bg-pink-500/20' : 'bg-white/10'} -z-10`}
                />
              )}
              
              <div className="flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-3">
                  {!hasVoted && (
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-pink-500 transition-colors"></div>
                    </div>
                  )}
                  <span className={`text-sm ${hasVoted && isSelected ? 'font-bold text-pink-500' : 'text-gray-200'}`}>
                    {option.text}
                  </span>
                </div>
                {hasVoted && (
                  <span className="text-xs font-bold text-gray-400">{percentage}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3">{totalVotes + (hasVoted ? 1 : 0)} votes</p>
    </div>
  );
}
