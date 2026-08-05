<script lang="ts">
  interface CalendarCell {
    id: string;
    day: number | null;
  }

  let month = $state(new Date(2026, 6, 1));
  let selectedDay = $state<number | null>(17);

  let monthLabel = $derived(
    new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
      month,
    ),
  );
  let calendarCells = $derived.by((): CalendarCell[] => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const mondayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const dayCount = new Date(year, monthIndex + 1, 0).getDate();

    const cells = [
      ...Array.from({ length: mondayOffset }, (_, index) => ({
        id: `empty-${year}-${monthIndex}-${index}`,
        day: null,
      })),
      ...Array.from({ length: dayCount }, (_, index) => ({
        id: `day-${year}-${monthIndex}-${index + 1}`,
        day: index + 1,
      })),
    ];
    const trailingCount = (7 - (cells.length % 7)) % 7;

    return [
      ...cells,
      ...Array.from({ length: trailingCount }, (_, index) => ({
        id: `trailing-${year}-${monthIndex}-${index}`,
        day: null,
      })),
    ];
  });

  function moveMonth(offset: number): void {
    month = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    selectedDay = null;
  }
</script>

<div class="stack" style="--gap: var(--vs-l)">
  <label class="date-picker">
    Native due date
    <input type="date" value="2026-07-17" />
  </label>

  <div class="date-picker">
    <button popovertarget="calendar-demo">Choose from calendar</button>
    <section
      id="calendar-demo"
      class="calendar"
      popover
      aria-label="Choose a date"
    >
      <header class="calendar-header">
        <button
          type="button"
          aria-label="Previous month"
          onclick={() => moveMonth(-1)}>‹</button
        >
        <strong aria-live="polite">{monthLabel}</strong>
        <button
          type="button"
          aria-label="Next month"
          onclick={() => moveMonth(1)}>›</button
        >
      </header>

      <table class="calendar-grid">
        <thead>
          <tr>
            {#each ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as weekday (weekday)}
              <th scope="col"><abbr title={weekday}>{weekday}</abbr></th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each Array.from( { length: Math.ceil(calendarCells.length / 7) }, ) as _, rowIndex (`week-${rowIndex}`)}
            <tr>
              {#each calendarCells.slice(rowIndex * 7, rowIndex * 7 + 7) as cell (cell.id)}
                <td>
                  {#if cell.day}
                    <button
                      type="button"
                      class="calendar-day"
                      aria-current={cell.day === 17 ? "date" : undefined}
                      aria-pressed={selectedDay === cell.day}
                      onclick={() => (selectedDay = cell.day)}
                    >
                      {cell.day}
                    </button>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
  </div>
</div>
