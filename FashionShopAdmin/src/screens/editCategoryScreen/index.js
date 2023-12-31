import {StyleSheet, Text, View, SafeAreaView, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

//component
import color from '../../constants/color';
import FONT_FAMILY from '../../constants/fonts';
import {IC_Backward} from '../../assets/icons';
import scale from '../../constants/responsive';
import SingleLine from '../../components/inputTexts/singleLine';
import SaveButton from '../../components/buttons/Save';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Message from '../../components/alearts.js/messageOnly';
import HeaderMin from '../../components/header/headerMin';

const EditCategoryScreen = props => {
  const {parentId, name, description, isChild, id} = props.route.params;
  console.log('1', props.route.params);
  console.log({parentId, name, description});
  const [newCategory, setNewCategory] = useState({
    name: name,
    description: description,
    parentId: parentId,
    id: id,
    isChild: isChild,
  });
  const [parentCategories, setParentCategories] = useState([]);
  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const addCategorySchema = yup.object({
    name: yup
      .string()
      .required('Name cannot be blank')
      .max(100, 'Name length must be less than 100 characters'),
    description: yup
      .string()
      .required('Description cannot be blank')
      .min(5, 'A description must have minimum of 1 character')
      .max(500, 'A description must have maximum of 500 character'),
    parent: newCategory.isChild
      ? yup.string()
      : null,
  });

  // yup
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: name,
      description: description,
      parent: parentId,
    },
    resolver: yupResolver(addCategorySchema),
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCategory = async () => {
      try {
        const response = await axiosPrivate.get('/all-categories', {
          signal: controller.signal,
        });
        isMounted && setData(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };

    getCategory();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  useEffect(() => {
    const handleCategory = async () => {
      let parentCat = [{}];
      parentCat = data.filter(item => !item.parentId);
      parentCat = parentCat.map(item => ({
        label: item.name,
        value: item._id,
      }));

      setParentCategories(parentCat);
    };

    handleCategory();
  }, [data]);
  useEffect(() => {
    console.log({newCategory});
  }, [newCategory]);

  const [tagOpen, setTagOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmits = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.put(
        `/category/${newCategory.id}`,
        JSON.stringify({
          name: newCategory.name,
          parentId: isChild? newCategory.parentId: undefined,
          description: newCategory.description,
        }),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        },
      );
      console.log('success', JSON.stringify(response.data));
      setTitle('Success');
      setMessage(`Update category with Name: ${newCategory.name} successfully`);
      setLoading(false);
    } catch (err) {
      console.log('err', err.response.data);
      setTitle('Error');
      setMessage(err.response.data.error);
      setLoading(false);
    } finally {
      setVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <HeaderMin
        text={'Edit category'}
        onPress={() => props.navigation.goBack()}
      />
      <View style={styles.body}>
        <View style={styles.viewTextTitle}>
          <Text style={styles.textTitle}>Category information</Text>
        </View>

        {/* name */}
        <Controller
          name="name"
          control={control}
          render={({field: {onChange, value}}) => (
            <View style={styles.viewTextInput}>
              <TextInput
                style={styles.inputText}
                placeholder={'Name'}
                placeholderTextColor={color.PlaceHolder}
                selectionColor={color.TitleActive}
                keyboardAppearance="dark"
                onChangeText={text =>
                  setNewCategory({...newCategory, name: text}, onChange(text))
                } //test again
                //value={value}
                defaultValue={`${newCategory.name}`}
              />
              {errors?.name && (
                <Text style={styles.textFailed}>{errors.name.message}</Text>
              )}
            </View>
          )}
        />

        {/* parent */}

        {isChild ? (
          <Controller
          name="name"
          control={control}
          render={({field: {onChange, value}}) => (
            <>
            <View style={styles.categoryBox}>
            <View>
              <DropDownPicker
                // listMode="MODAL"
                listMode="FLATLIST"
                open={tagOpen}
                placeholder="Parent"
                style={styles.categoryDropDown}
                textStyle={styles.dropdownText}
                items={parentCategories}
                setOpen={setTagOpen}
                value={newCategory.parentId}
                onSelectItem={item =>
                  setNewCategory({...newCategory, parentId: item.value})
                }
                dropDownContainerStyle={{borderRadius: 0}}
                listItemContainerStyle={{backgroundColor: color.White}}
              />
            </View>
          </View>
          {errors?.parent && (
                <Text style={styles.textFailed}>{errors.parent.message}</Text>
              )}
          </>

          )}/>
          
        ) : null}

        {/* description */}
        <Controller
          name="description"
          control={control}
          render={({field: {onChange, value}}) => (
            <View>
              <Text style={styles.propText}>Description</Text>
              <TextInput
                style={styles.multiLineInputText}
                selectionColor={color.GraySolid}
                keyboardAppearance="dark"
                multiline={true}
                maxLength={500}
                onChangeText={text =>
                  setNewCategory(
                    {...newCategory, description: text},
                    onChange(text),
                  )
                }
                defaultValue={newCategory.description}
              />
              {errors?.description && (
                <Text style={styles.textFailed}>
                  {errors.description.message}
                </Text>
              )}
            </View>
          )}
        />

        <View style={styles.buttonView}>
          <SaveButton
            text={'Edit category'}
            onPress={handleSubmit(handleSubmits)}
          />
        </View>
      </View>
      <Message
        visible={visible}
        title={title}
        clickCancel={() => {
          if (title === 'Success') {
            props.navigation.goBack();
          } else {
            setVisible(false);
          }
        }}
        message={message}
      />
    </SafeAreaView>
  );
};

export default EditCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: color.TitleActive,
    flex: 0.1,
    alignItems: 'center',
  },
  textHeader: {
    color: color.White,
    fontFamily: FONT_FAMILY.Bold,
    fontSize: 24,
  },
  body: {
    flex: 0.9,
    backgroundColor: color.White,
    paddingHorizontal: scale(15),
  },
  viewTextTitle: {
    marginTop: scale(15),
  },
  textTitle: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Bold,
    fontSize: 22,
  },
  inputText: {
    color: color.TitleActive,
    borderBottomWidth: 1,
    borderBottomColor: color.PlaceHolder,
    marginTop: scale(10),
    fontFamily: FONT_FAMILY.Regular,
    textAlignVertical: 'bottom',
    paddingHorizontal: scale(10),
    fontSize: scale(16),
    paddingBottom: scale(5),
  },
  multiLineInputText: {
    color: color.TitleActive,
    borderWidth: 1,
    borderColor: color.PlaceHolder,
    fontFamily: FONT_FAMILY.Regular,
    textAlignVertical: 'top',
    fontSize: scale(16),
    paddingBottom: scale(5),
    minHeight: scale(108),
    maxHeight: scale(150),
    alignContent: 'center',
    paddingHorizontal: scale(10),
  },
  categoryBox: {
    marginTop: scale(15),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: scale(15),
    alignSelf: 'flex-start',
    zIndex: 1,
  },
  categoryDropDown: {
    borderRadius: 0,
    borderColor: color.PlaceHolder,
    width: scale(120),
    paddingVertical: 15,
  },
  dropdownText: {
    color: color.TitleActive,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: scale(16),
  },
  propText: {
    color: color.PlaceHolder,
    fontFamily: FONT_FAMILY.Bold,
    fontSize: scale(16),
    marginLeft: scale(3),
    marginTop: scale(20),
  },
  buttonView: {
    alignItems: 'center',
    marginTop: scale(30),
  },
  //fail
  textFailed: {
    paddingLeft: scale(25),
    justifyContent: 'center',
    fontFamily: FONT_FAMILY.Italic,
    fontSize: scale(12),
    color: color.RedSolid,
  },
});
