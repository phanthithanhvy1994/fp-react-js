import React from 'react';
import { withTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Icon } from 'native-base';

import icoMoonConfig from '../../../selection.json';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { statusConst } from '../../../constants/constants';
import { MESSAGE } from '../../../constants/message';
import { styles } from './listForm.style';

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);
class ListForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRow: '',
      row: '',
      listData: props.listData,
    };

    this.touchCount = 0;
  }

  statusColor = status => {
    switch (status) {
      case statusConst.status.failed:
        return styles.textFailed;
        break;
      case statusConst.status.draft:
        return styles.textDraft;
        break;
      case statusConst.status.cancelled:
        return styles.textCancelled;
        break;
      case statusConst.status.completed:
      case statusConst.status.partially:
      case statusConst.status.partiallyReceived:
        return styles.textCompleted;
        break;
      case statusConst.status.submitted:
      case statusConst.status.confirmed:
        return styles.textSubmitted;
        break;
      case statusConst.status.inTransit:
        return styles.textInTransit;
        break;
      default:
        break;
    }
  };

  actionBtn = data => {
    this.handleOpen(data);
  };

  handleOpen = data => {
    const { row } = this.state;
    const { handleDetailItem } = this.props;
    if (data.item.key === row) {
      return this.setState({ row: '' });
    }
    handleDetailItem(data);
    this.setState({ row: data.item.key });
  };

  handleClickOnItem = data => {
    const { handleClickOnItems } = this.props;
    handleClickOnItems && handleClickOnItems(data);
  };

  renderItem = data => {
    const { row } = this.state;
    const isSelect = row === data.index;
    const { renderRemainingTime } = this.props;
    return (
      <TouchableOpacity
        key={data.index}
        activeOpacity={1}
        onPress={() => {
          // handle for double-click
          this.touchCount = this.touchCount + 1;
          if (this.touchCount === 2) {
            this.touchCount = 0;
            clearTimeout(this.backTimer);
            this.handleClickOnItem(data);
          } else {
            this.backTimer = setTimeout(() => {
              this.touchCount = 0;
            }, 1000) // the time for clearing the counter
          }
        }}
      >
        <View style={styles.rowFront}>
          {[data.item].map((item, key) => {
            return (
              <View style={styles.viewContainer} key={key}>
                <View style={styles.viewInfo}>
                  <Text style={[styles.textTitle, styles.textFont, item?.customClassItem ? item.customClassItem : {}]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.textFont, styles.textTime, item?.customClassItem ? item.customClassItem : {}]}>
                    {item.time}
                  </Text>
                  <View style={styles.btnCollapse}>
                    <IcoMoon
                      size={styles.iconSize.width}
                      name={isSelect ? 'icon-arrow-up' : 'icon-arrow-down'}
                      onPress={() => this.actionBtn(data)}
                    />
                  </View>
                </View>
                {item.generalLabel.map((itemChildren, i) => {
                  return (
                    <Text style={[styles.textFont, item?.customClassItem ? item.customClassItem : {}]} key={i}>
                      {itemChildren.title}
                    </Text>
                  );
                })}
                <Text
                  style={[styles.textStatus, this.statusColor(item.status)]}>
                  {item.status}
                </Text>
                {item.isDelete && item.remainingTime ? (
                  <View style={styles.remainingTimeView}>
                    <Text style={styles.remainingTime}>
                      {renderRemainingTime &&
                        renderRemainingTime(item.remainingTime, data.index)}
                    </Text>
                    <Text style={styles.stepLabel}>{item.stepLabel}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
        {isSelect ? this.renderChildrenItem() : null}
      </TouchableOpacity>
    );
  };

  renderChildrenItem = () => {
    const { renderChildrenItem } = this.props;
    return renderChildrenItem();
  };

  renderHiddenItem = data => {
    const { handleCancel, handleDelete } = this.props;
    return (
      <View style={styles.rowBack}>
        {data.item.isCancelled ? (
          <TouchableOpacity
            style={[styles.backRightBtnLeft, styles.cancelBtn]}
            onPress={() => handleCancel(data)}>
            <Icon name="close-outline" style={styles.iconClose} />
          </TouchableOpacity>
        ) : undefined}
        {data.item.isDelete ? (
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => handleDelete(data)}>
            <IcoMoon
              style={styles.icon}
              size={styles.iconSize.width}
              name="icon-trash"
            />
          </TouchableOpacity>
        ) : undefined}
      </View>
    );
    // }


  };

  onRowDidOpen = rowKey => {
    this.setState({ selectedRow: rowKey });
  };

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  _renderFooter = () => {
    if (!this.props.loadingMore) {
      return null;
    }
    return (
      <View style={styles.tableFooter}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    const { handleLoadMore, listData, refreshing, t, disabledSwipeLeft, disabledSwipeRight } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {listData.length !== 0 ? (
          <SwipeListView
            data={listData}
            renderItem={row => this.renderItem(row)}
            // For prevent swipe with row with condition: 
            // renderHiddenItem={row => row.item.isCancelled || row.item.isDelete ? this.renderHiddenItem(row) : undefined}
            renderHiddenItem={row => row.item.isCancelled || row.item.isDelete ? this.renderHiddenItem(row) : undefined}
            rightOpenValue={-44}
            leftOpenValue={60}
            previewOpenValue={44}
            previewOpenDelay={10}
            disableLeftSwipe={disabledSwipeLeft}
            disableRightSwipe={disabledSwipeRight}
            onRowDidOpen={this.onRowDidOpen}
            ListFooterComponent={this._renderFooter}
            keyExtractor={(item, index) => index.toString()}
            refreshing={refreshing}
            onEndReached={({ distanceFromEnd }) => {
              if (
                this.props.loadingMore ||
                typeof handleLoadMore !== 'function'
              ) {
                return;
              }
              handleLoadMore();
            }}
          />
        ) : (
          <View style={styles.viewNoRecord}>
            <Text>{t(MESSAGE.M002)}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default withTranslation()(ListForm);
