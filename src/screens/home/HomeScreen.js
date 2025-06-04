import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {h, w, f} from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../component/Header';

const HomeScreen = ({navigation}) => {
  const cards = [
    {
      id: 1,
      title: 'Material Dispatched',
      content: 'View dispatched materials',
      icon: 'cube-outline',
      colors: ['#FF9A5A', '#FF7D54'],
      navigateTo: 'MaterialScreen',
    },
    {
      id: 2,
      title: 'Material Inward',
      content: 'Check current stock levels',
      icon: 'archive-outline',
      colors: ['#8A7CFF', '#756AB6'],
      navigateTo: 'MaterialInward',
    },
    {
      id: 3,
      title: 'Upcoming Orders',
      content: 'Add, Manage and View all orders',
      icon: 'clipboard-outline',
      colors: ['#6BAAFF', '#4D96FF'],
      navigateTo: 'UpcomingOrders',
    },
    {
      id: 4,
      title: 'Customers',
      content: 'Add, Manage and View all customers',
      icon: 'bar-chart-outline',
      colors: ['#83D78F', '#6BCB77'],
      // navigateTo: 'AddCustomers',
      navigateTo: 'Customers',
      
    },
  ];
  
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Exit',
            onPress: () => BackHandler.exitApp(),
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);
  return (
    <>
      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.statusBarArea}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <SafeAreaView edges={['top']} style={styles.statusBarAreaInner} />
      </LinearGradient>

      <View style={styles.mainContainer}>
        <Header title="Manage Material Details" navigation={navigation} />

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>

          <View style={styles.gridContainer}>
            {cards.map(card => (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, {borderTopColor: card.colors[1]}]}
                // onPress={() => navigation.navigate(card.navigateTo)}>
                onPress={() => card.navigateTo ? navigation.navigate(card.navigateTo) : null}>
                <LinearGradient
                  colors={card.colors}
                  style={styles.iconContainer}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon name={card.icon} size={f(3.5)} color="white" />
                </LinearGradient>

                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardContent}>{card.content}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.newLeadsButton]}>
                <LinearGradient
                  colors={['#FF7B7B', '#F7374F']}
                  style={styles.buttonIconContainer}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon name="add-circle" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.actionText}>New Leads</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.projectsButton]}>
                <LinearGradient
                  colors={['#7B8AFF', '#374AF7']}
                  style={styles.buttonIconContainer}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon name="layers-outline" size={24} color="white" />
                </LinearGradient>
                <Text style={[styles.actionText, {color: '#374AF7'}]}>
                  Projects
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  statusBarArea: {
    height: h(2),
  },
  statusBarAreaInner: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flexGrow: 1,
    padding: w(4),
    paddingTop: h(1),
  },
  welcomeText: {
    fontSize: f(3.5),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: h(2.8),
    marginTop: h(2.3),
  },
  subtitle: {
    fontSize: f(2),
    color: '#666',
    marginBottom: h(3),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: h(3),
  },
  card: {
    width: w(44),
    backgroundColor: '#FFFFFF',
    borderRadius: w(3),
    padding: w(4),
    marginBottom: h(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: h(0.3)},
    shadowOpacity: 0.1,
    shadowRadius: w(1),
    elevation: 3,
    borderTopWidth: h(0.55),
    alignItems: 'center',
  },
  iconContainer: {
    width: w(12),
    height: w(12),
    borderRadius: w(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: h(1.5),
  },
  cardTitle: {
    fontSize: f(2.2),
    fontWeight: '600',
    marginBottom: h(0.5),
    color: '#333',
    textAlign: 'center',
  },
  cardContent: {
    fontSize: f(1.8),
    color: '#666',
    textAlign: 'center',
    lineHeight: h(2.5),
  },
  quickActions: {
    marginTop: h(1),
  },
  sectionTitle: {
    fontSize: f(2.5),
    fontWeight: '600',
    color: '#333',
    marginBottom: h(1),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 16,
  },
  actionButton: {
    width: '49%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
    color: '#F7374F',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  newLeadsButton: {
    borderTopWidth: 3,
    borderTopColor: '#F7374F',
  },
  projectsButton: {
    borderTopWidth: 3,
    borderTopColor: '#374AF7',
  },
});

export default HomeScreen;
