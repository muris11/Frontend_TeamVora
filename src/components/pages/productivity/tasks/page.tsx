"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import { Task } from "@/types";
import { PageTitle } from "@/components/shared/page-title";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TasksPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams();
  if (statusFilter !== "all") queryParams.set("status", statusFilter);
  if (priorityFilter !== "all") queryParams.set("priority", priorityFilter);
  const queryString = queryParams.toString();

  const { data: response, isLoading } = useQuery({
    queryKey: ["tasks", statusFilter, priorityFilter],
    queryFn: () => api.get(`/tasks?${queryString}`).then((r) => r.data),
  });

  const tasks = response?.data ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: string }) => 
      api.patch(`/tasks/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Status tugas diperbarui");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.error("Gagal memperbarui status tugas");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (data: { tasks: { id: string | number; position: number }[] }) =>
      api.patch("/tasks/reorder", data),
    onError: () => {
      toast.error("Gagal menyimpan urutan tugas");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDragStart = (e: React.DragEvent, id: string | number) => {
    e.dataTransfer.setData("taskId", id.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    const task = tasks.find((t: Task) => String(t.id) === taskId);
    if (!task) return;

    const isCrossColumn = task.status !== targetStatus;
    const oldPosition = task.position ?? 0;

    // Get target column tasks sorted by position (excluding dragged task)
    const targetColumnTasks = tasks
      .filter((t: Task) => t.status === targetStatus && String(t.id) !== taskId)
      .sort((a: Task, b: Task) => (a.position ?? 0) - (b.position ?? 0));

    // Determine drop position based on mouse Y within the column
    const dropY = e.clientY;
    const columnEl = e.currentTarget as HTMLElement;
    const cards = Array.from(columnEl.querySelectorAll("[data-task-card]")).filter(
      (el) => (el as HTMLElement).dataset.taskId !== taskId
    );
    let insertIndex = targetColumnTasks.length;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const rect = card.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (dropY < midY) {
        insertIndex = i;
        break;
      }
    }

    // Only include tasks whose position actually changed
    const reorderPayload: { id: string | number; position: number }[] = [];

    if (isCrossColumn) {
      // Cross-column: dragged task gets new position
      reorderPayload.push({ id: task.id, position: insertIndex });

      // Target column: tasks at/after insertIndex shift up by +1
      for (let i = insertIndex; i < targetColumnTasks.length; i++) {
        const t = targetColumnTasks[i];
        if ((t.position ?? 0) !== i + 1) {
          reorderPayload.push({ id: t.id, position: i + 1 });
        }
      }

      // Source column: tasks after oldPosition shift down by -1
      const sourceColumnTasks = tasks
        .filter((t: Task) => t.status === task.status && String(t.id) !== taskId)
        .sort((a: Task, b: Task) => (a.position ?? 0) - (b.position ?? 0));

      for (let i = 0; i < sourceColumnTasks.length; i++) {
        const t = sourceColumnTasks[i];
        const expectedPos = (t.position ?? 0) > oldPosition ? (t.position ?? 0) - 1 : (t.position ?? 0);
        if (expectedPos !== i) {
          reorderPayload.push({ id: t.id, position: i });
        }
      }
    } else {
      // Intra-column: determine shift direction
      if (insertIndex < oldPosition) {
        // Moving up: tasks between insertIndex and oldPosition shift down by +1
        for (let i = insertIndex; i < targetColumnTasks.length; i++) {
          const t = targetColumnTasks[i];
          const oldPos = t.position ?? 0;
          if (oldPos <= oldPosition) {
            const expectedPos = i + 1;
            if (oldPos !== expectedPos) {
              reorderPayload.push({ id: t.id, position: expectedPos });
            }
          }
        }
      } else if (insertIndex > oldPosition) {
        // Moving down: tasks between oldPosition and insertIndex shift up by -1
        for (let i = 0; i < targetColumnTasks.length; i++) {
          const t = targetColumnTasks[i];
          const oldPos = t.position ?? 0;
          if (oldPos >= oldPosition && oldPos <= insertIndex) {
            const expectedPos = i;
            if (oldPos !== expectedPos) {
              reorderPayload.push({ id: t.id, position: expectedPos });
            }
          }
        }
      }
    }

    // Always include the dragged task itself
    if (!reorderPayload.some((r) => String(r.id) === taskId)) {
      reorderPayload.push({ id: task.id, position: insertIndex });
    }

    // Optimistic update: update positions locally
    const reorderMap = new Map(reorderPayload.map((r) => [String(r.id), r.position]));
    queryClient.setQueryData(["tasks", statusFilter, priorityFilter], (old: typeof response) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((t: Task) => {
          const Stringid = String(t.id);
          if (reorderMap.has(Stringid)) {
            const newPos = reorderMap.get(Stringid)!;
            if (isCrossColumn && Stringid === taskId) {
              return { ...t, status: targetStatus as Task["status"], position: newPos };
            }
            return { ...t, position: newPos };
          }
          return t;
        }),
      };
    });

    // Persist to server (only changed tasks)
    if (reorderPayload.length > 0) {
      reorderMutation.mutate({ tasks: reorderPayload });
    }
  };

  const sortTasks = (list: Task[]) =>
    [...list].sort((a: Task, b: Task) => (a.position ?? 0) - (b.position ?? 0));

  return (
    <div className="space-y-6">
      <PageTitle title="Tugas" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tugas</h1>
          <p className="text-sm text-muted-foreground">Kelola dan pantau tugas tim Anda</p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href={`${basePath}/productivity/tasks/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Baru
          </Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">Proses</SelectItem>
            <SelectItem value="done">Selesai</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prioritas</SelectItem>
            <SelectItem value="low">Rendah</SelectItem>
            <SelectItem value="medium">Sedang</SelectItem>
            <SelectItem value="high">Tinggi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {tasks.length === 0 && !isLoading ? (
        <EmptyState
          title="Belum ada tugas"
          description="Tugas akan muncul di sini setelah ditambahkan."
          action={
            <Button asChild size="sm">
              <Link href={`${basePath}/productivity/tasks/create`}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Tugas
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
          {/* To Do Column */}
          <div 
            className="flex-1 min-w-[300px] snap-center bg-muted/30 rounded-xl p-4 border border-border/50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider">To Do</h3>
              <span className="bg-background shadow-sm px-2 py-0.5 rounded-full text-xs font-medium">
                {tasks.filter((t: Task) => t.status === 'todo').length}
              </span>
            </div>
            <div className="space-y-3">
              {sortTasks(tasks.filter((t: Task) => t.status === 'todo')).map((task: Task) => (
                <Card 
                  key={task.id}
                  data-task-card
                  data-task-id={String(task.id)}
                  draggable 
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                  className="cursor-grab hover:border-primary/50 transition-colors active:cursor-grabbing" 
                  onClick={() => router.push(`${basePath}/productivity/tasks/${task.id}/edit`)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="font-semibold text-sm line-clamp-2">{task.title}</h4>
                      <StatusBadge status={task.priority} />
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-3 border-t">
                      <span className={task.due_date && new Date(task.due_date) < new Date() ? 'text-destructive font-medium' : ''}>
                        {task.due_date ? formatDate(task.due_date) : 'Tidak ada tenggat'}
                      </span>
                      {task.assignee && (
                        <div className="flex items-center gap-1.5 bg-muted rounded-full pr-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={task.assignee.avatar_url || ""} />
                            <AvatarFallback className="text-[10px]">{task.assignee.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[80px]">{task.assignee.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {tasks.filter((t: Task) => t.status === 'todo').length === 0 && (
                <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center text-muted-foreground text-sm bg-background/50">
                  Tarik tugas ke sini
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div 
            className="flex-1 min-w-[300px] snap-center bg-muted/30 rounded-xl p-4 border border-border/50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'in_progress')}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400">Proses</h3>
              <span className="bg-background shadow-sm px-2 py-0.5 rounded-full text-xs font-medium">
                {tasks.filter((t: Task) => t.status === 'in_progress').length}
              </span>
            </div>
            <div className="space-y-3">
              {sortTasks(tasks.filter((t: Task) => t.status === 'in_progress')).map((task: Task) => (
                <Card 
                  key={task.id}
                  data-task-card
                  data-task-id={String(task.id)}
                  draggable 
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                  className="cursor-grab border-blue-200 dark:border-blue-900 hover:border-blue-500/50 transition-colors active:cursor-grabbing" 
                  onClick={() => router.push(`${basePath}/productivity/tasks/${task.id}/edit`)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="font-semibold text-sm line-clamp-2">{task.title}</h4>
                      <StatusBadge status={task.priority} />
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-3 border-t">
                      <span className={task.due_date && new Date(task.due_date) < new Date() ? 'text-destructive font-medium' : ''}>
                        {task.due_date ? formatDate(task.due_date) : 'Tidak ada tenggat'}
                      </span>
                      {task.assignee && (
                        <div className="flex items-center gap-1.5 bg-muted rounded-full pr-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={task.assignee.avatar_url || ""} />
                            <AvatarFallback className="text-[10px]">{task.assignee.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[80px]">{task.assignee.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {tasks.filter((t: Task) => t.status === 'in_progress').length === 0 && (
                <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center text-muted-foreground text-sm bg-background/50">
                  Tarik tugas ke sini
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div 
            className="flex-1 min-w-[300px] snap-center bg-muted/30 rounded-xl p-4 border border-border/50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'done')}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-green-600 dark:text-green-400">Selesai</h3>
              <span className="bg-background shadow-sm px-2 py-0.5 rounded-full text-xs font-medium">
                {tasks.filter((t: Task) => t.status === 'done').length}
              </span>
            </div>
            <div className="space-y-3">
              {sortTasks(tasks.filter((t: Task) => t.status === 'done')).map((task: Task) => (
                <Card 
                  key={task.id}
                  data-task-card
                  data-task-id={String(task.id)}
                  draggable 
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                  className="cursor-grab border-green-200 dark:border-green-900 hover:border-green-500/50 opacity-75 transition-colors active:cursor-grabbing" 
                  onClick={() => router.push(`${basePath}/productivity/tasks/${task.id}/edit`)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="font-semibold text-sm line-clamp-2 line-through text-muted-foreground">{task.title}</h4>
                      <StatusBadge status={task.priority} />
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-3 border-t opacity-70">
                      <span>{task.due_date ? formatDate(task.due_date) : 'Tidak ada tenggat'}</span>
                      {task.assignee && (
                        <div className="flex items-center gap-1.5 bg-muted rounded-full pr-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={task.assignee.avatar_url || ""} />
                            <AvatarFallback className="text-[10px]">{task.assignee.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[80px]">{task.assignee.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {tasks.filter((t: Task) => t.status === 'done').length === 0 && (
                <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center text-muted-foreground text-sm bg-background/50">
                  Tarik tugas ke sini
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
