
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

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) throw new Error("Nem sikerült betölteni a feladatokat");
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

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        priority,
        due_date: dueDate || null,
      }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      loadTasks();
    }
  }

  async function toggleTask(task) {
    const response = await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });

    if (response.ok) loadTasks();
  }

  async function deleteTask(id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    if (response.ok) loadTasks();
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><ListTodo size={24} /></div>
          <span>TaskFlow</span>
        </div>

        <div className="nav-label">MENÜ</div>
        <nav>
          <a className="nav-item active"><LayoutDashboard size={19} /> Áttekintés</a>
          <a className="nav-item"><ListTodo size={19} /> Feladataim</a>
          <a className="nav-item"><CalendarDays size={19} /> Határidők</a>
          <a className="nav-item"><CheckCircle2 size={19} /> Befejezett</a>
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
            <span className="eyebrow">WORKSPACE / OVERVIEW</span>
            <h1>Áttekintés</h1>
            <p>Kövesd nyomon a feladataidat egy helyen.</p>
          </div>
          <div className="today">
            <CalendarDays size={17} />
            {new Date().toLocaleDateString("hu-HU")}
          </div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon blue"><ListTodo /></div>
            <span>Összes feladat</span>
            <strong>{tasks.length}</strong>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Clock /></div>
            <span>Folyamatban</span>
            <strong>{pending}</strong>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><CheckCircle2 /></div>
            <span>Befejezett</span>
            <strong>{completed}</strong>
          </div>
        </section>

        <section className="content-grid">
          <div className="task-panel">
            <div className="panel-heading">
              <div>
                <h2>Feladataim</h2>
                <p>{tasks.length} feladat a listában</p>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  placeholder="Keresés..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <p className="empty">Betöltés...</p>
            ) : filteredTasks.length === 0 ? (
              <p className="empty">Nincs megjeleníthető feladat.</p>
            ) : (
              <div className="task-list">
                {filteredTasks.map((task) => (
                  <div className="task-row" key={task.id}>
                    <button
                      className={`check-button ${task.completed ? "checked" : ""}`}
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
                      {task.priority === "high" ? "Magas" :
                       task.priority === "low" ? "Alacsony" : "Közepes"}
                    </span>

                    <span className="due-date">
                      {task.due_date || "Nincs határidő"}
                    </span>

                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                      title="Törlés"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form className="add-panel" onSubmit={addTask}>
            <div className="form-heading">
              <div className="add-icon"><Plus /></div>
              <h2>Új feladat</h2>
            </div>

            <label>Feladat neve</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Mit kell elvégezni?"
              required
            />

            <label>Leírás</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Részletek..."
              rows="3"
            />

            <label>Prioritás</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Alacsony</option>
              <option value="medium">Közepes</option>
              <option value="high">Magas</option>
            </select>

            <label>Határidő</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button className="submit-button" type="submit">
              <Plus size={18} /> Feladat létrehozása
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
