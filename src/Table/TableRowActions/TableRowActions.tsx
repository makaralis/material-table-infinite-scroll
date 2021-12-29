import * as React from "react";
import { TableRowActionsStyles } from "./TableRowActions.styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IContextMenuAction } from "../Model/IContextMenuAction";
import { IRowAction } from "../Model/IRowAction";
import { Icon, Tooltip } from "@material-ui/core";

export interface ITableRowActionsDispatchToProps {}

interface ITableRowActionsProps extends ITableRowActionsDispatchToProps {
  contextMenuActions: IContextMenuAction[];
  rowActions: IRowAction[];
  rowData: any;
  menuStyle?: React.CSSProperties;
  contextMenuTooltip?: string;
}

interface ITableRowActionsState {
  anchorEl: null;
}

export class TableRowActions extends React.Component<
  ITableRowActionsProps,
  ITableRowActionsState
> {
  constructor(props: ITableRowActionsProps) {
    super(props);

    this.state = {
      anchorEl: null
    };
  }

  public render(): JSX.Element {
    const { contextMenuActions, rowActions, rowData, menuStyle } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div
        className={TableRowActionsStyles.actions}
        data-selection-disabled={true}
      >
        {rowActions && rowActions.length > 0
          ? rowActions.map((action, index) => (
              <span
                key={`context-action-item-${index}`}
                className={
                  action.isVisible && !action.isVisible(rowData)
                    ? TableRowActionsStyles.hiddenAction
                    : ""
                }
              >
                <Tooltip
                  title={action.tooltip ? action.tooltip : ""}
                  aria-label={action.tooltip ? action.tooltip : ""}
                >
                  <div>
                    {/*tooltip doesn't work if the IconButton is disabled, so it has to be inside a div*/}
                    <IconButton
                      color="inherit"
                      disabled={
                        action.isDisabled ? action.isDisabled(rowData) : false
                      }
                      onClick={(event) => {
                        if (action.onClick) {
                          action.onClick(event, rowData);
                          event.stopPropagation();
                        }
                      }}
                    >
                      {typeof action.icon === "string" ? (
                        <Icon {...action.iconProps} fontSize="small">
                          {action.icon}
                        </Icon>
                      ) : (
                        <action.icon />
                      )}
                    </IconButton>
                  </div>
                </Tooltip>
              </span>
            ))
          : null}
        {contextMenuActions.length > 0 ? (
          <div>
            <Tooltip
              title={this.props.contextMenuTooltip}
              aria-label={this.props.contextMenuTooltip}
            >
              <IconButton
                aria-label="More"
                aria-owns={open ? "context-menu" : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleClose}
            >
              {contextMenuActions.map((action, index) => (
                <MenuItem
                  key={`menu-action-item-${index}`}
                  onClick={(event) => {
                    if (action.onClick) {
                      action.onClick(event, rowData);
                    }
                    return this.handleClose();
                  }}
                  disabled={
                    action.isDisabled ? action.isDisabled(rowData) : false
                  }
                >
                  {action.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        ) : null}
      </div>
    );
  }

  private handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private handleClose = () => {
    this.setState({ anchorEl: null });
  };
}
