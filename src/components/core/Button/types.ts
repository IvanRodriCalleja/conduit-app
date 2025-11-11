import { ButtonHTMLAttributes, Component, ReactElement } from 'react';
import { LinkProps } from 'react-router-dom';

export type ButtonType = ButtonHTMLAttributes<Element>['type'];

export const BUTTON_VARIANTS = ['icon', 'link', 'primary', 'red', 'secondary'] as const;
export const BUTTON_CONTENT_POSITION = ['left', 'center', 'right'] as const;
export const BUTTON_PADDING = ['small', 'none', 'normal', 'big'] as const;
export const BUTTON_WIDTHS = ['adapting', 'auto', 'medium', 'normal'] as const;
export type ButtonVariant = typeof BUTTON_VARIANTS[number];
type ButtonContentPosition = typeof BUTTON_CONTENT_POSITION[number];
type ButtonPadding = typeof BUTTON_PADDING[number];
export type ButtonWidth = typeof BUTTON_WIDTHS[number];

export interface ButtonProps {
  Icon?: Component | ReactElement | null;
  className?: string;
  contentPosition?: ButtonContentPosition;
  dataTest?: string;
  href?: string;
  iconPosition?: 'left' | 'right';
  iconSize?: 'regular' | 'small' | 'extraSmall';
  isDisabled?: boolean;
  isLoading?: boolean;
  label?: string;
  labelMobile?: string;
  onClick?: ((event: Event) => void) | (() => void);
  padding?: ButtonPadding;
  rel?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  to?: LinkProps['to'];
  type?: ButtonType;
  variant?: ButtonVariant;
  width?: ButtonWidth;
}
