import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {recentActivities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className={activity.color}>
              {activity.icon}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
}

const recentActivities = [
  {
    icon: "P",
    color: "bg-primary/10 text-primary",
    title: "Practice Test: Math",
    description: "Scored 82% - 18/22 correct",
    time: "2h ago",
  },
  {
    icon: "E",
    color: "bg-blue-500/10 text-blue-500",
    title: "Mock Exam: AMT Entrance",
    description: "Completed in 1h 45m",
    time: "5h ago",
  },
  {
    icon: "S",
    color: "bg-green-500/10 text-green-500",
    title: "Study Session",
    description: "Reviewed mechanical systems",
    time: "Yesterday",
  },
  {
    icon: "F",
    color: "bg-yellow-500/10 text-yellow-500",
    title: "Flashcards",
    description: "Practiced 45 flashcards",
    time: "Yesterday",
  },
];
