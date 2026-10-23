import type { ColorMap } from '../colorMap';
import constants from '../styleConstants';

export const getEditorStyles = (colors: ColorMap) => ({
  removeVarIcon: {
    verticalAlign: 'top',
    display: 'inline-block',
    color: colors.editVariable.removeIcon,
    cursor: constants.iconCursor,
    fontSize: constants.iconFontSize,
    marginRight: constants.iconMarginRight
  },
  addVarIcon: {
    verticalAlign: 'top',
    display: 'inline-block',
    color: colors.editVariable.addIcon,
    cursor: constants.iconCursor,
    fontSize: constants.iconFontSize,
    marginRight: constants.iconMarginRight
  },
  editVarIcon: {
    verticalAlign: 'top',
    display: 'inline-block',
    color: colors.editVariable.editIcon,
    cursor: constants.iconCursor,
    fontSize: constants.iconFontSize,
    marginRight: constants.iconMarginRight
  },
  'edit-icon-container': {
    display: 'inline-block',
    verticalAlign: 'top'
  },
  'check-icon': {
    display: 'inline-block',
    cursor: constants.iconCursor,
    color: colors.editVariable.checkIcon,
    fontSize: constants.iconFontSize,
    paddingRight: constants.iconPaddingRight
  },
  'cancel-icon': {
    display: 'inline-block',
    cursor: constants.iconCursor,
    color: colors.editVariable.cancelIcon,
    fontSize: constants.iconFontSize,
    paddingRight: constants.iconPaddingRight
  },
  'edit-input': {
    display: 'inline-block',
    minWidth: constants.editInputMinWidth,
    borderRadius: constants.editInputBorderRadius,
    backgroundColor: colors.editVariable.background,
    color: colors.editVariable.color,
    padding: constants.editInputPadding,
    marginRight: constants.editInputMarginRight,
    fontFamily: constants.editInputFontFamily
  },
  'detected-row': {
    paddingTop: constants.detectedRowPaddingTop
  },
  'key-modal-request': {
    position: constants.addKeyCoverPosition,
    top: constants.addKeyCoverPositionPx,
    left: constants.addKeyCoverPositionPx,
    right: constants.addKeyCoverPositionPx,
    bottom: constants.addKeyCoverPositionPx,
    backgroundColor: constants.addKeyCoverBackground
  },
  'key-modal': {
    width: constants.addKeyModalWidth,
    backgroundColor: colors.addKeyModal.background,
    marginLeft: constants.addKeyModalMargin,
    marginRight: constants.addKeyModalMargin,
    padding: constants.addKeyModalPadding,
    borderRadius: constants.addKeyModalRadius,
    marginTop: '15px',
    position: 'relative'
  },
  'key-modal-label': {
    color: colors.addKeyModal.labelColor,
    marginLeft: '2px',
    marginBottom: '5px',
    fontSize: '11px'
  },
  'key-modal-input-container': {
    overflow: 'hidden'
  },
  'key-modal-input': {
    width: '100%',
    padding: '3px 6px',
    fontFamily: 'monospace',
    color: colors.addKeyModal.color,
    border: 'none',
    boxSizing: 'border-box',
    borderRadius: '2px'
  },
  'key-modal-cancel': {
    backgroundColor: colors.editVariable.removeIcon,
    position: 'absolute',
    top: '0px',
    right: '0px',
    borderRadius: '0px 3px 0px 3px',
    cursor: 'pointer'
  },
  'key-modal-cancel-icon': {
    color: colors.addKeyModal.labelColor,
    fontSize: constants.iconFontSize,
    transform: 'rotate(45deg)'
  },
  'key-modal-submit': {
    color: colors.editVariable.addIcon,
    fontSize: constants.iconFontSize,
    position: 'absolute',
    right: '2px',
    top: '3px',
    cursor: 'pointer'
  },
  'function-ellipsis': {
    display: 'inline-block',
    color: colors.ellipsisColor,
    fontSize: constants.ellipsisFontSize,
    lineHeight: constants.ellipsisLineHeight,
    cursor: constants.ellipsisCursor
  },
  'validation-failure': {
    float: 'right',
    padding: '3px 6px',
    borderRadius: '2px',
    cursor: 'pointer',
    color: colors.validationFailure.fontColor,
    backgroundColor: colors.validationFailure.background
  },
  'validation-failure-label': {
    marginRight: '6px'
  },
  'validation-failure-clear': {
    position: 'relative',
    verticalAlign: 'top',
    cursor: 'pointer',
    color: colors.validationFailure.iconColor,
    fontSize: constants.iconFontSize,
    transform: 'rotate(45deg)'
  }
});
