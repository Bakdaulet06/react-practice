import { useEffect, useState } from "react"

export default function Timer() {
  const [count, setCount] = useState(0)
  const [isActive, setIsActive] = useState(false)

  // Timer effect
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  // Warnings
  useEffect(() => {
    if (count === 5) alert("5 seconds left")
    if (count === 10) {
      alert("You are inactive")
      setIsActive(false)
    }
  }, [count])

  return (
    <>
      <div>{count}</div>
      <div>
        <button onClick={() => setIsActive(true)}>Start</button>
        <button onClick={() => {
          setIsActive(false)
          setCount(0)
        }}>
          Reset
        </button>
      </div>
    </>
  )
}
