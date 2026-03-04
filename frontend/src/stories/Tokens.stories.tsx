import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Design System/Tokens",
};

export default meta;

type Story = StoryObj;

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "12px",
        alignItems: "center",
        padding: "12px",
        borderRadius: "12px",
        background: "var(--color-surface-elevated)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
      }}
    >
      <div style={{ display: "grid", gap: "4px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
          {name}
        </div>
        <div style={{ opacity: 0.8, fontSize: "var(--text-sm)" }}>{value}</div>
      </div>
      <div
        style={{
          width: "64px",
          height: "32px",
          borderRadius: "9999px",
          background: value,
          border: "1px solid rgba(255, 255, 255, 0.6)",
        }}
      />
    </div>
  );
}

export const Colors: Story = {
  render: () => (
    <div style={{ padding: "24px", display: "grid", gap: "12px" }}>
      <Swatch name="Primary" value="var(--color-primary)" />
      <Swatch name="Secondary" value="var(--color-secondary)" />
      <Swatch name="Background" value="var(--color-background)" />
      <Swatch name="Surface" value="var(--color-surface)" />
      <Swatch name="Neutral 900 (Text)" value="var(--color-neutral-900)" />
    </div>
  ),
};
