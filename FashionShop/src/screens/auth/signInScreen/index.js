import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import color from '../../../constants/color';
import FONT_FAMILY from '../../../constants/fonts';
import {IC_BackwardArrow} from '../../../assets/icons';
import scale from '../../../constants/responsive';
import SaveButton from '../../../components/buttons/Save';
import {axiosPrivate} from '../../../apis/axios';
import useAuth from '../../../hooks/useAuth';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../../features/auth/userSlice';
import {initUser} from '../../../redux/actions/userActions';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import {initCartLogIn} from '../../../redux/actions/cartActions';
import {initAddress} from '../../../redux/actions/addressActions';
import OKMessageBox from '../../../components/messageBox/OKMessageBox';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

const signInPayLoadSchema = yup.object({
  email: yup
    .string()
    .required('Email cannot be blank')
    .email('Invalid email')
    .max(50, 'Email length must be less than 50 characters'),
  password: yup
    .string()
    .required('Password can not be blank')
    .min(8, 'Password length must be more than 8 characters')
    .max(16, 'Password length must be less than 16 characters')
    .matches(
      passwordRegex,
      'Password must contain uppercase, lowercase and number characters',
    ),
});

const SignInScreen = props => {
  const {auth, setAuth} = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;

  const [visible, setVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(signInPayLoadSchema),
  });
  const handleSubmits = async data => {
    try {
      setLoading(true);
      const response = await axiosPrivate.post(
        '/login',
        JSON.stringify({email: email, password: pass}),
      );
      console.log('success', JSON.stringify(response.data));
      const accessToken = response?.data?.accessToken;
      const emailVerified = response?.data?.user.emailVerified;
      const userId = response?.data?.user._id;
      dispatch(initUser(response.data.user));

      const getUserInfoFirstTime = async id => {
        try {
          console.log('userId', id);
          const responseCart = await axiosPrivate.get(
            `/get-cart-by-user-id/${id}`,
          );
          console.log('------');
          dispatch(initCartLogIn(responseCart.data));
        } catch (err) {
          console.log('err', err);
        }
      };

      const getAddressById = async id => {
        try {
          const response = await axiosPrivate.get(
            `/get-address-by-user-id/${id}`,
          );
          console.log('address: ', JSON.stringify(response?.data));
          dispatch(initAddress(response?.data?.address));
          console.log(addresses);
          setAddressDefault(
            response?.data?.address.addresses.filter(
              item => item.isDefault === true,
            ),
          );
          console.log({addressDefault});
        } catch (err) {
          console.log(err.response);
        }
      };

      setAuth({
        email: email,
        accessToken: accessToken,
        emailVerified: emailVerified,
        userId: userId,
      });
      getUserInfoFirstTime(userId);
      getAddressById(userId);
      setLoading(false);
      props.navigation.navigate('AppStackScreen');
    } catch (err) {
      console.log('err', err);
      setErrorMessage(err.message);
      setTitle('Error');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OKMessageBox
        visible={visible}
        clickCancel={() => setVisible(false)}
        title={title}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.viewIcon}
          onPress={() => props.navigation.goBack()}>
          <IC_BackwardArrow stroke={color.White} />
        </TouchableOpacity>
        <View style={styles.ViewTitleText}>
          <Text style={styles.textTile}>Welcome!</Text>
          <Text style={styles.textLabel}>Sign in to continue</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* emailInput */}
        <Controller
          name="email"
          control={control}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputMailBox}>
              <View style={styles.viewInput}>
                <TextInput
                  onChangeText={email => [onChange(email), setEmail(email)]}
                  placeholder="Email"
                  value={value}
                  placeholderTextColor={color.GraySolid}
                  style={styles.inputText}
                  keyboardType="email-address"
                />
              </View>
              {errors?.email && (
                <Text style={styles.textFailed}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        {/* passwordInput */}
        <Controller
          name="password"
          control={control}
          render={({field: {onChange, value}}) => (
            <View style={styles.inputMailBox}>
              <View style={styles.viewInput}>
                <TextInput
                  secureTextEntry={true}
                  onChangeText={password => [
                    onChange(password),
                    setPass(password),
                  ]}
                  value={value}
                  placeholder="Password"
                  placeholderTextColor={color.GraySolid}
                  style={styles.inputText}
                />
              </View>
              {errors?.password && (
                <Text style={styles.textFailed}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <View style={styles.buttonSignIn}>
          <SaveButton
            text={'Sign In'}
            onPress={handleSubmit(handleSubmits)}
            loading={loading}
          />
        </View>

        <TouchableOpacity style={styles.ViewForgotText}>
          <Text style={styles.textForgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.3,
    backgroundColor: color.TitleActive,
    justifyContent: 'flex-end',
  },
  viewIcon: {
    marginLeft: scale(30),
    width: scale(40),
    height: scale(30),
    marginTop: scale(23),
    alignItems: 'center',
  },
  ViewTitleText: {
    marginLeft: scale(30),
    marginBottom: scale(30),
  },
  textTile: {
    color: color.White,
    fontSize: 36,
    fontFamily: FONT_FAMILY.BoldSecond,
  },
  textLabel: {
    color: color.White,
    fontSize: 18,
    fontFamily: FONT_FAMILY.Regular,
  },
  body: {
    flex: 0.7,
    backgroundColor: color.White,
    alignItems: 'center',
  },

  inputMailBox: {
    marginTop: scale(10),
    width: scale(295),
    height: scale(75),
    justifyContent: 'center',
  },
  viewInput: {
    height: scale(100),
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
    borderColor: color.GraySolid,
  },
  inputText: {
    color: color.TitleActive,
    fontSize: 16,
    marginLeft: scale(5),
    fontFamily: FONT_FAMILY.Regular,
  },
  buttonSignIn: {
    marginTop: scale(61),
  },
  ViewForgotText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(21),
  },
  textForgot: {
    color: color.RedSolid,
    fontSize: 17,
    fontFamily: FONT_FAMILY.Regular,
  },
  textFailed: {
    paddingLeft: scale(25),
    marginTop: scale(7),
    justifyContent: 'center',
    fontFamily: FONT_FAMILY.Italic,
    fontSize: scale(12),
    color: color.RedSolid,
  },
});
