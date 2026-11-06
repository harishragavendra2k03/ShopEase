import "./EmptyState.css";

function EmptyState({ icon, title, description, actionLabel, onAction, className = "" }) {
  return (
    <section className={`empty-state ${className}`} aria-labelledby="empty-state-title">
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      <h2 id="empty-state-title">{title}</h2>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </section>
  );
}

export default EmptyState;
