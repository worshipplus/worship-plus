import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useTheme } from "./context/theme";
import { useAuth } from "./context/auth";
import { SetlistPage } from "./features/setlist";
import { EventsPage, EventDetailPage } from "./features/events";
import { UsersPage } from "./features/users";

function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "px-3 py-1.5 rounded-full text-sm font-medium transition-opacity",
      isActive ? "opacity-100 font-semibold" : "opacity-60 hover:opacity-90",
    ].join(" ");

  return (
    <nav
      className="glass-card px-4 py-3 flex flex-wrap items-center gap-3 justify-between"
      aria-label="Navegação principal"
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--font-weight-extrabold)",
          fontSize: "var(--text-lg)",
          color: "var(--color-primary)",
        }}
      >
        Worship+
      </span>
      <div className="flex flex-wrap gap-1">
        <NavLink to="/setlist" className={linkClass}>
          Setlist
        </NavLink>
        <NavLink to="/events" className={linkClass}>
          Eventos
        </NavLink>
        {currentUser?.role === "admin" && (
          <NavLink to="/users" className={linkClass}>
            Usuários
          </NavLink>
        )}
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className="text-xs px-3 py-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
        aria-label={`Alternar tema. Tema atual: ${theme}`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </nav>
  );
}

function App() {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role ?? "team-member";
  const currentUserName = currentUser?.name ?? "";
  const currentUserId = currentUser?.id ?? "";

  return (
    <BrowserRouter>
      <div className="min-h-screen grid grid-rows-[auto_1fr] gap-4 p-4 sm:p-6">
        <Nav />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <EventsPage
                  userRole={userRole}
                  currentUserName={currentUserName}
                />
              }
            />
            <Route
              path="/setlist"
              element={<SetlistPage userRole={userRole} />}
            />
            <Route
              path="/events"
              element={
                <EventsPage
                  userRole={userRole}
                  currentUserName={currentUserName}
                />
              }
            />
            <Route
              path="/events/:id"
              element={
                <EventDetailPage
                  currentUserRole={userRole}
                  currentUserName={currentUserName}
                  currentUserId={currentUserId}
                />
              }
            />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
