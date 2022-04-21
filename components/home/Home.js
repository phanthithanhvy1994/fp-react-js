import React from 'react';
import {Text, View, FlatList, SafeAreaView, Image} from 'react-native';
import {Button} from 'native-base';

import {withTranslation} from 'react-i18next';

import {listItems, numColumns} from './home.config';

import styles from './Home.style';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({screenProps}) => ({
    title: screenProps.i18n.t('home'), // screen props.t is undefined
  });
  renderItem = ({item, index}) => {
    if (item.empty) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    const {t, navigation} = this.props;
    return (
      <Button
        key={index}
        style={styles.item}
        onPress={() => navigation.navigate(`${item.screen}`)}>
        <View style={styles.view}>
          <Image source={item.icon} />
          <Text style={styles.text}>{t(`${item.title}`)}</Text>
        </View>
      </Button>
    );
  };

  formatRow = () => {
    const numberOfFullRows = Math.floor(listItems.length / numColumns);
    let numberOfElementsLastRow =
      listItems.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      listItems.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }
    return listItems;
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.formatRow(listItems, numColumns)}
          numColumns={numColumns}
          scrollEnabled={true}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Home);
