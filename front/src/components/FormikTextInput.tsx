import { StyleSheet, TextInputProps } from 'react-native';
import { useField } from 'formik';

import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  },
  loginField: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d5dbd7',
    marginBottom: 10,
    borderRadius: 4,
    paddingLeft: 15
  }
});

interface Props extends TextInputProps {
  name: string;
}

const FormikTextInput = ({ name, ...props }: Props): JSX.Element => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched;
  const { error } = meta;
  console.log(meta);
  return (
    <>
      <TextInput
        style={styles.loginField}
        onChangeText={(value: string): void => helpers.setValue(value)}
        onBlur={(): void => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikTextInput;
