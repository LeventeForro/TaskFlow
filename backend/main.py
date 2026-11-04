
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_connection, create_tables
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Adatbázis inicializálása
create_tables()


# Adatmodellek
class TaskCreate(BaseModel):
    title: str
    description: str = ""
    priority: str = "medium"
    due_date: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None


# Feladatok lekérése
@app.get("/tasks")
def get_tasks():
    connection = get_connection()
    tasks = connection.execute(
        "SELECT * FROM tasks ORDER BY id DESC"
    ).fetchall()
    connection.close()

    return [dict(task) for task in tasks]


# Új feladat létrehozása
@app.post("/tasks")
def create_task(task: TaskCreate):
    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO tasks (title, description, priority, due_date)
        VALUES (?, ?, ?, ?)
        """,
        (task.title, task.description, task.priority, task.due_date)
    )

    connection.commit()
    task_id = cursor.lastrowid

    new_task = connection.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()

    connection.close()

    return dict(new_task)


# Feladat módosítása
@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskUpdate):
    connection = get_connection()

    existing_task = connection.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()

    if existing_task is None:
        connection.close()
        raise HTTPException(status_code=404, detail="Task not found")

    updates = task.model_dump(exclude_unset=True)

    if not updates:
        connection.close()
        raise HTTPException(status_code=400, detail="No update data provided")

    for field, value in updates.items():
        connection.execute(
            f"UPDATE tasks SET {field} = ? WHERE id = ?",
            (value, task_id)
        )

    connection.commit()

    updated_task = connection.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()

    connection.close()

    return dict(updated_task)


# Feladat törlése
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    connection = get_connection()

    cursor = connection.execute(
        "DELETE FROM tasks WHERE id = ?",
        (task_id,)
    )

    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully"}
