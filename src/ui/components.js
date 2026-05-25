// 轻量组件工具：当前原型以模板字符串为主，这里先沉淀统一 class 组合。
export const uiClass = {
  glass: "ui-glass",
  card: "ui-card",
  pill: "ui-pill",
  primaryButton: "ui-primary-button",
  secondaryButton: "ui-secondary-button",
  iconButton: "ui-icon-button",
  input: "ui-input",
  avatar: "ui-avatar",
  eyebrow: "ui-eyebrow",
};

export function cx(...values) {
  return values.filter(Boolean).join(" ");
}
