import React from 'react';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons, Entypo, AntDesign, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import loadingscreens from "./screens/app/loadingscreens";
import OnboardingScreen from "./screens/app/OnboardingScreen";
import LoginScreen from "./screens/auth/login.screen";
import RegisterScreen from "./screens/auth/register.screen";
import Forgot from './screens/auth/forgot.screen';
import Screen1 from "./screens/admin/Screen1";
import Screen2 from "./screens/admin/Screen2";
import ProfileAdminScreen from "./screens/admin/profileadmin.screen";
import AnimalScreen from "./screens/animals/animaldetails.screen";
import EditScreen from "./screens/animals/updateanimal.screen";
import HealthReport from "./screens/reporting/healthreport.screen";
import VetsScreen from "./screens/chat/vet.screen";
import AddAnimalScreen from "./screens/animals/addanimal.screen";
import TrakingScreen from "./screens/reporting/tracking.screen";
import ProfileScreen from "./screens/auth/profile.screen";
import ScanScreen from "./screens/app/ScanScreen";
import { decode, encode } from 'base-64'
import AddCattleToShopScreen from './screens/market/addtoshop.screen';
import CommentsScreen from './screens/market/comments.screen';
import shops from './screens/market/shops.screen';
import UpdateScreen from './screens/market/editshopitem.screen';
import ChatScreen from './screens/chat/chat.screen';
import RegisterOptionScreen from './screens/auth/registeroption.screen';
import MychatsScreen from './screens/chat/inbox.screen';

if (!global.btoa) {
    global.btoa = encode
}

if (!global.atob) {
    global.atob = decode
}

registerRootComponent()
const AppContainer = createStackNavigator(
    {
        default: createBottomTabNavigator(
            {
                Animal: {
                    screen: AnimalScreen,

                    navigationOptions: {
                        tabBarLabel: 'cows',

                        tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="cow" size={20} color={tintColor} />
                    }
                },
                Vets: {
                    screen: VetsScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Fontisto name="doctor" size={20} color={tintColor} />
                    }
                },

                shops: {
                    screen: shops,
                    navigationOptions: {
                        tabBarLabel: 'Market',

                        tabBarIcon: ({ tintColor }) => <AntDesign name="shoppingcart" size={20} color={tintColor} />
                    }
                },
                traking: {
                    screen: TrakingScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Entypo name="location" size={20} color={tintColor} />
                    }
                },
                Profile: {
                    screen: ProfileScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-person" size={20} color={tintColor} />
                    }
                }
            },
            {
                defaultNavigationOptions: {
                    tabBarOnPress: ({ navigation, defaultHandler }) => {
                        if (navigation.state.key === "AddAnimal") {
                            navigation.navigate("postModal");
                        } else {
                            defaultHandler();
                        }
                    }
                },
                tabBarOptions: {
                    activeTintColor: "#161F3D",
                    inactiveTintColor: "#B8BBC4",
                    showLabel: true
                }
            }
        ),
        postModal: {
            screen: AnimalScreen
        }
    },




    {
        mode: "modal",
        headerMode: "none",

    }
);

const AuthStack = createStackNavigator({
    Register: RegisterScreen,
    Login: LoginScreen,
    forgot: Forgot,
    onboardingScreen: OnboardingScreen,
    RegisterOption: RegisterOptionScreen
},
    {
        initialRouteName: "onboardingScreen"
    }
);


const ed = createStackNavigator({
    UpdateCattle: EditScreen,


});
const mychats = createStackNavigator({
    Mychats: MychatsScreen,


});

const addToshop = createStackNavigator({
    addshop: AddCattleToShopScreen,


});







const up = createStackNavigator({
    UpdatePost: UpdateScreen


});

const report = createStackNavigator({
    healthReport: HealthReport


});

const ok = createStackNavigator({
    Comments: CommentsScreen,


});


const Scan = createStackNavigator({
    scan: ScanScreen,
    AddAnimalScreen: AddAnimalScreen



});

const ch = createStackNavigator({
    Chat: ChatScreen



});

const Admin = createStackNavigator(
    {
        default: createBottomTabNavigator(
            {
                Screen1: {
                    screen: Screen1,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-home" size={24} color={tintColor} />
                    }
                },

                Screen2: {
                    screen: Screen2,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <AntDesign name="deleteuser" size={24} color={tintColor} />

                    }
                },


                ProfileAdmin: {
                    screen: ProfileAdminScreen,
                    navigationOptions: {
                        tabBarIcon: ({ tintColor }) => <Ionicons name="ios-log-out" size={24} color={tintColor} />
                    }
                }
            },
            {
                defaultNavigationOptions: {

                },
                tabBarOptions: {
                    activeTintColor: "#E9446A",
                    inactiveTintColor: "#B8BBC4",
                    showLabel: false
                }
            }
        ),
        postModal: {
            screen: ProfileAdminScreen
        }
    },
    {
        mode: "modal",
        headerMode: "none",

    }
);

icattle = createAppContainer(
    createSwitchNavigator(
        {

            loading: loadingscreens,
            App: AppContainer,
            Auth: AuthStack,
            Admin: Admin,
            rep: report,
            scan: Scan,
            ok: ok,
            addToshop: addToshop,
            ed: ed,
            up: up,
            ch: ch,
            mychats: mychats,
        },
        {
            initialRouteName: "loading"
        }
    )
)
//export default icattle
registerRootComponent(icattle);

