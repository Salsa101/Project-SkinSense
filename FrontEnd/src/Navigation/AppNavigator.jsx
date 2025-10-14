import { React, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';
import SignUp from '../Screens/SignUp';
import SignIn from '../Screens/SignIn';
import AccountOption from '../Screens/AccountOption';
import ProfilePage from '../Screens/ProfilePage';
import Calendar from '../Screens/Calendar';
import EditRoutine from '../Screens/EditRoutine';
import AddProduct from '../Screens/AddProduct';
import SkinQuiz from '../Screens/SkinQuiz';
import EditProduct from '../Screens/EditProduct';
import News from '../Screens/News';

import RNBootSplash from 'react-native-bootsplash';
import api from '../api';
import CategoryNews from '../Screens/CategoryNews';
import NewsDetail from '../Screens/NewsDetail';
import BookmarkLists from '../Screens/BookmarkLists';
import LandingPage from '../Screens/LandingPage';
import SkinGuide from '../Screens/SkinGuide';
import FaceScan1 from '../Screens/FaceScan1';
import FaceScan2 from '../Screens/FaceScan2';
import Profil from '../Screens/Profil';
import AddJournal from '../Screens/AddJournal';
import JournalDetail from '../Screens/JournalDetail';
import EditJournal from '../Screens/EditJournal';
import StepRoutine from '../Screens/StepRoutine';
import SkincareGuide from '../Screens/SkincareGuide';
import CompareScan from '../Screens/CompareScan';
import HistoryScan from '../Screens/HistoryScan';
import HistoryQuiz from '../Screens/HistoryQuiz';
import CompareResult from '../Screens/CompareResult';
import PAOInfo from '../Screens/PAOInfo';
import EditProfile from '../Screens/EditProfile';
import ChangePassword from '../Screens/ChangePassword';
import ForgotPassword from '../Screens/ForgotPassword';
import ResetPassword from '../Screens/ResetPassword';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/home');

        if (response.data?.user) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('AccountOption');
        }
      } catch (error) {
        console.log('Auth check failed:', error.message);
        setInitialRoute('AccountOption');
      }
    };

    checkAuth();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer
      onReady={async () => await RNBootSplash.hide({ fade: true })}
    >
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="AccountOption"
          component={AccountOption}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfilePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calendar"
          component={Calendar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditRoutine"
          component={EditRoutine}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SkinQuiz"
          component={SkinQuiz}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="News"
          component={News}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoryNews"
          component={CategoryNews}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewsDetail"
          component={NewsDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookmarkLists"
          component={BookmarkLists}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SkinGuide"
          component={SkinGuide}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FaceScan1"
          component={FaceScan1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FaceScan2"
          component={FaceScan2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddJournal"
          component={AddJournal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JournalDetail"
          component={JournalDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditJournal"
          component={EditJournal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profil"
          component={Profil}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StepRoutine"
          component={StepRoutine}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SkincareGuide"
          component={SkincareGuide}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompareScan"
          component={CompareScan}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompareResult"
          component={CompareResult}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HistoryScan"
          component={HistoryScan}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HistoryQuiz"
          component={HistoryQuiz}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PAOInfo"
          component={PAOInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
