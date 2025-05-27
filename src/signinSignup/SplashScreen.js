// import React, {useEffect, useRef} from 'react';
// import {
//   View,
//   StyleSheet,
//   Image,
//   Text,
//   Animated,
//   Easing,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {useNavigation} from '@react-navigation/native';
// import {useSelector} from 'react-redux';
// import {h, w, f} from 'walstar-rn-responsive';

// const SplashScreen = () => {
//   const navigation = useNavigation();
//   const token = useSelector(state => state.auth.token);

//   const scaleAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Run animations
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 1000,
//         easing: Easing.out(Easing.exp),
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Navigate to screen after 2.2s
//     const timer = setTimeout(() => {
//       navigation.replace(token ? 'MainTabs' : 'Login');
//     }, 2200);

//     return () => clearTimeout(timer);
//   }, [navigation, token]);

//   return (
//     <LinearGradient
//       colors={['#F7374F', '#FF6B6B']}
//       style={styles.container}
//       start={{x: 0, y: 0}}
//       end={{x: 1, y: 0}}>
//       <Animated.View
//         style={[
//           styles.logoContainer,
//           {
//             transform: [{scale: scaleAnim}],
//           },
//         ]}>
//         <Image
//           source={require('../assets/rmc_logo.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </Animated.View>
//       <Animated.Text style={[styles.appName, {opacity: fadeAnim}]}>
//         RMC Services
//       </Animated.Text>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: w(60),
//     height: h(60),
//     tintColor: 'white',
//   },
//   appName: {
//     fontSize: f(2.8),
//     fontWeight: 'bold',
//     color: 'white',
//     marginTop: h(2),
//     textAlign: 'center',
//   },
// });

// export default SplashScreen;

import React, {useEffect} from 'react';
import {View, StyleSheet, Image, Text, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {h, w, f} from 'walstar-rn-responsive';

const SplashScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(token ? 'MainTabs' : 'Login');
    }, 2400);

    return () => clearTimeout(timer);
  }, [navigation, token]);

  return (
    <LinearGradient
      colors={['#F7374F', '#FF6B6B']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}, {translateY: slideAnim}],
          },
        ]}>
        <Image
          source={require('../assets/rmc_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          Concrete That Delivers More
          
        </Animated.Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: h(14),
    // backgroundColor:'blue'
  },
  logo: {
    width: w(100),
    height: h(40),
    tintColor: 'white',
    resizeMode: 'contain',
    shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 4.65,
    // elevation: 8,
    // backgroundColor:'red'
  },
  subtitle: {
    fontSize: h(2.6),
    // fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: -h(12),
  },
});

export default SplashScreen;
