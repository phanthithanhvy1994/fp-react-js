const btnAction = [
  {
    text: 'Take Photo',
    icon: 'camera',
  },
  {
    text: 'Choose from Library',
    icon: 'images-outline',
  },
];

const configUploadImage = {
  acceptFile: 'image/jpg,image/png,image/jpeg',
  // 4MB
  maxLenght: 4194304,
};

const titleActionSheet = 'Select Photo';
const configCarousel = { sliderWidth: 150, itemWidth: 74 };

export { btnAction, titleActionSheet, configCarousel, configUploadImage };
