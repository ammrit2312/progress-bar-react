import { useRef, useState, useEffect } from "react";
import styles from "./index.module.css";

const ProgressBar = () => {
  const progressBarRef = useRef();
  const [dragging, setDragging] = useState();
  const [maxWidth, setMaxWidth] = useState();
  const [handleVals, setHandleVals] = useState({ h1: 150, h2: 400 });

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const onMouseMove = (e) => {
    if (!dragging) return;

    const parentRect = progressBarRef.current.getBoundingClientRect();
    let x = clamp(e.clientX - parentRect.left, 0, getBarWidth());

    if (dragging === "h1") {
      x = Math.min(x, handleVals.h2);
    } else {
      x = Math.max(x, handleVals.h1);
    }

    setHandleVals((prevVal) => ({
      ...prevVal,
      [dragging]: x,
    }));
  };

  const onMouseUp = () => setDragging();

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    setMaxWidth(getBarWidth());
  }, [progressBarRef]);

  const getBarWidth = () => progressBarRef?.current?.offsetWidth || 1;

  const { h1, h2 } = handleVals;
  const min = Math.min(h1, h2);
  const max = Math.max(h1, h2);

  const part1 = (min * 100) / maxWidth;
  const part2 = ((max - min) * 100) / maxWidth;
  const part3 = ((maxWidth - max) * 100) / maxWidth;

  return (
    <div className={styles.container} ref={progressBarRef}>
      <div className={styles.progressBarContainer}>
        <div
          className={`${styles.bar} ${styles.red}`}
          style={{ width: `${min}px`, left: 0 }}
        />
        <div
          className={`${styles.bar} ${styles.amber}`}
          style={{ width: `${max - min}px`, left: `${min}px` }}
        />
        <div
          className={`${styles.bar} ${styles.green}`}
          style={{ width: `${maxWidth - max}px`, left: `${max}px` }}
        />
        <div
          className={`${styles.handle} ${styles.handle1}`}
          onMouseDown={() => setDragging("h1")}
          style={{ left: `${min-10}px` }}
        />
        <div
          className={`${styles.handle} ${styles.handle2}`}
          onMouseDown={() => setDragging("h2")}
          style={{ left: `${max-10}px` }}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <div>Part 1: {part1}</div>
        <div>Part 2: {part2}</div>
        <div>Part 3: {part3}</div>
      </div>
    </div>
  );
};

export default ProgressBar;
