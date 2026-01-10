import { useReducer, useState } from "react";

const initialState = {
  items: [],
  history: []
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      if (action.name === "") return state;

      return {
        items: [
          ...state.items,
          { name: action.name, active: false, streak: 0 }
        ],
        history: [...state.history, state.items]
      };
    }

    case "TOGGLE_ITEM": {
      return {
        items: state.items.map((item, i) =>
          i === action.index
            ? {
                ...item,
                active: !item.active,
                streak: item.active ? item.streak : item.streak + 1
              }
            : item
        ),
        history: [...state.history, state.items]
      };
    }

    case "DELETE_ITEM": {
      return {
        items: state.items.filter((_, i) => i !== action.index),
        history: [...state.history, state.items]
      };
    }

    case "RESET_ALL": {
      return {
        items: state.items.map(item => ({
          ...item,
          active: false,
          streak: 0
        })),
        history: [...state.history, state.items]
      };
    }

    case "TOGGLE_ALL": {
      return {
        items: state.items.map(item => ({
          ...item,
          active: true
        })),
        history: [...state.history, state.items]
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;

      const previousItems =
        state.history[state.history.length - 1];

      return {
        items: previousItems,
        history: state.history.slice(0, -1)
      };
    }

    default:
      return state;
  }
}

export default function ColorList() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [name, setName] = useState("");

  const { items, history } = state;

  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <div
            onClick={() =>
              dispatch({ type: "TOGGLE_ITEM", index: i })
            }
            className={item.active ? "active" : "not-active"}
            style={{ cursor: "pointer" }}
          >
            {item.name} — streak: {item.streak}
          </div>

          <button
            onClick={() =>
              dispatch({ type: "DELETE_ITEM", index: i })
            }
          >
            Delete
          </button>
        </div>
      ))}

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => dispatch({ type: "RESET_ALL" })}>
          Reset All
        </button>

        <button onClick={() => dispatch({ type: "TOGGLE_ALL" })}>
          Toggle All
        </button>

        <button
          disabled={history.length === 0}
          onClick={() => dispatch({ type: "UNDO" })}
        >
          Undo
        </button>
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New item"
        />
        <button
          onClick={() => {
            dispatch({ type: "ADD_ITEM", name });
            setName("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
