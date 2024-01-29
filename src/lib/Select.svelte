<script>
    export let value 
    export let options 
    export let onselect

    let open = false
    let selectedOptionsRef

    $: selectedOption = options.find(option => option.value === value)

    function handleClick() {
        open = !open

        if (open) {
            setTimeout(() => {
                selectedOptionsRef.querySelector(".selected")
                    .scrollIntoView({ block: "center" })
        })
             
        }
    }

    function handleBlur() {
        open = false
    }

    function onOptionClick (optionValue) {
        if (optionValue !== value) {
            onselect(optionValue)
        }
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
    class="select"
    class:open={open}
    bind:this={selectedOptionsRef}
>
    <span 
        class="select-value"
        tabindex="0" 
        on:click={handleClick}
        on:blur={handleBlur}    
    >
        {selectedOption.label}
    </span>

    <ul class="select-options">
        {#each options as option (option.value)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li 
                class="select-option"
                class:selected={option.value === value}
                on:mousedown={() => onOptionClick(option.value)}
            >
                {option.label}
            </li>
        {/each}
    </ul>
</div>