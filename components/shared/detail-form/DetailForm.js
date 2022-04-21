import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'native-base';
import isEmpty from 'lodash/isEmpty';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import Field from '../fields/field';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {stepStyle, detailStyle} from './detail-form.style';
import {stepConst, detailFormConstant, MessageConstant} from '../../../constants/constants';
import TimeComponent from './TimeComponent';
import {useFormik} from 'formik';
import AddHistory from '../add-history/AddHistory';
import {
  openCustomButtonHeader,
  closeCustomButtonHeader,
} from '../../../redux/button-header/ButtonHeader.action';
import { showMessage } from '../../../utils/message-util';

function useOnMount(handler) {
  return React.useEffect(handler, []);
}

const DetailForm = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const {
    handleChange,
    handleSubmit,
    setErrors,
    errors,
    validateForm,
  } = useFormik({
    validationSchema: props.validationSchema,
    enableReinitialize: true,
    initialValues: props.detailData || {},
    onSubmit: values => { },
  });
  const {
    configStep,
    navigation,
    onFieldChange,
    disableFld,
    checkDisable,
    onSubmitEditing,
    handleSaveFstStep,
    handleSaveSndStep,
    isBranchPOType,
    lastViewArr,
    attachedImagesFieldArr,
    handleSaveLastStep,
    lastStepFieldChange,
    handleRenderLastStep,
    handleUploadImg,
    onCustomNextStep,
    detailData,
    isDisplayRemainingTime,
    isShowHistoryTimeLine,
    historyTimeLineData,
    bottomActionNextBtnConfig,
    handleForSaveButton,
    handleForSubmitButton,
    stepLabelArr,
    isCustomButtonHeader,
    customButtonStep,
    disabledBackBtnFromMainView,
    screenList,
    stepTime,
    configTime,
    isEditPage,
	  handleForFullWidthButton,
  } = props;
  const [curTime, setCurTime] = React.useState(new Date().toLocaleTimeString());
  const [labelTime, setLabelTime] = React.useState([]);
  const [fstFieldArr, setFields] = React.useState(configStep);
  const timeComponent = React.useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  if (stepTime && stepTime.length !== 0 && stepTime !== labelTime) {
    setLabelTime(stepTime);
  }
  if (JSON.stringify(fstFieldArr) !== JSON.stringify(configStep)) {
    setFields(configStep);
  }
  React.useImperativeHandle(ref, () => ({
    getTime(step) {
      timeComponent.current.getTime(step);
    },
    setRenderNextComponent(times) {
      setActiveStep(activeStep + 1);
      if (!isEditPage) {
        !labelTime[activeStep] && setLabelTime([...labelTime, times]);
      }
    },
  }));
  // const onNextStep = step => {
  //   timeComponent.current.getTime(step);
  // };

  // Content view that only contains fields list
  const renderNormalView = fieldsArray => {
    const isHasHistoryTimeLine =
      isShowHistoryTimeLine && !isEmpty(historyTimeLineData);

    return (
      <View style={detailStyle.normalViewCtn}>
        <Field
          conditionalArray={fieldsArray || []}
          onChange={e => {
            handleChange(e);
            onFieldChange(e);
          }}
          onSubmitEditing={onSubmitEditing}
          navigation={navigation}
          errors={errors}
        />
        {isHasHistoryTimeLine && <AddHistory data={historyTimeLineData} />}
      </View>
    );
  };

  // Render content view that contains a list of item (like a list page)
  const renderListItems = listItems => {
    const listData = listItems.listData || [];
    const beforeLineItem = listItems.beforeLineItem;
    const afterLineItem = listItems.afterLineItem;
    const lineItem = listItems.lineItem;
    return listData.map((item, index) => (
      <View key={index}>
        {beforeLineItem && beforeLineItem.view(item, index)}
        {lineItem && lineItem.view(item, index)}
        {afterLineItem && afterLineItem.view(item, index)}
      </View>
    ));
  };

  // Render custom content view, can pass a view component
  const renderCustomView = customView => {
    return customView && customView.view();
  };

  const renderByStep = (lineItems, type) => {
    switch (type) {
      case detailFormConstant.viewType.listItems:
        return renderListItems(lineItems);
      case detailFormConstant.viewType.customView:
        return renderCustomView(lineItems);
      default:
        return renderNormalView(lineItems);
    }
  };

  const currentStep = activeStep => {
    if (activeStep === customButtonStep.stepCustom - 1) {
      openCustomButtonHeader({
        buttons: customButtonStep.buttonCustom,
      });
    } else {
      closeCustomButtonHeader();
    }
  };

  const handleGetTime = (time, remainTime, stepFunc) => {
    stepFunc(time, remainTime);
  };

  // Detect first and last step
  const disabledAllNextBtn = activeStep === configStep.length;
  const disabledBackBtn = disabledBackBtnFromMainView !== undefined ? disabledBackBtnFromMainView : activeStep === 0;
  const disabledNextBtn =
    activeStep === configStep.length - 1 || disabledAllNextBtn;
  const disabledSubmitBtn = activeStep === configStep.length;
  const isShowSaveButton =
    !isEmpty(
      bottomActionNextBtnConfig && bottomActionNextBtnConfig[activeStep],
    ) && bottomActionNextBtnConfig[activeStep].save;
  const isShowSubmitBtn =
    !isEmpty(
      bottomActionNextBtnConfig && bottomActionNextBtnConfig[activeStep],
    ) && bottomActionNextBtnConfig[activeStep].submit;
  const isShowNextBtn = !isShowSaveButton && !isShowSubmitBtn;
  const isShowFullWidthBtn =
    !isEmpty(
      bottomActionNextBtnConfig && bottomActionNextBtnConfig[activeStep],
    ) && bottomActionNextBtnConfig[activeStep].fullWidthBtn;

  const fullWidthBtnStyles =
    !isEmpty(
      bottomActionNextBtnConfig && bottomActionNextBtnConfig[activeStep],
    ) && bottomActionNextBtnConfig[activeStep].fullWidthBtn?.styles;

  // Label for all steps
  let stepLabelArray = [];
  if (!isEmpty(stepLabelArr) && stepLabelArr.length) {
    stepLabelArray = stepLabelArr;
  }

  return (
    <View style={detailStyle.viewFlex}>
      <View style={detailStyle.lineStepBarCover} />
      <ProgressSteps
        activeStepIconColor={stepStyle.activeStepIconColor}
        activeStepIconBorderColor={stepStyle.activeStepIconBorderColor}
        activeLabelColor={stepStyle.activeLabelColor}
        completedStepIconColor={stepStyle.completedStepIconColor}
        completedProgressBarColor={stepStyle.progressBarColor}
        progressBarColor={stepStyle.progressBarColor}
        activeStep={activeStep}
        borderWidth={stepStyle.borderWidth}>
        {configStep.map((step, index) => (
          <ProgressStep
            key={index}
            label={
              labelTime[index] || stepLabelArray[index] || `Step ${index + 1}`
            }
            removeBtnRow={true}
            nextBtnDisabled={checkDisable}>
            {step.fieldsArray && renderByStep(step.fieldsArray)}
            {step.listItems &&
              renderByStep(
                step.listItems,
                detailFormConstant.viewType.listItems,
              )}
            {step.customView &&
              renderByStep(
                step.customView,
                detailFormConstant.viewType.customView,
              )}
          </ProgressStep>
        ))}
      </ProgressSteps>
      {isDisplayRemainingTime && (
        <TimeComponent
          isBranchPOType={isBranchPOType}
          configTime={configTime}
          handleGetTime={handleGetTime}
          ref={timeComponent}
        />
      )}
      {/* render for step bottom button */}
      <View style={stepStyle.stepActionBtn}>
        <View style={stepStyle.stepActionBtnChild}>
          <TouchableOpacity
            style={[
              disabledBackBtn && stepStyle.disabledBtnStyle,
              stepStyle.buttonBackStyle,
            ]}
            disabled={disabledBackBtn}
            onPress={() => {
              if (activeStep === 0) {
                showMessage(t(MessageConstant.confirmBackToScreenList), () => {
                  navigation.navigate(screenList);
                }, true);
                return;
              }
              setActiveStep(activeStep - 1);
              isCustomButtonHeader && currentStep(activeStep - 1);
            }}>
            <Icon
              style={stepStyle.iconBack}
              type="FontAwesome"
              name="angle-left"
            />
            <Text style={stepStyle.buttonNextTextStyle}>{'BACK'}</Text>
          </TouchableOpacity>
        </View>
        <View style={stepStyle.stepActionBtnChild}>
          {isShowNextBtn && (
            <TouchableOpacity
              style={[
                disabledNextBtn && stepStyle.disabledBtnStyle,
                stepStyle.buttonNextStyle,
              ]}
              disabled={disabledNextBtn}
              onPress={() => {
                validateForm().then(error => {
                  setErrors(error);
                  const errorsLength = error && Object.keys(error).length;
                  if (!errorsLength) {
                    onCustomNextStep && onCustomNextStep(activeStep + 1);
                    setActiveStep(activeStep + 1);
                    isCustomButtonHeader && currentStep(activeStep + 1);
                  }
                });
              }}>
              <Icon
                style={stepStyle.iconNext}
                type="FontAwesome"
                name="angle-right"
              />
              <Text style={stepStyle.buttonNextTextStyle}>{'NEXT'}</Text>
            </TouchableOpacity>
          )}
          {isShowSaveButton && (
            <TouchableOpacity
              style={stepStyle.buttonSaveStyle}
              onPress={() => {
                validateForm().then(error => {
                  setErrors(error);
                  const errorsLength = error && Object.keys(error).length;
                  if (!errorsLength) {
                    handleForSaveButton && handleForSaveButton(activeStep).then(res => {
                      setActiveStep(activeStep + 1);
                      isCustomButtonHeader && currentStep(activeStep +1 );
                    });
                  }
                });
              }}>
              <Icon
                style={stepStyle.whiteArrowNextIcon}
                type="FontAwesome"
                name="angle-right"
              />
              <Text style={stepStyle.buttonWhiteTextStyle}>{'SAVE'}</Text>
            </TouchableOpacity>
          )}
          {isShowSubmitBtn && (
            <TouchableOpacity
              style={[
                disabledSubmitBtn && stepStyle.disabledBtnStyle,
                stepStyle.buttonSubmitStyle,
              ]}
              disabled={disabledSubmitBtn}
              onPress={() => {
                validateForm().then(error => {
                  setErrors(error);
                  const errorsLength = error && Object.keys(error).length;
                  if (!errorsLength) {
                    handleForSubmitButton && handleForSubmitButton(activeStep).then(res => {
                      if (activeStep < configStep.length - 1) {
                        setActiveStep(activeStep + 1);
                      }
                    });
                  }
                });
              }}>
              <Text style={stepStyle.buttonWhiteTextStyle}>{'SUBMIT'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* FULL WIDTH BUTTON */}
      {isShowFullWidthBtn && (<View style={stepStyle.fullWidthBtnArea}>
        <View style={stepStyle.actionChildArea}>
          <Button
            style={fullWidthBtnStyles.fullWidthBtn}
            full
            type="outline"
            onPress={handleForFullWidthButton}
            disabled={bottomActionNextBtnConfig[activeStep].fullWidthBtn?.disabled}
          >
            <Text style={fullWidthBtnStyles.fullWidthBtnLabel}>{bottomActionNextBtnConfig[activeStep].fullWidthBtn?.label}</Text>
          </Button>
        </View>
      </View>)}
    </View>
  );
});
export default DetailForm;
