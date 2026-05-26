import { useState, useMemo, useCallback, useRef, useEffect } from "react";

const FONT_FAMILY = "'Inter', 'Helvetica Neue', Arial, sans-serif";

const COLORS = {
  pink50: "#fff1f7",
  pink100: "#ffe4ef",
  pink200: "#ffc9de",
  pink300: "#f89abb",
  pink400: "#ec6f9d",
  pink500: "#d9467f",
  pink600: "#bd2f68",
  pink700: "#9d2557",

  plum900: "#321424",
  plum800: "#4a1938",
  plum700: "#6d2855",
  plum600: "#87406c",

  sage50: "#f2faf6",
  sage100: "#e0f2e8",
  sage500: "#5b8f76",
  sage600: "#46745f",

  teal50: "#eefafb",
  teal100: "#d8f1f3",
  teal500: "#43a6af",
  teal600: "#2f8f9d",

  gold50: "#fff9eb",
  gold100: "#fff0c7",
  gold500: "#c88a2e",

  surface: "#ffffff",
  surfaceSoft: "#fff8fb",
  textMain: "#34202d",
  textMuted: "#8d6d7f",
  textLight: "#b69aac",
  borderSoft: "#f3cfe0",
  borderMedium: "#e7aac4",
  shadowPink: "rgba(157, 37, 87, 0.08)",
};

const CATEGORIES = [
  { id: "programs", label: "Programs", icon: "◈" },
  { id: "conferences", label: "Conferences / Speaking", icon: "◉" },
  { id: "admin", label: "Administrative", icon: "◆" },
  { id: "network", label: "Network Engagement", icon: "◇" },
];

const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

const PROGRAM_COLORS = [
  COLORS.pink600,
  COLORS.plum700,
  COLORS.pink500,
  COLORS.teal600,
  COLORS.sage500,
  COLORS.gold500,
  COLORS.pink400,
  COLORS.plum600,
  COLORS.teal500,
  COLORS.sage600,
];

const PRIORITY_COLORS = {
  High: COLORS.pink700,
  Medium: COLORS.gold500,
  Low: COLORS.sage500,
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/* ─── Dropdown helper ─── */
function Dropdown({ trigger, children, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            [align]: 0,
            zIndex: 999,
            background: COLORS.surface,
            border: `1px solid ${COLORS.borderSoft}`,
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(157, 37, 87, 0.13)",
            minWidth: 200,
            padding: "6px 0",
            marginTop: 4,
            fontFamily: FONT_FAMILY,
          }}
        >
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

/* ─── Modal ─── */
function Modal({ open, onClose, children, title }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(74, 25, 56, 0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface,
          borderRadius: 16,
          padding: "28px 32px",
          minWidth: 360,
          maxWidth: 480,
          width: "90%",
          boxShadow: "0 16px 48px rgba(157, 37, 87, 0.18)",
          fontFamily: FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: COLORS.plum800, fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: COLORS.pink600,
              fontFamily: FONT_FAMILY,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Pill / Tag ─── */
function Tag({ label, color, small, onRemove }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: color + "1a",
        color,
        fontWeight: 600,
        fontSize: small ? 10.5 : 12,
        padding: small ? "2px 8px" : "3px 10px",
        borderRadius: 20,
        letterSpacing: 0.2,
        whiteSpace: "nowrap",
        fontFamily: FONT_FAMILY,
      }}
    >
      {label}
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{ cursor: "pointer", marginLeft: 2, fontSize: 11, opacity: 0.7 }}
        >
          ✕
        </span>
      )}
    </span>
  );
}

/* ─── Progress bar ─── */
function ProgressBar({ value, size = "md" }) {
  const h = size === "sm" ? 5 : 8;

  return (
    <div
      style={{
        background: COLORS.pink100,
        borderRadius: 99,
        height: h,
        width: size === "sm" ? 60 : 100,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          borderRadius: 99,
          background:
            value === 100
              ? `linear-gradient(90deg, ${COLORS.sage500}, ${COLORS.teal600})`
              : `linear-gradient(90deg, ${COLORS.pink400}, ${COLORS.pink600})`,
          transition: "width .4s ease",
        }}
      />
    </div>
  );
}

