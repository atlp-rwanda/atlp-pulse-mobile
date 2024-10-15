import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/internationalization'; 
import LanguagePicker from '@/components/LanguagePicker';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'light'), 
}));

describe('LanguagePicker', () => {
  it('renders the picker component and allows language selection', () => {
    const { getByTestId, getByText } = render(
      <I18nextProvider i18n={i18n}>
        <LanguagePicker />
      </I18nextProvider>
    );

    expect(getByTestId('language-picker')).toBeTruthy();

    const picker = getByTestId('language-picker');
    expect(picker.props.selectedValue).toBe('en');
    fireEvent(picker, 'onValueChange', 'fr');
    expect(i18n.language).toBe('fr');
    expect(getByText('Français')).toBeTruthy();
  });
});
