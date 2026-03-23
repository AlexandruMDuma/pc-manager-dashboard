import * as React from "react";
import styles from "./MdsButton.module.scss";

export type MdsButtonVariant = "primary" | "secondary";

export interface IMdsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MdsButtonVariant;
}

const MdsButton: React.FC<IMdsButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...rest
}) => {
  const variantClass =
    variant === "secondary" ? styles.secondary : styles.primary;

  const combinedClass = [styles.mdsButton, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={combinedClass} {...rest}>
      {children}
    </button>
  );
};

export default MdsButton;
