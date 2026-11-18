
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  CheckCircle2,
  Plus,
  Search,
  Trash2,
  Circle,
  Clock,
  Flag,
} from "lucide-react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const navigation = [
  { id: "overview", label: "Áttekintés", icon: LayoutDashboard },
  { id: "all", label: "Összes feladat", icon: ListTodo },
  { id: "pending", label: "Folyamatban", icon: Clock },
  { id: "completed", label: "Befejezett", icon: CheckCircle2 },
  { id: "deadlines", label: "Határidők", icon: CalendarDays },
  { id: "priority", label: "Prioritás", icon: Flag },
];

const viewTitles = {
  overview: "Áttekintés",
  all: "Összes feladat",
  pending: "Folyamatban lévő feladatok",
  completed: "Befejezett feladatok",
  deadlines: "Határidők",
  priority: "Prioritás szerinti szűrés",
};

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState("overview");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a feladatokat.");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description,
          priority,
          due_date: dueDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Nem sikerült létrehozni a feladatot.");
      }

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");

      await loadTasks();
    } catch (error) {
      console.error(error);
      alert("Nem sikerült létrehozni a feladatot.");
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Nem sikerült módosítani a feladatot.");
      }

      await loadTasks();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a feladatot?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nem sikerült törölni a feladatot.");
      }

      await loadTasks();
    } catch (error) {
      console.error(error);
      alert("Nem sikerült törölni a feladatot.");
    }
  }

  const completed = tasks.filter((task) => Boolean(task.completed)).length;
  const pending = tasks.length - completed;
  const today = getToday();

  let visibleTasks = [...tasks];

  // Nézet szerinti szűrés
  if (activeView === "pending") {
    visibleTasks = visibleTasks.filter((task) => !task.completed);
  }

  if (activeView === "completed") {
    visibleTasks = visibleTasks.filter((task) => Boolean(task.completed));
  }

  // Keresés
  visibleTasks = visibleTasks.filter((task) =>
    `${task.title} ${task.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Prioritás szerinti szűrés
  if (priorityFilter !== "all") {
    visibleTasks = visibleTasks.filter(
      (task) => task.priority === priorityFilter
    );
  }

  // Határidő szerinti rendezés
  if (activeView === "deadlines" || activeView === "overview") {
    visibleTasks.sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return a.due_date.localeCompare(b.due_date);
    });
  }

  const priorityLabel = {
    high: "Magas",
    medium: "Közepes",
    low: "Alacsony",
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ListTodo size={24} />
          </div>
          <span>TaskFlow</span>
        </div>

        <div className="nav-label">MENÜ</div>

        <nav>
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${
                  activeView === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveView(item.id);
                  setSearch("");
                  setPriorityFilter("all");
                }}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">C</div>
          <div>
            <strong>Citromm</strong>
            <small>Task Manager</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">TASKFLOW / WORKSPACE</span>
            <h1>{viewTitles[activeView]}</h1>
            <p>Kövesd nyomon a feladataidat egy helyen.</p>
          </div>

          <div className="today">
            <CalendarDays size={17} />
            {new Date().toLocaleDateString("hu-HU")}
          </div>
        </header>

        {activeView === "overview" && (
          <section className="stats">
            <div className="stat-card">
              <div className="stat-icon blue">
                <ListTodo />
              </div>
              <span>Összes feladat</span>
              <strong>{tasks.length}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <Clock />
              </div>
              <span>Folyamatban</span>
              <strong>{pending}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle2 />
              </div>
              <span>Befejezett</span>
              <strong>{completed}</strong>
            </div>
          </section>
        )}

        <section className="content-grid">
          <div className="task-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  {activeView === "overview"
                    ? "Közelgő feladatok"
                    : viewTitles[activeView]}
                </h2>
                <p>{visibleTasks.length} feladat a listában</p>
              </div>

              <div className="task-tools">
                <div className="search-box">
                  <Search size={17} />
                  <input
                    placeholder="Keresés..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <select
                  className="filter-select"
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  aria-label="Szűrés prioritás szerint"
                >
                  <option value="all">Minden prioritás</option>
                  <option value="high">Magas prioritás</option>
                  <option value="medium">Közepes prioritás</option>
                  <option value="low">Alacsony prioritás</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="empty">Feladatok betöltése...</p>
            ) : visibleTasks.length === 0 ? (
              <p className="empty">Nincs megjeleníthető feladat.</p>
            ) : (
              <div className="task-list">
                {visibleTasks.map((task) => {
                  const overdue =
                    task.due_date &&
                    task.due_date < today &&
                    !task.completed;

                  return (
                    <div className="task-row" key={task.id}>
                      <button
                        className={`check-button ${
                          task.completed ? "checked" : ""
                        }`}
                        onClick={() => toggleTask(task)}
                        title="Állapot módosítása"
                      >
                        {task.completed ? <CheckCircle2 /> : <Circle />}
                      </button>

                      <div className="task-info">
                        <strong className={task.completed ? "done" : ""}>
                          {task.title}
                        </strong>
                        <small>
                          {task.description || "Nincs leírás"}
                        </small>
                      </div>

                      <span className={`priority ${task.priority}`}>
                        <Flag size={13} />
                        {priorityLabel[task.priority] || "Közepes"}
                      </span>

                      <span
                        className={`due-date ${
                          overdue ? "overdue" : ""
                        }`}
                      >
                        {task.due_date || "Nincs határidő"}
                        {overdue ? " · Lejárt" : ""}
                      </span>

                      <button
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                        title="Törlés"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form className="add-panel" onSubmit={addTask}>
            <div className="form-heading">
              <div className="add-icon">
                <Plus />
              </div>
              <h2>Új feladat</h2>
            </div>

            <label>Feladat neve</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Mit kell elvégezni?"
              required
            />

            <label>Leírás</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Részletek..."
              rows="3"
            />

            <label>Prioritás</label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="low">Alacsony</option>
              <option value="medium">Közepes</option>
              <option value="high">Magas</option>
            </select>

            <label>Határidő</label>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />

            <button className="submit-button" type="submit">
              <Plus size={18} />
              Feladat létrehozása
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
