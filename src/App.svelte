<script>
  import "./styles/app.css"
  import Select from "./lib/Select.svelte";
  import { minuteOptions, secondOptions, kilometreOptions, decametreOptions } from "./scripts/options.js"
  import { onMount } from "svelte";

  const minuteKey = "minutes"
  const secondKey = "seconds"
  const kilometreKey = "kilometres"
  const decametreKey = "decametres"

  let minutes = getIntegerFromLocalStorage(minuteKey, 1, 60) || 6
  let seconds = getIntegerFromLocalStorage(secondKey, 0, 59) || 0
  let kilometres = getIntegerFromLocalStorage(kilometreKey, 0, 60) || 10
  let decametres = getIntegerFromLocalStorage(decametreKey, 0, 99) || 0

  function getIntegerFromLocalStorage (key, min, max) {
    const value = parseInt(localStorage.getItem(key))

    if (isNaN(value)) return
    if (!Number.isInteger(value)) return
    if (!(min <= value && value <= max)) return

    return value
  }

  onMount(() => {
    window.addEventListener("beforeunload", beforeUnload)
  })

  function beforeUnload() {
    localStorage.setItem(minuteKey, minutes.toString())
    localStorage.setItem(secondKey, seconds.toString())
    localStorage.setItem(kilometreKey, kilometres.toString())
    localStorage.setItem(decametreKey, decametres.toString())
  }

  function updateKilometres() {
    const totalMinutes = minutes + seconds / 60
    const distance = 60 / totalMinutes

    const roundedDistanceString = distance.toFixed(2)
    const [newKilometreString, newDecametreString] = roundedDistanceString.split(".")

    kilometres = parseInt(newKilometreString)
    decametres = parseInt(newDecametreString)
  }

  function updateMinutes() {
    const totalKilometres = kilometres + decametres / 100
    const pace = 60 / totalKilometres

    let newMinutes = Math.floor(pace)
    let newSeconds = Math.round((pace - newMinutes) * 60)

    if (newSeconds === 60) {
      newMinutes++
      newSeconds = 0
    }

    minutes = newMinutes
    seconds = newSeconds
  }

  function onMinuteSelect (value) {
    minutes = value
    
    if (value === 60) {
      seconds = 0
    }

    updateKilometres()
  }

  function onSecondSelect (value) {
    if (minutes !== 60) {
      seconds = value
      updateKilometres()
    }
  }

  function onKilometreSelect (value) {
    kilometres = value

    if (kilometres === 60) {
      decametres = 0
    }

    updateMinutes()
  }

  function onDecametreSelect (value) {
    if (kilometres !== 60) {
      decametres = value
      updateMinutes()
    }
  }

</script>

<main>
  <div class="field-wrapper">
    <span class="label">min/km</span>
    <div class="select-wrapper">
      <Select
        value={minutes}
        options={minuteOptions}
        onselect={onMinuteSelect}
      />
  
      <span>:</span>
  
      <Select
        value={seconds}
        options={secondOptions}
        onselect={onSecondSelect}
      />
    </div>
  </div>
  
  <div class="field-wrapper">
    <span class="label">km/uur</span>
    <div class="select-wrapper">
      <Select
        value={kilometres}
        options={kilometreOptions}
        onselect={onKilometreSelect}
      />
  
      <span>,</span>
  
      <Select
        value={decametres}
        options={decametreOptions}
        onselect={onDecametreSelect}
      />
    </div>
  </div>
</main>