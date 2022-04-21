import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withTranslation} from 'react-i18next';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { styles } from '../AssetTransferAddEdit.style';
import ItemImageList from '../../../shared/item-image/ItemImageList';
import {fieldsArray} from './ItemAssetrequestMaster.config';
import Field from '../../../shared/fields/field';
import { ATConstant} from '../../../../constants/constants';

import icoMoonConfig from '../../../../selection.json';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { getAssetLocation } from '../../../../actions/common-action';
import { formatDropdownList } from '../../../../utils/format-util';
import { showMessage, getErrorMessage } from '../../../../utils/message-util';
// import {Button} from 'native-base';


const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);
class ItemAssetrequestMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idItemClicking: null,
      listComboboxData: {},
      plantLocationLoaded: {}
    };
  }
  
  informationList = (data) => [
    { label: 'Asset Code', value: 'assetNo' },
    { value: 'description' },
    { customValue: () => {
      return <Text>{`${data.quantity || ''} ${data.baseUom || ''}`}</Text>;
    }},
  ];
  
  renderItem = (row) => {
    const { changeFieldStep, indexAssetRequest, typeChange, branchCodeTo } = this.props;
    const { plantLocationLoaded } = this.state;
    const isUtensil = row.item.assetCategory === ATConstant.assetCategory.Utensil;
    const isShowLabelQty = typeChange === ATConstant.typeValue.fromAR ||
      typeChange === ATConstant.typeValue.returnPermanent && !isUtensil ||
      typeChange === ATConstant.typeValue.returnStripDown ||
      typeChange === ATConstant.typeValue.repair ||
      typeChange === ATConstant.typeValue.location || 
      !isUtensil && typeChange === ATConstant.typeValue.assetLending||
      !isUtensil && typeChange === ATConstant.typeValue.assetLendingReturn ||
      typeChange === ATConstant.typeValue.branchOpening ;
    return (
      <View style={[styles.bgWhite, styles.coverItemInfo]}>
        <View style={styles.viewItemInfo}>
          <ItemImageList
          itemData={row.item}
          informationList={this.informationList(row.item)}
          isCustomClass = {true}
          />
          {isShowLabelQty && (
            <View style={styles.viewQtyAR}>
              <Text>
              {row.item.quantity}
              </Text>
            </View>)}
        </View>
        <View style={styles.fieldsArray}>
          <Field
            conditionalArray={fieldsArray(row, plantLocationLoaded, typeChange, isShowLabelQty, branchCodeTo) || []}
            onChange={e => {
              changeFieldStep(e, row.index, indexAssetRequest)
            }}
          />
        </View>
      </View>
    );
  };

  renderHiddenItem = (data, assetRequestNo) => {
    const { deleteAssetMaster } = this.props;
      return (
        <View style={styles.rowBack}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              deleteAssetMaster(data.item, assetRequestNo);
            }}>
            <IcoMoon
              style={styles.icon}
              size={styles.iconSize.width}
              name="icon-trash"
            />
          </TouchableOpacity>
        </View>
      );
    // }
  };

  loadAssetLocation = (plant) => {
    return new Promise((resolve, reject) => {
      getAssetLocation({
        plant
      }).then(res => {
        if (getErrorMessage(res)) {
          showMessage(getErrorMessage(res));
          reject();
          return;
        }
        resolve(res);
      }).catch(() => {
        resolve({ data: [] });
      });
    });
  };

  loadAllNecessaryLocation = (detailData = {}) => {
    const { typeChange, branchCodeTo } = this.props;
    let plantLocationLoaded = { ...this.state.plantLocationLoaded };
    let plant;
    const { assetTransferRequestDetailVOS } = detailData || [];
    for (let j = 0; j < assetTransferRequestDetailVOS.length; j ++) {
      // Incase changeLocation or AssetRequest, get location with plant = To
      // else get from plant in scanned asset
      plant = (typeChange === ATConstant.typeValue.fromAR
        || typeChange === ATConstant.typeValue.location) ? branchCodeTo : assetTransferRequestDetailVOS[j].plant;
      
      if (!plant || plantLocationLoaded[plant] && plantLocationLoaded[plant].length > 0) {
        continue;
      }
      this.loadAssetLocation(plant).then(res => {
        this.setState({
          plantLocationLoaded: {
            ...plantLocationLoaded,
            [plant]: formatDropdownList(res.data, 'assetLocationCode', 'assetLocationName')
          }
        });
      });
    }
  };

  render() {
    const {t, indexAssetRequest, data, onPressMasterId, typeChange} = this.props;
    const {idItemClicking} = this.state;
    this.loadAllNecessaryLocation(data);
    return (
      <View>
        {typeChange === ATConstant.typeValue.fromAR && (
          <View>
            <Text style={styles.assetNoLabel}>Asset Transfer No.: {data.assetRequestNo} </Text>
            {data?.assetRequestMaster?.map((item, index) => (
              <View style={styles.contentContainer}>
                <View style={[styles.viewItemInfo, styles.bgLigthGreen, styles.contentItem]} key={index}>
                  <TouchableOpacity onPress={() => {
                      onPressMasterId(item.assetRequestDetailId, indexAssetRequest);
                      this.setState({idItemClicking: item.assetRequestDetailId})
                    }}>
                    <Text style={item.assetRequestDetailId === idItemClicking && styles.isClicking} >
                      {`${item.assetRequestMasterName}`}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.viewQty}>
                    <Text style={styles.textQty}>
                    {item.quantity}
                    </Text>
                  </View>
                </View>
                {/* display scan data for each item in asset request master */}
                <View>
                  <SwipeListView
                    data={data.assetTransferRequestDetailVOS.filter(el => el.assetRequestDetailId === item.assetRequestDetailId)}
                    renderItem={row => this.renderItem(row)}
                    renderHiddenItem={(row) => this.renderHiddenItem(row, data.assetRequestNo)}
                    disableRightSwipe={true}
                    previewOpenDelay={3000}
                    friction={1000}
                    tension={40}
                    rightOpenValue={-44}
                    previewOpenValue={44}
                  />
                </View>
              </View>
              ))}
            </View>
          )}
        
          {typeChange !== ATConstant.typeValue.fromAR && <View style={styles.contentContainer}>
            <SwipeListView
              data={data.assetTransferRequestDetailVOS}
              renderItem={row => this.renderItem(row)}
              renderHiddenItem={(row) => this.renderHiddenItem(row)}
              disableRightSwipe={true}
              previewOpenDelay={3000}
              friction={1000}
              tension={40}
              rightOpenValue={-44}
              previewOpenValue={44}
            />
          </View>}
        </View>
    );
  }
}

export default withTranslation()(ItemAssetrequestMaster);
