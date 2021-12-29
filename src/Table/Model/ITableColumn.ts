import { IBaseDataModel } from "./IBaseDataModel";
import { Column } from "material-table";

export interface ITableColumn<TEntity extends IBaseDataModel> extends Column<any> {
    fieldName: keyof TEntity;
}
