"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Moon, Sun, Plus, X, Check, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "next-themes"

type Todo = {
  id: string
  text: string
  completed: boolean
}

export default function TodoApp() {
  // State for todos
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // Add a new todo
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() === "") return

    const newItem: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    }

    setTodos([...todos, newItem])
    setNewTodo("")
  }

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Toggle todo completion status
  const toggleComplete = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Start editing a todo
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  // Save edited todo
  const saveEdit = () => {
    if (editText.trim() === "") return

    setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editText } : todo)))
    setEditingId(null)
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
  }

  // Filter todos based on current filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen flex flex-col items-center p-4 pt-8 md:pt-16 transition-colors">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Advanced Todo List</h1>
            <ThemeToggle />
          </div>

          {/* Add todo form */}
          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add task</span>
            </Button>
          </form>

          {/* Filter buttons */}
          <div className="flex gap-2 mb-4">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
            {todos.some((todo) => todo.completed) && (
              <Button variant="outline" size="sm" className="ml-auto" onClick={clearCompleted}>
                Clear completed
              </Button>
            )}
          </div>

          {/* Todo list */}
          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                {filter === "all"
                  ? "Add your first task!"
                  : filter === "active"
                    ? "No active tasks"
                    : "No completed tasks"}
              </p>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full border"
                    onClick={() => toggleComplete(todo.id)}
                  >
                    {todo.completed && <Check className="h-3 w-3" />}
                    <span className="sr-only">{todo.completed ? "Mark as incomplete" : "Mark as complete"}</span>
                  </Button>

                  {editingId === todo.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" onClick={saveEdit}>
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Save</span>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancel</span>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                        {todo.text}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => startEditing(todo)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Todo count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {todos.filter((todo) => !todo.completed).length} items left
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
