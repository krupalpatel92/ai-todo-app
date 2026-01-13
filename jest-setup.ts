// Mock Expo winter runtime
(global as any).__ExpoImportMetaRegistry = new Map();

// Mock structuredClone if not available
if (typeof (global as any).structuredClone === 'undefined') {
  (global as any).structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

// Suppress Expo winter runtime warnings in tests
jest.mock('expo/src/winter/runtime.native', () => ({}), { virtual: true });
jest.mock('expo/src/winter/installGlobal', () => ({}), { virtual: true });

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  authenticateAsync: jest.fn(() =>
    Promise.resolve({
      success: true,
    })
  ),
  SecurityLevel: {
    NONE: 0,
    SECRET: 1,
    BIOMETRIC_WEAK: 2,
    BIOMETRIC_STRONG: 3,
  },
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
  supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1])),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
    GestureDetector: View,
    Gesture: {
      Tap: () => ({
        enabled: jest.fn().mockReturnThis(),
        onBegin: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      }),
    },
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const View = require('react-native').View;
  const forwardRef = require('react').forwardRef;

  const BottomSheet = forwardRef((props: any, _ref: any) => {
    return View(props);
  });

  return {
    __esModule: true,
    default: BottomSheet,
    BottomSheetBackdrop: View,
    BottomSheetScrollView: View,
    BottomSheetTextInput: require('react-native').TextInput,
  };
});
