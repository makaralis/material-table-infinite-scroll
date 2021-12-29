import React, { Component } from "react";
import { IBaseDataModel } from "./Model/IBaseDataModel";
import { ITableColumn } from "./Model/ITableColumn";
import { IContextMenuAction } from "./Model/IContextMenuAction";
import { getTableStyles } from "./Table.styles";
import MaterialTable, {
  Column,
  Options,
  Localization,
  DetailPanel,
  Components
} from "material-table";
import { ITableOptions, IIconOptions } from "./Model/ITableOptions";
import { TableRowActions } from "./TableRowActions/TableRowActions";
import { IRowAction } from "./Model/IRowAction";
import { isEqual } from "underscore";

interface ITableState<TEntity> {
  error: Error;
  hasMore: boolean;
  isLoading: boolean;
  items?: TEntity[];
  selectedItems?: TEntity[];
}

export interface ITableStateToProps<TEntity> {
  items?: TEntity[];
  hasMore?: boolean;
  columns?: Array<ITableColumn<TEntity>>;
}

export interface ITableProps<TEntity> extends ITableStateToProps<TEntity> {
  contextMenuActions?: IContextMenuAction[];
  rowActions?: IRowAction[];
  options?: ITableOptions;
  components?: Components;
  headerText?: string;
  height?: string;
  detailPanel?:
    | ((rowData: any) => React.ReactNode)
    | Array<DetailPanel<any> | ((rowData: any) => DetailPanel<any>)>;
  onSelectionChange?: (items: TEntity[]) => void;
  onRowClick?: (
    event?: React.MouseEvent,
    rowData?: any,
    toggleDetailPanel?: (panelIndex?: number) => void
  ) => void;
  onOrderChange?: (orderBy: number, orderDirection: "asc" | "desc") => void;
  loadMoreItems?: () => Promise<TEntity[]>;
  onColumnDragged?: (sourceIndex: number, destinationIndex: number) => void;
  loadingMessage?: string;
  editable?: boolean;
  localization?: Localization;
  editableActions?: {
    onRowAdd?: (newData: TEntity) => Promise<void>;
    onRowUpdate?: (newData: TEntity, oldData?: TEntity) => Promise<void>;
    onRowDelete?: (oldData: TEntity) => Promise<void>;
  };
  hasMore?: boolean;
  contextMenuTooltip?: string;
  icons?: IIconOptions;
  disableSortOnActions?: boolean;
  selectionIdProperty?: string;
}

export class Table<TEntity extends IBaseDataModel> extends Component<
  ITableProps<TEntity>,
  ITableState<TEntity>
