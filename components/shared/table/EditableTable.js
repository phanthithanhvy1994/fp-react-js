import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  ActivityIndicator,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
import find from 'lodash/find';
import endsWith from 'lodash/endsWith';
import PropTypes from 'prop-types';

import Style from './EditableTable.style';
import ButtonTap from '../buttons/ButtonTap';
import Column from './Column';
import Cell from './Cell';
import map from 'lodash/map';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {ZOOM_CONFIG, TABLE} from './table.config';
import {MESSAGE} from '../../../constants/message';
import {ResponsiveTable} from '../../../constants/constants';
import {useTranslation} from 'react-i18next';

class EditableTable extends React.Component {
  createColumns(columns) {
    return columns.map((col, i) => {
      const width = this._calculateCellWidth(col.widthChanged);

      return (
        <Column
          {...col}
          key={i}
          column={col}
          customStyles={this.props.customStyles}
          width={width}
        />
      );
    });
  }

  checkAutoFocus = (row, cellChanged, col) => {
    const autoFocus =
      row[cellChanged.idName] === cellChanged.idValue &&
      row[cellChanged.idIndexName] === cellChanged.idIndex &&
      row[cellChanged.idIndexName2] === cellChanged.idIndex2 &&
      cellChanged.fieldName === col.field;
    return autoFocus;
  };

  checkHightLightRow = (row, cellChanged) => {
    const isHighlight =
      cellChanged.idName &&
      row[cellChanged.idName] === cellChanged.idValue &&
      row[cellChanged.idIndexName2] === cellChanged.idIndex2 &&
      row[cellChanged.idIndexName] === cellChanged.idIndex;
    return isHighlight;
  };

  createRow(row, i, columns) {
    const {cellChanged, detailPath, handleReload} = this.props;

    return (
      <ButtonTap
        style={Style.flexEditable}
        path={detailPath}
        data={row}
        onGoBack={handleReload}>
        {map(columns, (col, colIndex) => {
          const autoFocus = this.checkAutoFocus(row, cellChanged, col);
          const isHighlight = this.checkHightLightRow(row, cellChanged);
          const isLastCell = colIndex === columns.length - 1;
          let value = row[col.field];
          if (typeof col.format === 'function') {
            value = col.format(value);
          }
          return this.createCell(
            value,
            colIndex,
            col,
            row,
            col.field,
            autoFocus,
            isLastCell,
            isHighlight,
            cellChanged.scanType,
          );
        })}
      </ButtonTap>
    );
  }

  createCell(
    cell,
    colIndex,
    col,
    rowData,
    field,
    autoFocus,
    isLastCell,
    isHighlight,
    scanType,
  ) {
    const {
      onSubmitEditing,
      customStyles,
      onCellChange,
      onDeleteRow,
      onFocusCell,
      zeroCount,
    } = this.props;
    const width = this._calculateCellWidth(col.widthChanged);

    return (
      <Cell
        value={cell}
        key={colIndex}
        customStyles={customStyles}
        width={width}
        onCellChange={onCellChange}
        editable={col.editable}
        columnInfo={col}
        autoFocus={autoFocus}
        rowData={rowData}
        field={field}
        onSubmitEditing={onSubmitEditing}
        onDeleteRow={onDeleteRow}
        isLastCell={isLastCell}
        onFocusCell={onFocusCell}
        isHighlight={isHighlight}
        scanType={scanType}
        zeroCount={zeroCount}
      />
    );
  }

  _calculateCellWidth(width) {
    const {columns} = this.props;
    if (!width) {
      return undefined;
    }

    if (endsWith(width, '%')) {
      return {flex: columns.length * (parseInt(width, 10) * 0.01)};
    }

    return {width: width};
  }

