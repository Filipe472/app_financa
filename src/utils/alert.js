import { Alert, Platform } from 'react-native';

/**
 * Alert multiplataforma que funciona na web e no mobile.
 * Na web usa window.alert/window.confirm, no mobile usa Alert.alert nativo.
 */
export const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      // Se tem mais de um botão, usar confirm
      const result = window.confirm(`${title}\n\n${message}`);
      if (result) {
        // Encontra o botão "destrutivo" ou o segundo botão
        const confirmButton = buttons.find(
          (b) => b.style === 'destructive' || b.style !== 'cancel'
        );
        if (confirmButton && confirmButton.onPress) {
          confirmButton.onPress();
        }
      }
    } else {
      // Alerta simples
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};
