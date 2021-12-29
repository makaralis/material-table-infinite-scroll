export interface ITableOptions {
  expanded?: boolean;
  columnsButton?: boolean;
  exportButton?: boolean;
  exportDelimiter?: string;
  exportFileName?: string;
  exportCsv?: (columns: any[], renderData: any[]) => void;
  canFilter?: boolean;
  showHeader?: boolean;
  headerStyle?: React.CSSProperties;
  maxBodyHeight?: number | string;
  grouping?: boolean;
  rowStyle?: React.CSSProperties | ((data: any) => React.CSSProperties);
  showEmptyDataSourceMessage?: boolean;
  showSelectAllCheckbox?: boolean;
  showSearch?: boolean;
  showSelection?: boolean;
  canSort?: boolean;
  showToolbar?: boolean;
  toolbarButtonAlignment?: "left" | "right";
  sticky?: boolean;
  searchFieldStyle?: React.CSSProperties;
  icons?: IIconOptions;
}

export interface IIconOptions {
  Search?: any;
  SortArrow?: React.ForwardRefExoticComponent<
    React.RefAttributes<SVGSVGElement>
  >;
}
