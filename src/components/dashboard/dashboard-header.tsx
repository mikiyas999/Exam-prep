import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({
  heading,
  text,
  children,
  className,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 px-2",
        className
      )}
    >
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl">
          {heading}
        </h1>
        {text && (
          <p className="text-base md:text-lg text-muted-foreground">{text}</p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">{children}</div>
    </div>
  );
}