/* ─── Calendar View ─── */
function CalendarView({ tasks, programs, onTaskClick }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const progColorMap = useMemo(() => {
    const map = {};
    programs.forEach((p, i) => {
      map[p.id] = PROGRAM_COLORS[i % PROGRAM_COLORS.length];
    });
    return map;
  }, [programs]);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      if (!map[t.dueDate]) map[t.dueDate] = [];
      map[t.dueDate].push(t);
    });
    return map;
  }, [tasks]);

  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(<div key={`e${i}`} />);

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayTasks = tasksByDate[dateStr] || [];
    const isToday = dateStr === todayStr();

    cells.push(
      <div
        key={d}
        style={{
          minHeight: 80,
          padding: "4px 6px",
          border: `1px solid ${isToday ? COLORS.pink300 : COLORS.pink100}`,
          borderRadius: 8,
          background: isToday ? COLORS.pink50 : COLORS.surface,
          fontSize: 11,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 12,
            marginBottom: 3,
            color: isToday ? COLORS.pink700 : COLORS.textMuted,
          }}
        >
          {d}
        </div>

        {dayTasks.slice(0, 3).map((t) => {
          const prog = programs.find((p) => p.id === t.programId);
          const col = prog ? progColorMap[prog.id] : COLORS.pink500;

          return (
            <div
              key={t.id}
              onClick={() => onTaskClick && onTaskClick(t)}
              style={{
                background: col + "22",
                color: col,
                fontWeight: 600,
                fontSize: 10,
                padding: "2px 5px",
                borderRadius: 4,
                marginBottom: 2,
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                borderLeft: `3px solid ${col}`,
              }}
            >
              {t.title}
            </div>
          );
        })}

        {dayTasks.length > 3 && (
          <div style={{ fontSize: 9, color: COLORS.pink600, fontWeight: 600 }}>
            +{dayTasks.length - 3} more
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => setMonthOffset(monthOffset - 1)} style={calNavBtn}>
          ‹
        </button>
        <span
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: COLORS.plum800,
            minWidth: 180,
            textAlign: "center",
          }}
        >
          {monthLabel}
        </span>
        <button onClick={() => setMonthOffset(monthOffset + 1)} style={calNavBtn}>
          ›
        </button>
        <button
          onClick={() => setMonthOffset(0)}
          style={{
            ...calNavBtn,
            fontSize: 11,
            padding: "4px 12px",
            marginLeft: 4,
          }}
        >
          Today
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 4 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.pink600,
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>{cells}</div>
    </div>
  );
}

const calNavBtn = {
  background: COLORS.pink50,
  border: `1px solid ${COLORS.borderSoft}`,
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 18,
  color: COLORS.pink600,
  fontWeight: 700,
  padding: "4px 10px",
  lineHeight: 1,
  fontFamily: FONT_FAMILY,
};

