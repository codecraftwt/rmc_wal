import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {h, w, f} from 'walstar-rn-responsive';

const Header = ({
  title,
  navigation,
  // showBackButton = true,
  showBackButton,
  rightIcon,
  onRightIconPress,
  gradientColors = ['#F7374F', '#FF6B6B'],
   onBackPress,
   style
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.header, style]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => (onBackPress ? onBackPress() : navigation.goBack())}
            style={styles.backButton}>
            <Icon name="arrow-back" size={f(3.5)} color="white" />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>{title}</Text>

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightButton}>
            <Icon name={rightIcon} size={f(3.6)} color="white" />
          </TouchableOpacity>
        )}

        {!rightIcon && showBackButton && <View style={{width: f(3.5)}} />}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: h(4),
    borderBottomLeftRadius: w(8),
    borderBottomRightRadius: w(8),
    paddingTop: h(4.6),
    paddingHorizontal: w(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: h(1),
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: w(4),
    paddingTop: h(1.2),
    zIndex: 1,
  },
  headerTitle: {
    fontSize: f(2.8),
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: w(4),
  },
  backButton: {
    padding: w(1),
  },
  rightButton: {
    padding: w(1),
  },
});

export default Header;
