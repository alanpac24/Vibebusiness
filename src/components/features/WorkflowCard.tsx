import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface WorkflowCardProps {
  title: string;
  description: string;
  path: string;
  emoji: string;
  hasAIAgent?: boolean;
}

export const WorkflowCard = ({ title, description, path, emoji, hasAIAgent }: WorkflowCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group relative border border-border bg-card p-5 text-left hover:bg-grey-50 hover:shadow-sm transition-all"
    >
      {hasAIAgent && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full">
          <Sparkles className="h-3 w-3" />
          <span className="text-xs font-medium">AI Agent</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{emoji}</div>
        <div className="flex-1 min-w-0 pr-16">
          <h3 className="font-semibold text-sm text-foreground mb-1.5 group-hover:text-grey-900 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-grey-500 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};