  _renderFooter = () => {
    if (!this.props.loadingMore) {
      return null;
    }
    const WIDTH_SCREEN = Dimensions.get('window').width;

    return (
      <View style={[Style.tableFooter, {marginLeft: (WIDTH_SCREEN - 32) / 2}]}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  createRows = (data, columns) => {
    const {item, index} = data;
    const {customStyles} = this.props;
    const rowStyle = [Style.row, customStyles.row];
    return (
      <View key={index} style={rowStyle}>
        {this.createRow(item, index, columns)}
      </View>
    );
  };

  renderEmptyTable = () => {
    if (this.props.loadingMore) {
      return null;
    }
    const {t} = useTranslation();
    return <Text>{t(`${MESSAGE.M002}`)}</Text>;
  };

  renderHeaderTable = columns => {
    const {customStyles} = this.props;
    const rowStyle = [Style.row, customStyles.row];
    return <View style={rowStyle}>{this.createColumns(columns)}</View>;
  };

  scrollToItem = index => {
    let moveId = +index - 1;
    if (index === 0) {
      moveId = index;
    }
    this.editableTable.scrollToIndex({animated: true, index: '' + moveId});
  };

  renderTable = columns => {
    const {values, refreshing, handleLoadMore} = this.props;

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={values}
        ref={ref => {
          this.editableTable = ref;
        }}
        renderItem={row => this.createRows(row, columns)}
        keyExtractor={(item, i) => i.toString()}
        ListHeaderComponent={this.renderHeaderTable(columns)}
        ListFooterComponent={this._renderFooter}
        refreshing={refreshing}
        onEndReached={({distanceFromEnd}) => {
          if (this.props.loadingMore || typeof handleLoadMore !== 'function') {
            return;
          }
          handleLoadMore();
        }}
        onEndReachedThreshold={TABLE.onEndReachedThreshold}
        initialNumToRender={values.length}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={this.renderEmptyTable}
      />
    );
  };

  scrollToEditColumn = tableWidth => {
    const {scrollToRight} = this.props;
    setTimeout(() => {
      this.scrollTable &&
        scrollToRight &&
        this.scrollTable.scrollTo({x: +tableWidth, y: 0, animated: true});
    }, 100);
  };

  render() {
    const {columns, customStyles} = this.props;
    const {
      widthCol,
      paddingTable,
      paddingCell,
      partNo,
      widthSapDoc,
      widthSapPart,
      widthSapBpName,
    } = ResponsiveTable;
    // calc actual width of table
    let tableColumnWidth = 0;
    map(columns, col => {
      if (col.field === 'Sap_DocItem') {
        col.width = widthSapDoc;
      }
      if (col.field === 'Sap_BpName') {
        col.width = widthSapBpName;
      }
      if (
        col.field === 'Sap_Part' ||
        col.field === 'Hh_Doc' ||
        col.field === 'Sap_Doc' ||
        col.field === 'Sap_Ref1' ||
        col.field === 'Sap_Ref2' ||
        col.field === 'Sap_Ref3' ||
        col.field === 'Hh_Recipient'
      ) {
        col.width = widthSapPart;
      }

      tableColumnWidth = tableColumnWidth + (col.width ? col.width : 100);
    });

    const tableWidth =
      tableColumnWidth + paddingTable + paddingCell * columns.length;

    const widthDevice = Dimensions.get('window').width;
    map(columns, col => {
      if (
        col.field === 'Sap_Part' ||
        col.field === 'Hh_Doc' ||
        col.field === 'Sap_Doc' ||
        col.field === 'Sap_Ref1' ||
        col.field === 'Sap_Ref2' ||
        col.field === 'Sap_Ref3' ||
        col.field === 'Hh_Recipient'
      ) {
        col.widthChanged = tableWidth < widthDevice ? '50%' : widthSapPart;
        return col;
      }
      if (
        col.field === 'Hh_Ref1' ||
        col.field === 'Sap_Bp' ||
        col.field === 'Sap_Ref1Type' ||
        col.field === 'Sap_Ref2Type' ||
        col.field === 'Sap_Ref3Type'
      ) {
        col.widthChanged = tableWidth < widthDevice ? '20%' : widthCol;
        return col;
      }

      if (col.field === 'Sap_DocItem') {
        col.widthChanged = tableWidth < widthDevice ? '12%' : widthSapDoc;
        return col;
      }
      if (col.field === 'Sap_BpName') {
        col.widthChanged = widthSapBpName;
        return col;
      }
      if (col.title === 'Previous Count') {
        col.widthChanged = tableWidth < widthDevice ? '17%' : col.width;
        return col;
      }
      col.widthChanged = col.width;
      return col;
    });

    const isWidthColumnResponsive = !!find(columns, col => {
      return col.widthChanged && endsWith(col.widthChanged, '%');
    });

    this.scrollToEditColumn(tableWidth);

    return (
      <View style={Style.container}>
        <KeyboardAvoidingView
          style={Style.flexOne}
          behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
          enabled
          keyboardVerticalOffset={Style.height}>
          <View style={[Style.table, customStyles.table]}>
            <ReactNativeZoomableView
              zoomEnabled={true}
              maxZoom={ZOOM_CONFIG.maxZoom}
              minZoom={ZOOM_CONFIG.minZoom}
              zoomStep={ZOOM_CONFIG.zoomStep}
              bindToBorders={true}>
              {isWidthColumnResponsive ? (
                <View
                  // [#HONDAIPB-FixBug] - 08/07/2020 - hotfix: scroll messy when editing column - Remove incorrect -> Revert & Modify
                  style={[Style.flexView]}>
                  {this.renderTable(columns)}
                </View>
              ) : (
                <ScrollView
                  ref={ref => {
                    this.scrollTable = ref;
                  }}
                  horizontal>
                  {this.renderTable(columns)}
                </ScrollView>
              )}
            </ReactNativeZoomableView>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

EditableTable.defaultProps = {
  values: [],
  style: {},
  customStyles: {},
  refreshing: false,
  cellChanged: {},
};

EditableTable.propTypes = {
  columns: PropTypes.array.isRequired, // Specify your table headers
  values: PropTypes.array, // The values of table
  onCellChange: PropTypes.func, // The callback when a cell changes values if it is editable.
  customStyles: PropTypes.object, // Custom styles to override
  refreshing: PropTypes.bool,
  cellChanged: PropTypes.object,
};

export default EditableTable;