/* ═══════════════ MAIN APP ═══════════════ */
export default function ProjectManager() {
  const [tasks, setTasks] = useState([
    {
      id: uid(),
      title: "Draft keynote abstract",
      category: "conferences",
      programId: null,
      groupLabel: "Q3 Conference Prep",
      dueDate: "2026-06-10",
      priority: "High",
      done: false,
    },
    {
      id: uid(),
      title: "Submit speaker bio",
      category: "conferences",
      programId: null,
      groupLabel: "Q3 Conference Prep",
      dueDate: "2026-06-15",
      priority: "Medium",
      done: false,
    },
    {
      id: uid(),
      title: "Review grant deliverables",
      category: "programs",
      programId: null,
      groupLabel: null,
      dueDate: "2026-05-28",
      priority: "High",
      done: false,
    },
    {
      id: uid(),
      title: "Update org chart",
      category: "admin",
      programId: null,
      groupLabel: "Quarterly Updates",
      dueDate: "2026-06-01",
      priority: "Low",
      done: true,
    },
    {
      id: uid(),
      title: "Send partner newsletter",
      category: "network",
      programId: null,
      groupLabel: null,
      dueDate: "2026-06-05",
      priority: "Medium",
      done: false,
    },
  ]);

  const [programs, setPrograms] = useState([]);
  const [view, setView] = useState("list");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const [taskModal, setTaskModal] = useState(false);
  const [programModal, setProgramModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "programs",
    programId: "",
    groupLabel: "",
    dueDate: "",
    priority: "Medium",
  });

  const [newProgram, setNewProgram] = useState("");

  const progColorMap = useMemo(() => {
    const map = {};
    programs.forEach((p, i) => {
      map[p.id] = PROGRAM_COLORS[i % PROGRAM_COLORS.length];
    });
    return map;
  }, [programs]);

  const openNewTask = (cat) => {
    setEditingTask(null);
    setForm({
      title: "",
      category: cat || "programs",
      programId: "",
      groupLabel: "",
      dueDate: "",
      priority: "Medium",
    });
    setTaskModal(true);
  };

  const openEditTask = (t) => {
    setEditingTask(t);
    setForm({
      title: t.title,
      category: t.category,
      programId: t.programId || "",
      groupLabel: t.groupLabel || "",
      dueDate: t.dueDate || "",
      priority: t.priority || "Medium",
    });
    setTaskModal(true);
  };

  const saveTask = () => {
    if (!form.title.trim()) return;

    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...form } : t)));
    } else {
      setTasks((prev) => [...prev, { id: uid(), ...form, done: false }]);
    }

    setTaskModal(false);
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const toggleDone = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const addProgram = () => {
    if (!newProgram.trim() || programs.find((p) => p.label.toLowerCase() === newProgram.trim().toLowerCase())) {
      return;
    }

    setPrograms((prev) => [...prev, { id: uid(), label: newProgram.trim() }]);
    setNewProgram("");
  };

  const removeProgram = (id) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.map((t) => (t.programId === id ? { ...t, programId: null } : t)));
  };

  const filtered = useMemo(() => {
    let list = [...tasks];

    if (activeCategory !== "all") list = list.filter((t) => t.category === activeCategory);
    if (filterProgram !== "all") list = list.filter((t) => t.programId === filterProgram);
    if (filterPriority !== "all") list = list.filter((t) => t.priority === filterPriority);

    list.sort((a, b) => {
      if (sortBy === "dueDate") return (a.dueDate || "9999") < (b.dueDate || "9999") ? -1 : 1;
      if (sortBy === "program") return (a.programId || "") < (b.programId || "") ? -1 : 1;

      if (sortBy === "priority") {
        const ord = { High: 0, Medium: 1, Low: 2 };
        return (ord[a.priority] ?? 3) - (ord[b.priority] ?? 3);
      }

      return 0;
    });

    return list;
  }, [tasks, activeCategory, filterProgram, filterPriority, sortBy]);

  const grouped = useMemo(() => {
    const map = new Map();

    filtered.forEach((t) => {
      const key = t.groupLabel || "__ungrouped__";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });

    return map;
  }, [filtered]);

  const catProgress = (catId) => {
    const catTasks = catId === "all" ? tasks : tasks.filter((t) => t.category === catId);
    if (!catTasks.length) return 0;
    return Math.round((catTasks.filter((t) => t.done).length / catTasks.length) * 100);
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${COLORS.borderSoft}`,
    fontSize: 13,
    fontFamily: FONT_FAMILY,
    outline: "none",
    background: COLORS.surfaceSoft,
    transition: "border .2s, box-shadow .2s",
    color: COLORS.textMain,
    boxSizing: "border-box",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    background: `${COLORS.surfaceSoft} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23d9467f'/%3E%3C/svg%3E") no-repeat right 12px center`,
  };

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        background: `linear-gradient(135deg, ${COLORS.pink50} 0%, ${COLORS.pink100} 42%, ${COLORS.teal100} 100%)`,
        minHeight: "100vh",
        padding: "24px 20px",
        color: COLORS.textMain,
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1020, margin: "0 auto 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: COLORS.plum800,
                letterSpacing: -0.5,
              }}
            >
              <span style={{ opacity: 0.55, marginRight: 8 }}>◈</span>
              Strategic Program Dashboard
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: COLORS.textMuted,
                fontWeight: 500,
              }}
            >
              {tasks.length} tasks · {tasks.filter((t) => t.done).length} completed · {programs.length} programs
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setProgramModal(true)} style={headerBtn}>
              ✦ Manage Programs
            </button>
            <button
              onClick={() => openNewTask(activeCategory !== "all" ? activeCategory : "programs")}
              style={{
                ...headerBtn,
                background: `linear-gradient(135deg, ${COLORS.pink500}, ${COLORS.pink700})`,
                color: "#fff",
                border: "none",
              }}
            >
              + New Task
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: "0 auto" }}>
        {/* Category tabs + view toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <TabBtn active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
              All <span style={{ opacity: 0.7, marginLeft: 4, fontSize: 11 }}>{catProgress("all")}%</span>
            </TabBtn>

            {CATEGORIES.map((c) => (
              <TabBtn key={c.id} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)}>
                {c.icon} {c.label}{" "}
                <span style={{ opacity: 0.7, marginLeft: 4, fontSize: 11 }}>{catProgress(c.id)}%</span>
              </TabBtn>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              background: COLORS.surface,
              borderRadius: 10,
              border: `1px solid ${COLORS.borderSoft}`,
              overflow: "hidden",
            }}
          >
            {["list", "calendar"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "6px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background:
                    view === v ? `linear-gradient(135deg, ${COLORS.pink500}, ${COLORS.pink700})` : "transparent",
                  color: view === v ? "#fff" : COLORS.textMuted,
                  fontFamily: FONT_FAMILY,
                  transition: "all .2s",
                }}
              >
                {v === "list" ? "☰ List" : "▦ Calendar"}
              </button>
            ))}
          </div>
        </div>

        {/* Filters row */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 18,
            padding: "10px 16px",
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.borderSoft}`,
            boxShadow: `0 2px 12px ${COLORS.shadowPink}`,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.plum600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Filters
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ ...selectStyle, width: "auto", padding: "5px 28px 5px 10px", fontSize: 12 }}
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="program">Sort: Program</option>
            <option value="priority">Sort: Priority</option>
          </select>

          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            style={{ ...selectStyle, width: "auto", padding: "5px 28px 5px 10px", fontSize: 12 }}
          >
            <option value="all">All Programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ ...selectStyle, width: "auto", padding: "5px 28px 5px 10px", fontSize: 12 }}
          >
            <option value="all">All Priorities</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {(filterProgram !== "all" || filterPriority !== "all") && (
            <button
              onClick={() => {
                setFilterProgram("all");
                setFilterPriority("all");
              }}
              style={{
                background: "none",
                border: "none",
                color: COLORS.pink600,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: FONT_FAMILY,
              }}
            >
              ✕ Clear
            </button>
          )}

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: COLORS.textMuted,
            }}
          >
            <span style={{ fontWeight: 700, color: COLORS.plum700 }}>{filtered.length}</span> tasks
            <ProgressBar
              value={filtered.length ? Math.round((filtered.filter((t) => t.done).length / filtered.length) * 100) : 0}
              size="sm"
            />
          </div>
        </div>

        {/* Main Content */}
        {view === "calendar" ? (
          <div
            style={{
              background: COLORS.surface,
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${COLORS.borderSoft}`,
              boxShadow: `0 4px 20px ${COLORS.shadowPink}`,
            }}
          >
            <CalendarView tasks={filtered} programs={programs} onTaskClick={openEditTask} />
          </div>
        ) : (
          <div>
            {[...grouped.entries()].map(([label, groupTasks]) => (
              <div key={label} style={{ marginBottom: 18 }}>
                {label !== "__ungrouped__" && (
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: COLORS.plum700,
                      padding: "6px 14px",
                      marginBottom: 6,
                      background: `linear-gradient(90deg, ${COLORS.pink100}, transparent)`,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 10 }}>▸</span> {label}
                    <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.pink600, opacity: 0.8 }}>
                      {groupTasks.filter((t) => t.done).length}/{groupTasks.length}
                    </span>
                    <ProgressBar
                      value={Math.round((groupTasks.filter((t) => t.done).length / groupTasks.length) * 100)}
                      size="sm"
                    />
                  </div>
                )}

                {groupTasks.map((t) => {
                  const cat = CATEGORIES.find((c) => c.id === t.category);
                  const prog = programs.find((p) => p.id === t.programId);
                  const overdue = t.dueDate && t.dueDate < todayStr() && !t.done;

                  return (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        background: overdue ? COLORS.surfaceSoft : COLORS.surface,
                        borderRadius: 12,
                        marginBottom: 4,
                        border: `1px solid ${overdue ? COLORS.pink400 : COLORS.borderSoft}`,
                        boxShadow: `0 1px 4px ${COLORS.shadowPink}`,
                        opacity: t.done ? 0.6 : 1,
                        transition: "all .2s",
                      }}
                    >
                      <div
                        onClick={() => toggleDone(t.id)}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          border: `2px solid ${t.done ? COLORS.sage500 : COLORS.borderMedium}`,
                          background: t.done ? COLORS.sage500 : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all .2s",
                        }}
                      >
                        {t.done && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: COLORS.textMain,
                            textDecoration: t.done ? "line-through" : "none",
                            cursor: "pointer",
                          }}
                          onClick={() => openEditTask(t)}
                        >
                          {t.title}
                        </div>

                        <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                          {cat && <Tag label={cat.label} color={COLORS.plum700} small />}
                          {prog && <Tag label={prog.label} color={progColorMap[prog.id] || COLORS.pink600} small />}
                          {t.priority && <Tag label={t.priority} color={PRIORITY_COLORS[t.priority]} small />}
                        </div>
                      </div>

                      {t.dueDate && (
                        <div
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            color: overdue ? COLORS.pink700 : COLORS.textMuted,
                          }}
                        >
                          {overdue && "⚠ "}
                          {formatDate(t.dueDate)}
                        </div>
                      )}

                      <button
                        onClick={() => deleteTask(t.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: COLORS.textLight,
                          fontSize: 16,
                          padding: 4,
                          lineHeight: 1,
                          flexShrink: 0,
                          fontFamily: FONT_FAMILY,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}

            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 48,
                  color: COLORS.pink600,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                No tasks match your filters.
                <br />
                <button
                  onClick={() => openNewTask()}
                  style={{
                    ...headerBtn,
                    marginTop: 12,
                    background: `linear-gradient(135deg, ${COLORS.pink500}, ${COLORS.pink700})`,
                    color: "#fff",
                    border: "none",
                  }}
                >
                  + Create one
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Task Modal ─── */}
      <Modal open={taskModal} onClose={() => setTaskModal(false)} title={editingTask ? "Edit Task" : "New Task"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Task Title</label>
            <input
              style={inputStyle}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && saveTask()}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={selectStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Program Tag</label>
              <select
                style={selectStyle}
                value={form.programId}
                onChange={(e) => setForm({ ...form, programId: e.target.value })}
              >
                <option value="">None</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input
                type="date"
                style={inputStyle}
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label style={labelStyle}>Priority</label>
              <select style={selectStyle} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              Group Label{" "}
              <span style={{ fontWeight: 400, color: COLORS.textLight }}>
                (optional — groups tasks under a heading)
              </span>
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. Q3 Conference Prep"
              value={form.groupLabel}
              onChange={(e) => setForm({ ...form, groupLabel: e.target.value })}
            />
          </div>

          <button
            onClick={saveTask}
            style={{
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: `linear-gradient(135deg, ${COLORS.pink500}, ${COLORS.pink700})`,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              fontFamily: FONT_FAMILY,
              marginTop: 4,
            }}
          >
            {editingTask ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </Modal>

      {/* ─── Program Manager Modal ─── */}
      <Modal open={programModal} onClose={() => setProgramModal(false)} title="Manage Programs">
        <p style={{ fontSize: 12.5, color: COLORS.textMuted, margin: "0 0 14px" }}>
          Add programs to tag your tasks. Colors are assigned automatically.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="New program name…"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addProgram()}
          />

          <button
            onClick={addProgram}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: `linear-gradient(135deg, ${COLORS.pink500}, ${COLORS.pink700})`,
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              fontFamily: FONT_FAMILY,
            }}
          >
            Add
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {programs.length === 0 && (
            <span style={{ fontSize: 12, color: COLORS.textLight }}>No programs yet — add one above.</span>
          )}

          {programs.map((p, i) => (
            <Tag
              key={p.id}
              label={p.label}
              color={PROGRAM_COLORS[i % PROGRAM_COLORS.length]}
              onRemove={() => removeProgram(p.id)}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

/* Tab button component */
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 10,
        border: `1.5px solid ${active ? COLORS.pink600 : COLORS.borderSoft}`,
        background: active ? `linear-gradient(135deg, ${COLORS.pink500}, ${COLORS.pink700})` : COLORS.surface,
        color: active ? "#fff" : COLORS.plum700,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: FONT_FAMILY,
        transition: "all .2s",
        display: "flex",
        alignItems: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

const headerBtn = {
  padding: "8px 16px",
  borderRadius: 10,
  border: `1.5px solid ${COLORS.borderSoft}`,
  background: COLORS.surface,
  color: COLORS.plum700,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: FONT_FAMILY,
  transition: "all .2s",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.plum700,
  marginBottom: 4,
};
