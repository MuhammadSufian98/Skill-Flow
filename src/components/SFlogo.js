export function SkillFlowLogo({ className = "" }) {
  return (
    <svg
      viewBox="0 8 26 36"
      width="36"
      height="36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible", display: "block" }}
    >
      <rect
        x="6"
        y="6"
        width="20"
        height="5"
        rx="2.5"
        transform="rotate(45 6 6)"
        fill="#1DE6EE"
      />
      <rect
        x="6"
        y="16"
        width="20"
        height="5"
        rx="2.5"
        transform="rotate(45 6 16)"
        fill="#5587F1"
      />
      <rect
        x="6"
        y="26"
        width="20"
        height="5"
        rx="2.5"
        transform="rotate(45 6 26)"
        fill="#A550F0"
      />
    </svg>
  );
}
