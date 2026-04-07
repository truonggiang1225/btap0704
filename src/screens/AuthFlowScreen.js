import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const STEPS = {
  onboarding: 'onboarding',
  signIn: 'signIn',
  number: 'number',
  verification: 'verification',
  location: 'location',
  login: 'login',
  signUp: 'signUp',
};

const COLORS = {
  primary: '#53B175',
  primaryMuted: '#7CC98A',
  primaryDark: '#3E9A5F',
  text: '#181725',
  textSoft: '#7C7C7C',
  textFaint: '#B1B1B1',
  border: '#E2E2E2',
  white: '#FFFFFF',
  blue: '#5383EC',
  navy: '#4A66AC',
  peach: '#FFF1EA',
  sky: '#EEF7FF',
  lavender: '#F3EEFF',
  background: '#EEF3EE',
};

const ASSETS = {
  logoWhite: require('../../assets/auth/logo-white.png'),
  carrot: require('../../assets/auth/carrot.png'),
  heroGroceries: require('../../assets/auth/hero-groceries.png'),
  locationIllustration: require('../../assets/auth/location-illustration.png'),
  onboardingPortrait: require('../../assets/auth/onboarding-portrait.png'),
};

const INITIAL_FORM = {
  phone: '',
  code: '',
  zone: 'Banasree',
  area: '',
  loginEmail: '',
  loginPassword: '',
  signUpName: '',
  signUpEmail: '',
  signUpPassword: '',
};

function showNotice(title, message) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

function PrimaryButton({ title, onPress, disabled, style }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

function ArrowButton({ onPress, disabled }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.arrowButton,
        disabled && styles.primaryButtonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Feather name="chevron-right" size={24} color="#FFFFFF" />
    </Pressable>
  );
}

function BackButton({ onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
      <Ionicons name="chevron-back" size={20} color={COLORS.text} />
    </Pressable>
  );
}

function HeroBackdrop() {
  return (
    <>
      <View pointerEvents="none" style={styles.backdropLayer}>
        <View style={[styles.blurOrb, styles.orbPeach]} />
        <View style={[styles.blurOrb, styles.orbSky]} />
        <View style={[styles.blurOrb, styles.orbLavender]} />
      </View>
      <Image source={ASSETS.heroGroceries} style={styles.heroBanner} resizeMode="cover" />
    </>
  );
}

function UnderlineInput({ label, value, onChangeText, prefix, placeholder, maxLength, keyboardType }) {
  return (
    <View style={styles.underlineBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.underlineField}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textFaint}
          keyboardType={keyboardType}
          maxLength={maxLength}
          selectionColor={COLORS.primary}
          style={styles.underlineInput}
        />
      </View>
    </View>
  );
}

function CardInput({
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType,
  autoCapitalize = 'sentences',
  secureTextEntry,
  trailing,
}) {
  return (
    <View style={styles.cardInput}>
      <View style={styles.cardIcon}>{icon}</View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textFaint}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        selectionColor={COLORS.primary}
        style={styles.cardTextInput}
      />
      {trailing ? <View style={styles.cardTrailing}>{trailing}</View> : null}
    </View>
  );
}

function SelectionInput({ label, value, onChangeText, placeholder }) {
  return (
    <View style={styles.selectionBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.selectionField}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textFaint}
          selectionColor={COLORS.primary}
          style={styles.selectionInput}
        />
        <Ionicons name="chevron-down" size={18} color={COLORS.textSoft} />
      </View>
    </View>
  );
}

function SocialButton({ title, backgroundColor, icon, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.socialButton, { backgroundColor }, pressed && styles.buttonPressed]}
    >
      <View style={styles.socialIcon}>{icon}</View>
      <Text style={styles.socialText}>{title}</Text>
    </Pressable>
  );
}

