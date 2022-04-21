import React, { useState, useRef } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, FlatList, Modal } from 'react-native';
import ImagePicker from 'react-native-customized-image-picker';

import { uploadImage, noImage } from '../../../assets/images';
import { Icon, Button, ActionSheet, Root } from 'native-base';
// import Carousel from 'react-native-snap-carousel';

import {
  btnAction,
  titleActionSheet,
  configUploadImage,
  // configCarousel,
} from './upload-image.config';
import { styles } from './UploadImage.style';
import icoMoonConfig from '../../../selection.json';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { MESSAGE } from '../../../constants/message';
import {
  buttonConstant,
  dialogConstant,
} from '../../../constants/constants';
import { openMessageDialog } from '../../../redux/message-dialog/MessageDialog.actions';

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig);
function UploadImage(props) {
  const { disableUpload, imgArr, maxImage, fieldName } = props.config;
  const { maxLenght, acceptFile } = configUploadImage;
  const [fileNames, setFileNames] = useState([]);
  const carouselRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState('');

  React.useEffect(() => {
    setFileNames(fileNames);
    if (typeof props.onChange === 'function') {
      props.onChange({
        target: {
          value: fileNames,
          name: fieldName,
        },
      });
    }
  }, [fileNames]);

  const captureImage = () => {
    let isOverLength = false;
    let isInvalidImageType = false;
    const acceptFileConfig = acceptFile;
    const acceptFileConfigArr = acceptFileConfig.split(',');

    ImagePicker.openCamera({ maxSize: maxImage }).then(image => {
      image.forEach((item) => {
        isOverLength = item.size > maxLenght;
        isInvalidImageType = acceptFileConfigArr.indexOf(item.mime) === -1
        if (isInvalidImageType) {
          handleShowMessage(MESSAGE.UPLOAD_FILE.FILE_TYPE);
          return
        }
        if (isOverLength) {
          handleShowMessage(MESSAGE.UPLOAD_FILE.FILE_SIZE);
          return;
        }
      });

      if (fileNames.length === maxImage) {
        return;
      }

      if (!isInvalidImageType && !isOverLength) {
        setFileNames([...fileNames, ...image]);
      }
    });
  };

  const chooseFile = () => {
    let isOverLength = false;
    let isInvalidImageType = false;
    let overLengthArr = [];
    let invalidImageTypeArr = [];

    const acceptFileConfig = acceptFile;
    const acceptFileConfigArr = acceptFileConfig.split(',');

    ImagePicker.openPicker({
      multiple: true,
      maxSize: maxImage,
    }).then(images => {
      images.forEach((item) => {
        isOverLength = item.size > maxLenght;
        isInvalidImageType = acceptFileConfigArr.indexOf(item.mime) === -1
        if (isInvalidImageType) {
          handleShowMessage(MESSAGE.UPLOAD_FILE.FILE_TYPE);
          overLengthArr.push(item);
          return
        }
        if (isOverLength) {
          handleShowMessage(MESSAGE.UPLOAD_FILE.FILE_SIZE);
          invalidImageTypeArr.push(item);
          return;
        }
      });

      isOverLength = isOverLength.length > 0;
      isInvalidImageType = invalidImageTypeArr.length > 0;

      if (fileNames.length === maxImage) {
        return;
      }

      if (!isInvalidImageType && !isOverLength) {
        setFileNames([...fileNames, ...images]);
      }
    });
  };

  const handleShowMessage = (message) => {
    openMessageDialog({
      content: message,
      buttons: [
        {
          name: buttonConstant.BUTTON_OK,
          type: dialogConstant.button.FUNCTION,
          action: () => { },
        },
      ],
    });
  };

  const showModal = (imgPath) => {
    // Show popup Img
    setModalVisible(!modalVisible);
    setSelectedImagePath(imgPath);
  };

  const onActionSelectPhotoDone = index => {
    switch (index) {
      case 0:
        captureImage();
        break;
      case 1:
        chooseFile();
        break;
      default:
        break;
    }
  };
  const removeItem = index => {
    const newFileNames = [...fileNames];
    newFileNames.splice(index, 1);
    setFileNames(newFileNames);
    // carouselRef.current.snapToItem(activeIndex + 1);
  };

  const _renderItem = ({ item, index }) => {
    return (
      <View style={styles.row}>
        {!disableUpload && (
          <TouchableOpacity
            onPress={() => {
              removeItem(index);
            }}
            style={styles.btnDelete}>
            <IcoMoon
              style={styles.icon}
              size={styles.iconSize.width}
              name="icon-trash"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            showModal(item.path);
          }}>
          <Image
            source={item.path ? { uri: item.path } : noImage}
            style={styles.imageStyle}
            key={index}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.row}>
      {!disableUpload ? (
        <Root>
          <Button
            onPress={() =>
              ActionSheet.show(
                {
                  options: btnAction,
                  title: titleActionSheet,
                },
                buttonIndex => {
                  onActionSelectPhotoDone(buttonIndex);
                },
              )
            }
            transparent
            style={styles.btnUpload}>
            <Image source={uploadImage} style={styles.imgUpload} />
          </Button>
        </Root>
      ) : null}
      <SafeAreaView style={styles.carousel}>
        {/* <TouchableOpacity
            onPress={() => {
              carouselRef.current.snapToItem(activeIndex - 1);
            }}>
            <Icon name="chevron-back-outline" />
          </TouchableOpacity> */}

        <FlatList
          ref={carouselRef}
          data={imgArr ? imgArr : fileNames}
          numColumns={maxImage || 4}
          scrollEnabled={true}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* <Carousel
          layout={'default'}
          ref={carouselRef}
          data={imgArr ? imgArr : fileNames}
          sliderWidth={configCarousel.sliderWidth}
          itemWidth={configCarousel.itemWidth}
          renderItem={_renderItem}
          onSnapToItem={index => setActiveIndex(index)}
        /> */}

        {/* <TouchableOpacity
            onPress={() => {
              carouselRef.current.snapToItem(activeIndex + 1);
            }}>
            <Icon name="chevron-forward-outline" />
          </TouchableOpacity> */}
      </SafeAreaView>

      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={selectedImagePath ? { uri: selectedImagePath } : noImage} style={styles.zoomedImage} />
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={styles.buttonCloseModal}>
                <Icon name="close-outline" style={styles.colorIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

export default UploadImage;
