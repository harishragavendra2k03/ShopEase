import "./Loading.css";

function Loading({ label = "Loading...", inline = false }) {
  return (
    <span
      className={`loading-indicator${inline ? " loading-indicator-inline" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default Loading;