function AuthContainer({ children }) {
  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function AuthFlowScreen({ onAuthenticated }) {
  const [step, setStep] = useState(STEPS.onboarding);
  const [showSplash, setShowSplash] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timeoutId);
  }, []);

  const canProceedPhone = form.phone.trim().length >= 7;
  const canProceedCode = form.code.trim().length === 4;
  const canLogin = useMemo(
    () => form.loginEmail.trim().length > 0 && form.loginPassword.trim().length > 0,
    [form.loginEmail, form.loginPassword]
  );
  const canSignUp = useMemo(
    () =>
      form.signUpName.trim().length > 0 &&
      form.signUpEmail.trim().length > 0 &&
      form.signUpPassword.trim().length > 0,
    [form.signUpName, form.signUpEmail, form.signUpPassword]
  );

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleLogin = async () => {
    if (!canLogin) {
      showNotice('Login', 'Please enter both your email and password.');
      return;
    }

    await onAuthenticated?.({
      email: form.loginEmail.trim(),
      name: form.signUpName.trim(),
      zone: form.zone.trim(),
      area: form.area.trim(),
    });
  };

  const handleSignUp = () => {
    if (!canSignUp) {
      showNotice('Sign up', 'Please complete all fields before continuing.');
      return;
    }

    setForm((current) => ({
      ...current,
      loginEmail: current.signUpEmail.trim(),
      loginPassword: '',
    }));
    setStep(STEPS.login);
    showNotice('Account created', 'Your login email has been prefilled. Continue with Log In.');
  };

  if (showSplash) {
    return (
      <View style={styles.appBackground}>
        <StatusBar style="light" />
        <View style={styles.deviceFrame}>
          <View style={styles.splashScreen}>
            <Image source={ASSETS.logoWhite} style={styles.splashLogo} resizeMode="contain" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.appBackground}>
      <StatusBar style={step === STEPS.onboarding ? 'light' : 'dark'} />
      <View style={styles.deviceFrame}>
        {step === STEPS.onboarding ? (
          <ImageBackground source={ASSETS.onboardingPortrait} style={styles.onboardingScreen}>
            <View style={styles.onboardingOverlay} />
            <SafeAreaView style={styles.flex}>
              <View style={styles.onboardingContent}>
                <Image source={ASSETS.carrot} style={styles.onboardingBadge} resizeMode="contain" />
                <Text style={styles.onboardingTitle}>Welcome to our store</Text>
                <Text style={styles.onboardingSubtitle}>Get your groceries in as fast as one hour</Text>
                <PrimaryButton title="Get Started" onPress={() => setStep(STEPS.signIn)} />
              </View>
            </SafeAreaView>
          </ImageBackground>
        ) : null}

        {step === STEPS.signIn ? (
          <View style={styles.screenBase}>
            <Image source={ASSETS.heroGroceries} style={styles.signInHero} resizeMode="cover" />
            <AuthContainer>
              <View style={styles.signInCard}>
                <Image source={ASSETS.carrot} style={styles.brandIcon} resizeMode="contain" />
                <Text style={styles.mainTitle}>Get your groceries with nectar</Text>
                <Pressable onPress={() => setStep(STEPS.number)} style={({ pressed }) => [styles.countryPicker, pressed && styles.pressed]}>
                  <View style={styles.countryLeft}>
                    <View style={styles.flagBadge}>
                      <Text style={styles.flagText}>BD</Text>
                    </View>
                    <Text style={styles.countryCode}>+880</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={COLORS.textSoft} />
                </Pressable>
                <Text style={styles.socialHelper}>Or connect with social media</Text>
                <SocialButton
                  title="Continue with Google"
                  backgroundColor={COLORS.blue}
                  icon={<FontAwesome name="google" size={20} color="#FFFFFF" />}
                  onPress={() => showNotice('Google', 'This button is styled and ready for your Google auth flow.')}
                />
                <SocialButton
                  title="Continue with Facebook"
                  backgroundColor={COLORS.navy}
                  icon={<FontAwesome name="facebook" size={20} color="#FFFFFF" />}
                  onPress={() => showNotice('Facebook', 'This button is styled and ready for your Facebook auth flow.')}
                />
              </View>
            </AuthContainer>
          </View>
        ) : null}

        {step === STEPS.number ? (
          <View style={styles.formScreen}>
            <HeroBackdrop />
            <SafeAreaView style={styles.flex}>
              <BackButton onPress={() => setStep(STEPS.signIn)} />
              <AuthContainer>
                <View style={styles.formScrollContent}>
                  <Text style={styles.formTitle}>Enter your mobile number</Text>
                  <UnderlineInput
                    label="Mobile Number"
                    prefix="+880"
                    value={form.phone}
                    onChangeText={(value) => updateField('phone', value.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    placeholder="1712345678"
                    maxLength={10}
                  />
                  <View style={styles.arrowButtonRow}>
                    <ArrowButton onPress={() => setStep(STEPS.verification)} disabled={!canProceedPhone} />
                  </View>
                </View>
              </AuthContainer>
            </SafeAreaView>
          </View>
        ) : null}

        {step === STEPS.verification ? (
          <View style={styles.formScreen}>
            <HeroBackdrop />
            <SafeAreaView style={styles.flex}>
              <BackButton onPress={() => setStep(STEPS.number)} />
              <AuthContainer>
                <View style={styles.formScrollContent}>
                  <Text style={styles.formTitle}>Enter your 4-digit code</Text>
                  <UnderlineInput
                    label="Code"
                    value={form.code}
                    onChangeText={(value) => updateField('code', value.replace(/[^0-9]/g, '').slice(0, 4))}
                    keyboardType="number-pad"
                    placeholder="- - - -"
                    maxLength={4}
                  />
                  <Pressable onPress={() => updateField('code', '')} style={({ pressed }) => [styles.inlineLinkWrap, pressed && styles.pressed]}>
                    <Text style={styles.inlineLink}>Resend Code</Text>
                  </Pressable>
                  <View style={styles.arrowButtonRow}>
                    <ArrowButton onPress={() => setStep(STEPS.location)} disabled={!canProceedCode} />
                  </View>
                </View>
              </AuthContainer>
            </SafeAreaView>
          </View>
        ) : null}

        {step === STEPS.location ? (
          <View style={styles.formScreen}>
            <View pointerEvents="none" style={styles.backdropLayer}>
              <View style={[styles.blurOrb, styles.orbPeach]} />
              <View style={[styles.blurOrb, styles.orbSky]} />
              <View style={[styles.blurOrb, styles.orbLavender]} />
            </View>
            <SafeAreaView style={styles.flex}>
              <BackButton onPress={() => setStep(STEPS.verification)} />
              <AuthContainer>
                <View style={styles.locationContent}>
                  <Image source={ASSETS.locationIllustration} style={styles.locationIllustration} resizeMode="contain" />
                  <Text style={styles.centerTitle}>Select Your Location</Text>
                  <Text style={styles.centerSubtitle}>
                    {"Switch on your location to stay in tune with what's happening in your area"}
                  </Text>
                  <SelectionInput
                    label="Your Zone"
                    value={form.zone}
                    onChangeText={(value) => updateField('zone', value)}
                    placeholder="Banasree"
                  />
                  <SelectionInput
                    label="Your Area"
                    value={form.area}
                    onChangeText={(value) => updateField('area', value)}
                    placeholder="Types of your area"
                  />
                  <PrimaryButton title="Submit" onPress={() => setStep(STEPS.login)} style={styles.submitButton} />
                </View>
              </AuthContainer>
            </SafeAreaView>
          </View>
        ) : null}

        {step === STEPS.login ? (
          <View style={styles.formScreen}>
            <View pointerEvents="none" style={styles.backdropLayer}>
              <View style={[styles.blurOrb, styles.orbPeach]} />
              <View style={[styles.blurOrb, styles.orbSky]} />
              <View style={[styles.blurOrb, styles.orbLavender]} />
            </View>
            <AuthContainer>
              <View style={styles.accountContent}>
                <Image source={ASSETS.carrot} style={styles.accountIcon} resizeMode="contain" />
                <Text style={styles.formTitle}>Login</Text>
                <Text style={styles.formSubtitle}>Enter your emails and password</Text>
                <CardInput
                  value={form.loginEmail}
                  onChangeText={(value) => updateField('loginEmail', value)}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textSoft} />}
                />
                <CardInput
                  value={form.loginPassword}
                  onChangeText={(value) => updateField('loginPassword', value)}
                  placeholder="Password"
                  secureTextEntry={!showLoginPassword}
                  autoCapitalize="none"
                  icon={<Feather name="lock" size={20} color={COLORS.textSoft} />}
                  trailing={
                    <Pressable onPress={() => setShowLoginPassword((current) => !current)} style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}>
                      <Feather name={showLoginPassword ? 'eye-off' : 'eye'} size={18} color={COLORS.textSoft} />
                    </Pressable>
                  }
                />
                <Pressable style={({ pressed }) => [styles.forgotLinkWrap, pressed && styles.pressed]}>
                  <Text style={styles.forgotLink}>Forgot Password?</Text>
                </Pressable>
                <PrimaryButton title="Log In" onPress={handleLogin} disabled={!canLogin} />
                <Text style={styles.footerCopy}>
                  {"Don't have an account? "}
                  <Text style={styles.footerAction} onPress={() => setStep(STEPS.signUp)}>
                    Signup
                  </Text>
                </Text>
              </View>
            </AuthContainer>
          </View>
        ) : null}

        {step === STEPS.signUp ? (
          <View style={styles.formScreen}>
            <View pointerEvents="none" style={styles.backdropLayer}>
              <View style={[styles.blurOrb, styles.orbPeach]} />
              <View style={[styles.blurOrb, styles.orbSky]} />
              <View style={[styles.blurOrb, styles.orbLavender]} />
            </View>
            <AuthContainer>
              <View style={styles.accountContent}>
                <Image source={ASSETS.carrot} style={styles.accountIcon} resizeMode="contain" />
                <Text style={styles.formTitle}>Sign Up</Text>
                <Text style={styles.formSubtitle}>Enter your details to continue</Text>
                <CardInput
                  value={form.signUpName}
                  onChangeText={(value) => updateField('signUpName', value)}
                  placeholder="Username"
                  icon={<Feather name="user" size={20} color={COLORS.textSoft} />}
                />
                <CardInput
                  value={form.signUpEmail}
                  onChangeText={(value) => updateField('signUpEmail', value)}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textSoft} />}
                  trailing={<Feather name="check" size={18} color={COLORS.primary} />}
                />
                <CardInput
                  value={form.signUpPassword}
                  onChangeText={(value) => updateField('signUpPassword', value)}
                  placeholder="Password"
                  secureTextEntry={!showSignUpPassword}
                  autoCapitalize="none"
                  icon={<Feather name="lock" size={20} color={COLORS.textSoft} />}
                  trailing={
                    <Pressable onPress={() => setShowSignUpPassword((current) => !current)} style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}>
                      <Feather name={showSignUpPassword ? 'eye-off' : 'eye'} size={18} color={COLORS.textSoft} />
                    </Pressable>
                  }
                />
                <Text style={styles.termsCopy}>
                  By continuing you agree to our <Text style={styles.footerAction}>Terms of Service</Text> and{' '}
                  <Text style={styles.footerAction}>Privacy Policy</Text>.
                </Text>
                <PrimaryButton title="Sign Up" onPress={handleSignUp} disabled={!canSignUp} />
                <Text style={styles.footerCopy}>
                  {'Already have an account? '}
                  <Text style={styles.footerAction} onPress={() => setStep(STEPS.login)}>
                    Login
                  </Text>
                </Text>
              </View>
            </AuthContainer>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.88,
  },
  buttonPressed: {
    transform: [{ scale: 0.985 }],
  },
  splashScreen: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 210,
    height: 54,
  },
  onboardingScreen: {
    flex: 1,
    backgroundColor: '#274C3A',
  },
  onboardingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  onboardingBadge: {
    width: 44,
    height: 54,
    marginBottom: 26,
    tintColor: COLORS.white,
  },
  onboardingTitle: {
    color: COLORS.white,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
    maxWidth: 270,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    marginTop: 10,
    marginBottom: 36,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 270,
  },
  screenBase: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  signInHero: {
    width: '100%',
    height: 330,
  },
  signInCard: {
    marginTop: -42,
    minHeight: 560,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    backgroundColor: COLORS.white,
    paddingHorizontal: 26,
    paddingTop: 34,
    paddingBottom: 34,
  },
  brandIcon: {
    width: 40,
    height: 48,
    alignSelf: 'center',
    marginBottom: 26,
  },
  mainTitle: {
    color: COLORS.text,
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '700',
    marginBottom: 28,
    maxWidth: 260,
  },
  countryPicker: {
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagBadge: {
    minWidth: 34,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#E8F6ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  countryCode: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  socialHelper: {
    color: COLORS.textSoft,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButton: {
    minHeight: 66,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  socialIcon: {
    position: 'absolute',
    left: 22,
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  formScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backdropLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blurOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.6,
  },
  orbPeach: {
    top: -70,
    right: -40,
    backgroundColor: COLORS.peach,
  },
  orbSky: {
    top: 90,
    right: 70,
    backgroundColor: COLORS.sky,
  },
  orbLavender: {
    bottom: -85,
    left: -60,
    backgroundColor: COLORS.lavender,
  },
  heroBanner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 250,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  formScrollContent: {
    minHeight: 660,
    paddingTop: 175,
    paddingHorizontal: 26,
    paddingBottom: 34,
  },
  formTitle: {
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    marginBottom: 12,
  },
  formSubtitle: {
    color: COLORS.textSoft,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 28,
  },
  underlineBlock: {
    marginTop: 20,
  },
  fieldLabel: {
    color: COLORS.textSoft,
    fontSize: 15,
    marginBottom: 12,
  },
  underlineField: {
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefix: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  underlineInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    paddingVertical: 12,
  },
  inlineLinkWrap: {
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  inlineLink: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  arrowButtonRow: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingTop: 32,
  },
  arrowButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    minHeight: 66,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.primaryMuted,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  locationContent: {
    minHeight: 680,
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 34,
  },
  locationIllustration: {
    width: 172,
    height: 140,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 22,
  },
  centerTitle: {
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  centerSubtitle: {
    color: COLORS.textSoft,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 18,
  },
  selectionBlock: {
    marginBottom: 18,
  },
  selectionField: {
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingLeft: 16,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 12,
    marginRight: 10,
  },
  submitButton: {
    marginTop: 14,
  },
  accountContent: {
    minHeight: 680,
    paddingHorizontal: 26,
    paddingTop: 48,
    paddingBottom: 34,
  },
  accountIcon: {
    width: 46,
    height: 54,
    alignSelf: 'center',
    marginBottom: 26,
  },
  cardInput: {
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    width: 28,
    alignItems: 'flex-start',
  },
  cardTextInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 16,
  },
  cardTrailing: {
    marginLeft: 10,
  },
  eyeButton: {
    padding: 4,
  },
  forgotLinkWrap: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 28,
  },
  forgotLink: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  footerCopy: {
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 14,
    marginTop: 22,
  },
  footerAction: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  termsCopy: {
    color: COLORS.textSoft,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
    marginBottom: 26,
  },
});
