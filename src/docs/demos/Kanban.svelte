<script lang="ts">
  interface Task {
    id: string;
    title: string;
    owner: string;
  }

  interface Column {
    id: string;
    title: string;
    tasks: Task[];
  }

  let columns = $state<Column[]>([
    {
      id: "todo",
      title: "To do",
      tasks: [
        { id: "tokens", title: "Audit component tokens", owner: "Scott" },
        { id: "docs", title: "Write migration guide", owner: "Kathy" },
      ],
    },
    {
      id: "doing",
      title: "Doing",
      tasks: [{ id: "tests", title: "Add visual fixtures", owner: "Wes" }],
    },
    { id: "done", title: "Done", tasks: [] },
  ]);

  let draggedTaskId = $state<string | null>(null);
  let keyboardTaskId = $state<string | null>(null);
  let dragOverColumnId = $state<string | null>(null);
  let announcement = $state("");

  function moveTask(taskId: string, targetColumnId: string): void {
    let movingTask: Task | undefined;

    for (const column of columns) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex >= 0) movingTask = column.tasks.splice(taskIndex, 1)[0];
    }

    const targetColumn = columns.find((column) => column.id === targetColumnId);
    if (!movingTask || !targetColumn) return;

    targetColumn.tasks.push(movingTask);
    announcement = `${movingTask.title} moved to ${targetColumn.title}`;
    dragOverColumnId = null;
  }

  function handleCardKeydown(
    event: KeyboardEvent,
    taskId: string,
    columnId: string,
  ): void {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      keyboardTaskId = keyboardTaskId === taskId ? null : taskId;
      announcement = keyboardTaskId
        ? "Task grabbed. Use left or right arrow to move."
        : "Task released.";
      return;
    }

    if (event.key === "Escape") {
      keyboardTaskId = null;
      announcement = "Move canceled.";
      return;
    }

    if (
      keyboardTaskId !== taskId ||
      !["ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;

    event.preventDefault();
    const currentIndex = columns.findIndex((column) => column.id === columnId);
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const targetColumn = columns[currentIndex + offset];
    if (targetColumn) moveTask(taskId, targetColumn.id);
  }
</script>

<p class="visually-hidden" aria-live="polite">{announcement}</p>

<section class="kanban-board" aria-label="Graffiti release board">
  {#each columns as column (column.id)}
    <section
      class="kanban-column"
      data-drag-over={dragOverColumnId === column.id}
      aria-labelledby={`${column.id}-heading`}
    >
      <header class="kanban-column-header">
        <h3 id={`${column.id}-heading`}>{column.title}</h3>
        <span class="tag">{column.tasks.length}</span>
      </header>

      <div class="stack">
        {#each column.tasks as task (task.id)}
          <button
            type="button"
            class="card kanban-card"
            draggable="true"
            data-dragging={draggedTaskId === task.id}
            data-keyboard-dragging={keyboardTaskId === task.id}
            ondragstart={() => (draggedTaskId = task.id)}
            ondragend={() => {
              draggedTaskId = null;
              dragOverColumnId = null;
            }}
            onkeydown={(event) => handleCardKeydown(event, task.id, column.id)}
          >
            <strong>{task.title}</strong>
            <span class="text-muted">{task.owner}</span>
          </button>
        {/each}
      </div>

      <button
        type="button"
        class="kanban-dropzone"
        data-drop-target={dragOverColumnId === column.id}
        ondragover={(event) => {
          event.preventDefault();
          dragOverColumnId = column.id;
        }}
        ondragleave={() => (dragOverColumnId = null)}
        ondrop={(event) => {
          event.preventDefault();
          if (draggedTaskId) moveTask(draggedTaskId, column.id);
          draggedTaskId = null;
        }}
        onclick={() => {
          if (keyboardTaskId) moveTask(keyboardTaskId, column.id);
        }}
      >
        Move to {column.title}
      </button>
    </section>
  {/each}
</section>
