import React from 'react';
import {Container, Accordion, Text, View, Icon, Badge} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {withTranslation} from 'react-i18next';

import {MESSAGE} from '../../constants/message';
import {buttonConstant, dialogConstant} from '../../constants/constants';
import {openMessageDialog} from '../../redux/message-dialog/MessageDialog.actions';

import {map, pickBy, identity} from 'lodash';
// import get from 'lodash/get';
import moment from 'moment';

import {
  sapDocTitle,
  screenListDetail,
  getUnfinishedDocs,
  countUnfinishedDocs,
} from './unfinished-document.config';

import {deleteRow} from '../../services/database/CRUD';

import {tableConstant} from '../../database/Constant';

import {styles} from '../../styles/unfinished-document';
import {convertObjToArray, deepCopy, formatHhDoc} from '../../utils/functions';

class UnfinishedDocumentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      id: '',
    };
  }

  componentDidMount() {
    // [HONDAIPB-Update] - 23/06/2020 - Update refactor w reload after navigate
    // Replace handleReload callback with will focus event
    const {navigation} = this.props;
    // Handle fetch data if navigate focus this screen
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      this._getUnfinishedDocs();
    });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  deleteUnfinishDoc = async id => {
    // handle deleteUnfinishDoc
    await deleteRow(tableConstant.name.DOC_HEADER, id);
  };

  goToDetail = (trxType, data) => {
    const list = deepCopy(data);
    let screen = screenListDetail[trxType];
    list.NvStkHdToItm = convertObjToArray(list.NvStkHdToItm);
    if (
      trxType === tableConstant.trx_type.PARTS_RETURN &&
      data.Hh_Subtitle === tableConstant.subtitle.PATH_RETURN_CREATE
    ) {
      screen = 'PartsReturnCreate';
      // Remove null value
      list.NvStkHdToItm = list.NvStkHdToItm.map(item => {
        return pickBy(item, identity);
      });
    }

    const {navigation} = this.props;
    navigation.navigate(screen, {
      data: list,
    });
  };

  handleReload = async () => {
    let docs = await getUnfinishedDocs();
    this.setState({docs});
  };

  _getUnfinishedDocs = async () => {
    let docs = await getUnfinishedDocs();
    this.setState({docs});
  };

  handleClickDeleteDoc = id => {
    this.setState({id}, () => this.callMessage(MESSAGE.M004));
  };

  _renderHeader = (item, expanded) => {
    const {t} = this.props;
    const styleHeader = expanded
      ? styles.header
      : [styles.header, styles.MarginBottom];
    return (
      item.items.length > 0 && (
        <View style={styleHeader}>
          <Text> {t(item.title)}</Text>
          <View style={styles.headerRight}>
            <Badge style={styles.badge}>
              <Text>{item.items.length}</Text>
            </Badge>
            <Icon
              type="FontAwesome"
              name={expanded ? 'angle-down' : 'angle-up'}
              style={styles.colorPrimary}
            />
          </View>
        </View>
      )
    );
  };

  createTitle = trxType => {
    return sapDocTitle[trxType];
  };

  // [#HONDAIPB-CR] - 08/07/2020 - Change display label value
  createTitleValue = item => {
    let value = '';
    switch (item.Trx_Type) {
      case tableConstant.trx_type.RECEIVE_PURCHASE:
        value = item.Sap_Ref1;
        break;
      default:
        value = item.Sap_Doc;
        break;
    }
    return value;
  };

  _renderContent = document => {
    const {t} = this.props;
    return (
      <View>
        {map(document.items, (item, i, items) => {
          const isLastItem = items.length - 1 === i;
          return (
            <View
              key={i}
              style={[styles.content, isLastItem ? styles.MarginBottom : '']}>
              <View style={styles.flexItem}>
                <TouchableOpacity
                  onPress={() => this.goToDetail(item.Trx_Type, item)}>
                  <Text>
                    {t('HH Document')}: {formatHhDoc(item.Hh_Doc)}
                  </Text>
                  <Text>
                    {t('Date')}:{' '}
                    {moment(
                      item.Trx_Type === tableConstant.trx_type.PARTS_RETURN
                        ? item.Hh_CreateDate
                        : item.Sap_DocDate,
                    ).format('DD.MM.YYYY')}
                  </Text>
                  <Text>
                    {t(this.createTitle(item.Trx_Type))}:{' '}
                    {this.createTitleValue(item)}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => this.handleClickDeleteDoc(item.id)}>
                <Icon style={styles.icon} name="trash" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  callMessage = message => {
    const {t} = this.props;
    const {id} = this.state;
    let messObj;
    if (message === MESSAGE.M004) {
      messObj = {
        content: t(MESSAGE.M004),
        buttons: [
          {
            name: buttonConstant.BUTTON_CANCEL,
            type: dialogConstant.button.NONE_FUNCTION,
          },
          {
            name: buttonConstant.BUTTON_OK,
            type: dialogConstant.button.FUNCTION,
            action: async () => {
              await this.deleteUnfinishDoc(id);
              await this.handleReload();
            },
          },
        ],
      };
    }
    openMessageDialog(messObj);
  };

  render() {
    const {docs} = this.state;
    const {t} = this.props;
    const numberOfDocs = countUnfinishedDocs(docs);
    return (
      <>
        <Container style={styles.container}>
          {numberOfDocs > 0 ? (
            <Accordion
              dataArray={docs}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              style={styles.accordion}
            />
          ) : (
            <Text>{t(MESSAGE.M002)}</Text>
          )}
        </Container>
      </>
    );
  }
}

export default withTranslation()(UnfinishedDocumentList);
