import { useEffect, useState } from "react";

export default function AutoSaveNote() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  // 1️⃣ Load from localStorage (ONCE)
  useEffect(() => {
    const savedText = localStorage.getItem("note");
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // 2️⃣ Auto-save when text changes (DEBOUNCED)
  useEffect(() => {
    if (text === "") return;

    setSaved(false);

    const timeout = setTimeout(() => {
      localStorage.setItem("note", text);
      setSaved(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something..."
        rows={5}
        cols={40}
      />
      <div>{saved ? "✅ Saved" : "⏳ Saving..."}</div>
    </div>
  );
}
