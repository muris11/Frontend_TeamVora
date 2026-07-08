import { Badge } from "@/components/ui/badge";
import { projectDocStatusMeta, type ProjectDocStatus } from "@/lib/project-docs";

export function ProjectDocStatusBadge({ status }: { status: ProjectDocStatus }) {
  const meta = projectDocStatusMeta[status];

  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}
