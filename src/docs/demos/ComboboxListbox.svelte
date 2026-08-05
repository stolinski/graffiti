<script lang="ts">
  const people = [
    "Ada Lovelace",
    "Grace Hopper",
    "Margaret Hamilton",
    "Radia Perlman",
  ];

  let query = $state("");
  let isOpen = $state(false);
  let activeIndex = $state(0);

  let filteredPeople = $derived(
    people.filter((person) =>
      person.toLowerCase().includes(query.toLowerCase()),
    ),
  );
  let activeId = $derived(
    isOpen && filteredPeople[activeIndex]
      ? `person-${filteredPeople[activeIndex].toLowerCase().replaceAll(" ", "-")}`
      : undefined,
  );

  function selectPerson(person: string): void {
    query = person;
    isOpen = false;
    activeIndex = 0;
  }

  function handleInput(event: Event): void {
    query = (event.currentTarget as HTMLInputElement).value;
    activeIndex = 0;
    isOpen = true;
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      isOpen = false;
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      isOpen = true;
      if (filteredPeople.length === 0) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      activeIndex =
        (activeIndex + direction + filteredPeople.length) %
        filteredPeople.length;
      return;
    }

    if (event.key === "Enter" && isOpen && filteredPeople[activeIndex]) {
      event.preventDefault();
      selectPerson(filteredPeople[activeIndex]);
    }
  }
</script>

<div class="combobox" aria-expanded={isOpen}>
  <label for="people-combobox">Owner</label>
  <input
    id="people-combobox"
    role="combobox"
    aria-autocomplete="list"
    aria-controls="people-listbox"
    aria-expanded={isOpen}
    aria-activedescendant={activeId}
    autocomplete="off"
    value={query}
    onfocus={() => (isOpen = true)}
    oninput={handleInput}
    onkeydown={handleKeydown}
  />
  <div id="people-listbox" class="listbox" role="listbox" hidden={!isOpen}>
    {#each filteredPeople as person, index (person)}
      <button
        id={`person-${person.toLowerCase().replaceAll(" ", "-")}`}
        type="button"
        class="option"
        role="option"
        aria-selected={query === person}
        data-active={index === activeIndex}
        onpointerdown={(event) => event.preventDefault()}
        onclick={() => selectPerson(person)}
      >
        {person}
      </button>
    {:else}
      <p class="data-table-empty">No matching people</p>
    {/each}
  </div>
</div>
