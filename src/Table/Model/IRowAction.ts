import { Action } from "material-table";

//to do: be able to access row data outside of the component for different custom cases when some logic is needed for disabled or other properties
export interface IRowAction extends Action<any> {
  isVisible?: (data: any) => boolean;
  tooltip?: string;
  isDisabled?: (data: any) => boolean;
}
