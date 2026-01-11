import { useReducer, useState } from "react";

const initialState = {
  columns: {
    todo: [],
    doing: [],
    done: []
  },
  history: []
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK": {
      if (!action.title) return state;

      return {
        columns: {
          ...state.columns,
          todo: [
            ...state.columns.todo,
            { id: Date.now(), title: action.title }
          ]
        },
        history: [...state.history, state]
      };
    }

    case "MOVE_TASK": {
      const { from, to, id } = action;

      const task = state.columns[from].find(t => t.id === id);
      if (!task) return state;

      return {
        columns: {
          ...state.columns,
          [from]: state.columns[from].filter(t => t.id !== id),
          [to]: [...state.columns[to], task]
        },
        history: [...state.history, state]
      };
    }

    case "DELETE_TASK": {
      const { from, id } = action;

      return {
        columns: {
          ...state.columns,
          [from]: state.columns[from].filter(t => t.id !== id)
        },
        history: [...state.history, state]
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;

      const previousState =
        state.history[state.history.length - 1];

      return {
        ...previousState,
        history: state.history.slice(0, -1)
      };
    }

    default:
      return state;
  }
}

export default function Kanban() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [title, setTitle] = useState("");

  const { columns, history } = state;

  function nextColumn(col) {
    if (col === "todo") return "doing";
    if (col === "doing") return "done";
    return "todo";
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New task"
        />
        <button
          onClick={() => {
            dispatch({ type: "ADD_TASK", title });
            setTitle("");
          }}
        >
          Add
        </button>
        <button
          disabled={history.length === 0}
          onClick={() => dispatch({ type: "UNDO" })}
        >
          Undo
        </button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {Object.entries(columns).map(([colName, tasks]) => (
          <div key={colName} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h3>{colName.toUpperCase()}</h3>

            {tasks.map(task => (
              <div key={task.id} style={{ marginBottom: 8 }}>
                <span>{task.title}</span>
                <div>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "MOVE_TASK",
                        from: colName,
                        to: nextColumn(colName),
                        id: task.id
                      })
                    }
                  >
                    Move →
                  </button>

                  <button
                    onClick={() =>
                      dispatch({
                        type: "DELETE_TASK",
                        from: colName,
                        id: task.id
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
