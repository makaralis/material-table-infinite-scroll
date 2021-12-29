import { IconName } from "@fortawesome/fontawesome-svg-core";

//to do: be able to access row data outside of the component for different custom cases when some logic is needed for disabled or other properties
export interface IContextMenuAction {
  label: string;
  isDisabled?: (data: any) => boolean;
  iconName?: IconName;
  isFreeAction?: boolean;
  tooltip?: string;
  onClick?: (event: any, data: any) => void;
  isVisible?: (data: any) => boolean;
  isVisibleRule?: IContextMenuActionVisibilityRule;
}

export interface IContextMenuActionVisibilityRule {
  column: string;
  isTypeOf: string;
}
