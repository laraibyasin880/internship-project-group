function ToggleSwitch({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${
        on ? 'bg-success' : 'bg-line-strong'
      }`}
    >
      <span
        className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition-all ${
          on ? 'left-[21px]' : 'left-[3px]'
        }`}
      />
    </button>
  );
}

export default ToggleSwitch;