<script lang="ts">
  interface Project {
    id: number;
    name: string;
    owner: string;
    status: "Active" | "Blocked" | "Review";
  }

  const projects: Project[] = [
    { id: 1, name: "Graffiti", owner: "Scott", status: "Active" },
    { id: 2, name: "Decks", owner: "Kathy", status: "Review" },
    { id: 3, name: "Syntax", owner: "Wes", status: "Blocked" },
  ];

  let mode = $state<"ready" | "loading" | "empty">("ready");
  let sortDirection = $state<"ascending" | "descending">("ascending");
  let selectedIds = $state<number[]>([2]);

  let visibleProjects = $derived(
    [...projects].sort((a, b) =>
      sortDirection === "ascending"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    ),
  );

  function toggleProject(id: number): void {
    selectedIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
  }
</script>

<section class="data-table compact sticky" aria-busy={mode === "loading"}>
  <div class="data-table-toolbar">
    <label class="search">
      <span class="visually-hidden">Search projects</span>
      <input type="search" placeholder="Search projects" />
    </label>
    <fieldset class="segmented-control compact">
      <legend class="visually-hidden">Table state</legend>
      <label><input type="radio" value="ready" bind:group={mode} /> Ready</label
      >
      <label
        ><input type="radio" value="loading" bind:group={mode} /> Loading</label
      >
      <label><input type="radio" value="empty" bind:group={mode} /> Empty</label
      >
    </fieldset>
  </div>

  <div class="table">
    <table>
      <thead>
        <tr>
          <th><span class="visually-hidden">Select</span></th>
          <th aria-sort={sortDirection}>
            <button
              class="data-table-sort"
              onclick={() =>
                (sortDirection =
                  sortDirection === "ascending" ? "descending" : "ascending")}
              >Project</button
            >
          </th>
          <th>Owner</th>
          <th>Status</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#if mode === "loading"}
          <tr class="data-table-loading">
            <td colspan="5">
              <span class="skeleton text" aria-hidden="true"
                >Loading projects</span
              >
              <span class="visually-hidden">Loading projects</span>
            </td>
          </tr>
        {:else if mode === "empty"}
          <tr>
            <td class="data-table-empty" colspan="5">No matching projects</td>
          </tr>
        {:else}
          {#each visibleProjects as project (project.id)}
            <tr aria-selected={selectedIds.includes(project.id)}>
              <td>
                <input
                  type="checkbox"
                  aria-label={`Select ${project.name}`}
                  checked={selectedIds.includes(project.id)}
                  onchange={() => toggleProject(project.id)}
                />
              </td>
              <td>{project.name}</td>
              <td>{project.owner}</td>
              <td>
                <span
                  class={[
                    "tag",
                    project.status === "Active" && "success",
                    project.status === "Blocked" && "error",
                    project.status === "Review" && "warning",
                  ]}>{project.status}</span
                >
              </td>
              <td class="data-table-actions"
                ><button class="mini">Open</button></td
              >
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</section>
