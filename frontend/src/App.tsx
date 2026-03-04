import { useTheme } from "./context/theme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="glass-card w-full max-w-lg p-6 grid gap-4">
        <header className="grid gap-1">
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: "var(--font-weight-extrabold)",
            }}
          >
            Worship+
          </div>
          <div
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
            }}
          >
            Design tokens + theme (US-013)
          </div>
        </header>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-full"
          style={{
            minHeight: "48px",
            borderRadius: "var(--radius-full)",
            padding: "0 16px",
            background: "var(--color-primary)",
            color: "var(--color-neutral-50)",
            fontWeight: 600,
            transition:
              "transform var(--transition-fast), box-shadow var(--transition-fast)",
          }}
        >
          Alternar tema (atual: {theme})
        </button>
      </div>
    </div>
  );
}

export default App;
