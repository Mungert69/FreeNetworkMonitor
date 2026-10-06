// Standalone pages use the same preference and colours as the React application.
document.addEventListener("DOMContentLoaded", () => {
  const appearance = window.NetworkMonitorAppearance;
  const label = document.createElement("label");
  label.className = "nm-appearance";
  label.append("Appearance");
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Appearance");
  for (const value of ["system", "light", "dark"]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value[0].toUpperCase() + value.slice(1);
    select.append(option);
  }
  const sync = () => {
    select.value = appearance.getSnapshot().preference;
  };
  sync();
  appearance.subscribe(sync);
  select.addEventListener("change", () =>
    appearance.setPreference(select.value),
  );
  label.append(select);
  document.body.prepend(label);
});