> {
  private scrollRef = React.createRef<HTMLDivElement>();
  constructor(props: ITableProps<TEntity>) {
    super(props);
    this.state = {
      error: null,
      hasMore: true,
      isLoading: false,
      items: [],
      selectedItems: []
    };
  }
  public componentDidMount() {
    if (this.props.items) {
      this.setState({
        isLoading: false,
        items: [...this.state.items, ...this.props.items]
      });
    }
  }

  public componentWillReceiveProps(nextProps: ITableProps<TEntity>) {
    let updateItems = false;
    if (nextProps.items.length !== this.props.items.length) {
      updateItems = true;
    }

    if (nextProps.items.length === this.props.items.length) {
      if (!isEqual(nextProps.items, this.props.items)) {
        updateItems = true;
      }
    }

    if (updateItems) {
      this.setState({
        isLoading: false,
        items: nextProps.items
      });
    }
  }

  public render(): JSX.Element {
    const { items, error, isLoading } = this.state;
    const {
      editable,
      editableActions,
      localization,
      components,
      selectionIdProperty
    } = this.props;
    const sticky =
      this.props.options && this.props.options.sticky
        ? this.props.options.sticky
        : false;
    const columns = this.buildGridColumns(
      this.props.columns,
      this.props.contextMenuActions,
      this.props.rowActions,
      sticky
    );
    const data = selectionIdProperty ? this.getDataWithItemsSelected() : items;
    const TableStyles = getTableStyles();
    return (
      <div className={TableStyles.table}>
        <div className={TableStyles.tableHeader}>{this.props.headerText}</div>
        {items && (
          <div
          onScrollCapture={this.handleScroll}
            ref={this.scrollRef}
            style={{
              height: this.props.height,
              overflow: "auto"
            }}
          >
            <div
              id="container"
              style={{ height: "100px", width: "100px", overflow: "auto" }}
              onScrollCapture={this.handleDummyScroll}
            >
              <p id="content">
                The overflow property specifies whether to clip content or to
                add scrollbars when an element's content is too big to fit in a
                specified area.
              </p>
            </div>
            <MaterialTable
              columns={columns}
              data={data}
              {...(localization && { localization })}
              title=""
              {...(editable && { editable: editableActions })}
              {...(this.props.options
                ? { options: this.getOptionsFromProps(this.props.options) }
                : { options: this.getDefaultOptions() })}
              onSelectionChange={this.onSelectionChanged}
              detailPanel={this.props.detailPanel}
              onRowClick={this.onRowClicked}
              onOrderChange={this.onOrderChange}
              onColumnDragged={this.onColumnDrag}
              {...(editable && { editable: editableActions })}
              icons={this.props.icons}
              {...(components && { components: components })}
            />
            {error && <div style={{ color: "#900" }}>{error}</div>}
            {isLoading && (
              <div>
                {this.props.loadingMessage
                  ? this.props.loadingMessage
                  : "Loading..."}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  private getDataWithItemsSelected = (): TEntity[] => {
    const { items, selectedItems } = this.state;

    return items.map((item) => {
      const itemId = item[this.props.selectionIdProperty];
      const isItemSelected =
        selectedItems.findIndex(
          (selectedItem) =>
            selectedItem[this.props.selectionIdProperty] === itemId
        ) !== -1;
      return {
        ...item,
        tableData: {
          checked: isItemSelected
        }
      };
    });
  };

  private handleDummyScroll = (e) => {
    console.log("This is dummy scroll");
  };

  private handleScroll = (e): void => {
    console.log("table scroll");
    const {
      state: { error, isLoading, hasMore }
    } = this;

    if (error || isLoading || !this.props.hasMore) {
      return;
    }

    const element: HTMLDivElement = e.target;
    if (
      element.scrollHeight - Math.ceil(element.scrollTop) <=
        element.clientHeight &&
      element.scrollHeight !== element.clientHeight
    ) {
      this.loadMoreItems();
    }
  };
  private loadMoreItems = (): void => {
    if (typeof this.props.loadMoreItems === "function") {
      this.setState({ isLoading: true }, () => {
        this.props
          .loadMoreItems()
          .then((results: TEntity[]) => {
            this.setState({
              isLoading: false,
              items: [...this.state.items, ...results]
            });
          })
          .catch((err: Error) => {
            this.setState({
              error: err,
              isLoading: false
            });
          });
      });
    }
  };

  private getOptionsFromProps = (optionsProps: ITableOptions): Options => {
    const options: Options = {
      actionsColumnIndex: -1,
      columnsButton: optionsProps.columnsButton,
      exportButton: optionsProps.exportButton,
      exportCsv: optionsProps.exportCsv,
      exportDelimiter: optionsProps.exportDelimiter,
      exportFileName: optionsProps.exportFileName,
      filtering: optionsProps.canFilter,
      grouping: optionsProps.grouping,
      header: optionsProps.showHeader,
      headerStyle: optionsProps.headerStyle,
      maxBodyHeight: optionsProps.maxBodyHeight,
      paging: false,
      rowStyle: optionsProps.rowStyle,
      search: optionsProps.showSearch,
      selection: optionsProps.showSelection,
      showEmptyDataSourceMessage: optionsProps.showEmptyDataSourceMessage,
      showSelectAllCheckbox: optionsProps.showSelectAllCheckbox,
      sorting: optionsProps.canSort,
      toolbar: optionsProps.showToolbar,
      toolbarButtonAlignment: optionsProps.toolbarButtonAlignment,
      searchFieldStyle: optionsProps.searchFieldStyle,
      defaultExpanded: optionsProps.expanded
    };

    return options;
  };

  private getDefaultOptions = (): Options => {
    const options: Options = {
      actionsColumnIndex: -1,
      paging: false,
      search: false,
      toolbar: false
    };

    return options;
  };

  private onSelectionChanged = (data: TEntity[]) => {
    if (this.props.selectionIdProperty) {
      this.setState({
        selectedItems: [...data]
      });
    }
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(data);
    }
  };

  private onRowClicked = (
    event?: React.MouseEvent,
    data?: TEntity,
    toggleDetailPanel?: (panelIndex?: number) => void
  ) => {
    if (this.props.onRowClick) {
      this.props.onRowClick(event, data, toggleDetailPanel);
    }
  };

  private onOrderChange = (orderBy: number, orderDirection: "asc" | "desc") => {
    if (this.props.onOrderChange) {
      this.props.onOrderChange(orderBy, orderDirection);
    }
  };

  private onColumnDrag = (sourceIndex: number, destinationIndex: number) => {
    if (this.props.onColumnDragged) {
      this.props.onColumnDragged(sourceIndex, destinationIndex);
    }
  };

  private buildGridColumns = (
    columns: Array<ITableColumn<TEntity>>,
    contextMenuActions?: IContextMenuAction[],
    rowActions?: IRowAction[],
    sticky: boolean = false
  ): Array<Column<any>> => {
    const gridColumns = columns.map((column) => {
      const canSort =
        column.sorting === undefined || column.sorting === null
          ? true
          : column.sorting;
      const gridCol: Column<any> = {
        ...column,
        cellStyle: column.cellStyle,
        defaultSort: column.defaultSort,
        field: column.fieldName.toString(),
        grouping: column.grouping,
        headerStyle: column.headerStyle,
        sorting: canSort,
        title: column.title,
        ...(column.type &&
          this.canApplyCustomSort(column.type) && {
            customSort: (currentRow, nextRow) =>
              this.sortColumn(currentRow, nextRow, column)
          })
      };

      return gridCol;
    });

    if (
      (contextMenuActions && contextMenuActions.length > 0) ||
      (rowActions && rowActions.length > 0)
    ) {
      const actionsCol = this.createActionsColumn(
        contextMenuActions,
        rowActions,
        sticky
      );
      gridColumns.push(actionsCol);
    }
    return gridColumns;
  };

  private sortColumn(
    currentRow: TEntity,
    nextRow: TEntity,
    column: ITableColumn<TEntity>
  ) {
    if (column.type === "string") {
      const currentRowValue = (currentRow[column.fieldName] || "").toString();
      const nextRowValue = (nextRow[column.fieldName] || "").toString();
      const locale = navigator ? navigator.language : undefined;
      return currentRowValue.localeCompare(nextRowValue, locale, {
        sensitivity: "base"
      });
    }
  }
  private canApplyCustomSort(columnType) {
    if (columnType === "string") {
      return true;
    } else {
      return false;
    }
  }

  private createActionsColumn = (
    contextMenuActions: IContextMenuAction[],
    rowActions: IRowAction[],
    sticky: boolean = false
  ): Column<any> => {
    let colMinWidth = 0;

    if (contextMenuActions && contextMenuActions.length > 0) {
      colMinWidth = Number(colMinWidth) + 32;
    }
    if (rowActions && rowActions.length > 0) {
      colMinWidth = Number(colMinWidth) + 32 * rowActions.length;
    }
    const TableStyles = getTableStyles();
    return {
      ...(sticky && {
        cellStyle: TableStyles.actionColumn as React.CSSProperties
      }),
      field: "row-actions",
      ...(sticky && {
        headerStyle: TableStyles.actionHeader as React.CSSProperties
      }),
      render: (item) => {
        const visibleContextActions: IContextMenuAction[] = contextMenuActions
          ? contextMenuActions.filter((action) => {
              return action.isVisible ? action.isVisible(item) : true;
            })
          : [];
        const contextMenuTooltip = this.props.contextMenuTooltip
          ? this.props.contextMenuTooltip
          : "";
        return (
          <TableRowActions
            contextMenuActions={visibleContextActions}
            rowActions={rowActions || []}
            rowData={item}
            contextMenuTooltip={contextMenuTooltip}
          />
        );
      },
      sorting: this.props.disableSortOnActions ? false : true,
      title: ""
    };
  };
}
